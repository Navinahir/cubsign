<?php

namespace App\Services;

use App\Models\Document;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use setasign\Fpdi\Fpdi;

class SignedPdfService
{
    private PdfNormalizer $normalizer;

    public function __construct(?PdfNormalizer $normalizer = null)
    {
        $this->normalizer = $normalizer ?? new PdfNormalizer();
    }

    /**
     * Overlay all recipient signed_fields onto the base PDF and save the result.
     * Returns the storage path (relative to the documents disk) or null on failure.
     */
    public function generate(Document $document): ?string
    {
        Log::channel('cubsign')->info('SIGNED_PDF_START', [
            'document_id' => $document->id,
            'pdf_path'    => $document->pdf_path,
            'recipients'  => $document->recipients->count(),
        ]);

        try {
            return $this->generateInternal($document);
        } catch (\Throwable $e) {
            Log::channel('cubsign')->error('SIGNED_PDF_FAIL', [
                'document_id' => $document->id,
                'error'       => $e->getMessage(),
                'class'       => $e::class,
                'file'        => $e->getFile(),
                'line'        => $e->getLine(),
            ]);

            return null;
        }
    }

    private function generateInternal(Document $document): ?string
    {
        $editorState  = $document->editor_state ?? [];
        $placedFields = $editorState['placedFields'] ?? [];
        $editorScale  = max(0.1, (float) ($editorState['scale'] ?? 1.3));

        if ($placedFields === []) {
            Log::channel('cubsign')->error('SIGNED_PDF_FAIL', [
                'document_id' => $document->id,
                'error'       => 'no placedFields in editor_state',
            ]);

            return null;
        }

        $baseRelPath = $document->pdf_path;
        if (! $baseRelPath || ! Storage::disk('documents')->exists($baseRelPath)) {
            Log::channel('cubsign')->error('SIGNED_PDF_FAIL', [
                'document_id' => $document->id,
                'error'       => 'base PDF missing on disk',
                'pdf_path'    => $baseRelPath,
            ]);

            return null;
        }

        $baseAbsPath = Storage::disk('documents')->path($baseRelPath);
        $sourceInfo  = $this->normalizer->inspectPdf($baseAbsPath);

        Log::channel('cubsign')->info('SIGNED_PDF_SOURCE_INFO', [
            'document_id'  => $document->id,
            'pdf_path'     => $baseRelPath,
            'absolute_path'=> $baseAbsPath,
            'bytes'        => $sourceInfo['bytes'],
            'pdf_header'   => $sourceInfo['header'],
            'has_objstm'   => $sourceInfo['has_objstm'],
        ]);

        $positions = [];
        foreach ($placedFields as $pf) {
            $positions[(int) $pf['id']] = $pf;
        }

        $signedValues = [];
        foreach ($document->recipients as $recipient) {
            foreach ($recipient->signed_fields ?? [] as $sf) {
                $fieldId = (int) ($sf['id'] ?? 0);
                if ($fieldId === 0) {
                    continue;
                }
                $signedValues[$fieldId] = [
                    'type'  => $sf['type'] ?? '',
                    'value' => $sf['value'] ?? null,
                ];
            }
        }

        if ($signedValues === []) {
            Log::channel('cubsign')->error('SIGNED_PDF_FAIL', [
                'document_id' => $document->id,
                'error'       => 'no signed field values from recipients',
            ]);

            return null;
        }

        $fpdiSource   = $baseAbsPath;
        $cleanupPaths = [];

        $pageCount = $this->openPdfWithFpdi($fpdiSource);

        if ($pageCount === null) {
            $normalized = $this->normalizer->normalize($baseAbsPath);

            if ($normalized !== null) {
                $fpdiSource     = $normalized['path'];
                $cleanupPaths[] = $normalized['path'];

                Log::channel('cubsign')->info('SIGNED_PDF_SOURCE_INFO', [
                    'document_id' => $document->id,
                    'normalized'  => true,
                    'method'      => $normalized['method'],
                ]);

                $pageCount = $this->openPdfWithFpdi($fpdiSource);
            }
        }

        if ($pageCount === null) {
            Log::channel('cubsign')->error('SIGNED_PDF_FAIL', [
                'document_id' => $document->id,
                'error'       => 'FPDI could not open base PDF after normalization attempts',
            ]);

            return null;
        }

        Log::channel('cubsign')->info('SIGNED_PDF_PAGE_COUNT', [
            'document_id' => $document->id,
            'page_count'  => $pageCount,
        ]);

        $pdf = new Fpdi('P', 'pt');
        $pdf->SetAutoPageBreak(false);

        try {
            $pdf->setSourceFile($fpdiSource);
        } catch (\Throwable $e) {
            Log::channel('cubsign')->error('SIGNED_PDF_FAIL', [
                'document_id' => $document->id,
                'error'       => $e->getMessage(),
                'class'       => $e::class,
            ]);

            return null;
        }

        $byPage = [];
        foreach ($placedFields as $pf) {
            $byPage[(int) ($pf['pageNum'] ?? 1)][] = $pf;
        }

        $tempFiles = [];
        $stamped   = 0;
        $stampedIds = [];

        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            $templateId = $pdf->importPage($pageNo);
            $size       = $pdf->getTemplateSize($templateId);

            $pdf->AddPage($size['orientation'] ?? 'P', [$size['width'], $size['height']]);
            $pdf->useTemplate($templateId, 0, 0, $size['width'], $size['height']);

            foreach ($byPage[$pageNo] ?? [] as $pf) {
                $fieldId = (int) $pf['id'];

                if (! isset($signedValues[$fieldId])) {
                    continue;
                }

                $type  = $signedValues[$fieldId]['type'];
                $value = $signedValues[$fieldId]['value'];

                $x = (float) $pf['x'] / $editorScale;
                $y = (float) $pf['y'] / $editorScale;
                $w = (float) $pf['w'] / $editorScale;
                $h = (float) $pf['h'] / $editorScale;

                if ($w <= 0 || $h <= 0) {
                    continue;
                }

                if ($type === 'signature' || $type === 'initials') {
                    $imagePath = $this->resolveImagePath($value, $document->id, $fieldId);
                    if (! $imagePath || ! file_exists($imagePath)) {
                        continue;
                    }

                    $imageType = $this->imageTypeForPath($imagePath);
                    $pdf->Image($imagePath, $x, $y, $w, $h, $imageType);
                    $stamped++;
                    $stampedIds[] = $fieldId;

                    Log::channel('cubsign')->info('SIGNED_PDF_FIELD_STAMPED', [
                        'document_id' => $document->id,
                        'field_id'    => $fieldId,
                        'type'        => $type,
                        'page_no'     => $pageNo,
                    ]);

                    if (is_string($value) && str_starts_with($value, 'data:image/')) {
                        $tempFiles[] = $imagePath;
                    }
                } elseif (in_array($type, ['date', 'name', 'text'], true)) {
                    $text = trim((string) ($value ?? ''));
                    if ($text === '') {
                        continue;
                    }

                    $fontSize = (float) max(8, min(14, $h * 0.55));
                    $pdf->SetFont('Helvetica', '', $fontSize);
                    $pdf->SetTextColor(0, 0, 0);
                    $pdf->Text($x + 2, $y + $h * 0.72, $text);
                    $stamped++;
                    $stampedIds[] = $fieldId;

                    Log::channel('cubsign')->info('SIGNED_PDF_FIELD_STAMPED', [
                        'document_id' => $document->id,
                        'field_id'    => $fieldId,
                        'type'        => $type,
                        'page_no'     => $pageNo,
                    ]);
                } elseif ($type === 'checkbox' && $value) {
                    $pdf->SetDrawColor(26, 26, 204);
                    $pdf->SetLineWidth(1.5);
                    $pdf->Line($x + $w * 0.15, $y + $h * 0.55, $x + $w * 0.42, $y + $h * 0.80);
                    $pdf->Line($x + $w * 0.42, $y + $h * 0.80, $x + $w * 0.85, $y + $h * 0.28);
                    $stamped++;
                    $stampedIds[] = $fieldId;

                    Log::channel('cubsign')->info('SIGNED_PDF_FIELD_STAMPED', [
                        'document_id' => $document->id,
                        'field_id'    => $fieldId,
                        'type'        => $type,
                        'page_no'     => $pageNo,
                    ]);
                }
            }
        }

        $stampedIds = array_values(array_unique($stampedIds));
        $signedFieldIds = array_keys($signedValues);
        $missingFields = array_values(array_diff($signedFieldIds, $stampedIds));

        $typeCounts = [];
        foreach ($placedFields as $pf) {
            $fid = (int) ($pf['id'] ?? 0);
            if (! in_array($fid, $stampedIds, true)) {
                continue;
            }
            $type = (string) ($pf['type'] ?? 'unknown');
            $typeCounts[$type] = ($typeCounts[$type] ?? 0) + 1;
        }

        Log::channel('cubsign')->info('STAMP_FIELDS', [
            'document_id'     => $document->id,
            'recipient_id'    => null,
            'expected_fields' => count($signedFieldIds),
            'stamped_fields'  => count($stampedIds),
            'missing_fields'  => $missingFields,
            'field_count'     => count($stampedIds),
            'field_types'     => $typeCounts,
            'field_ids'       => $stampedIds,
        ]);

        if ($missingFields !== []) {
            Log::channel('cubsign')->warning('STAMP_FIELDS mismatch', [
                'document_id'    => $document->id,
                'expected'       => count($signedFieldIds),
                'stamped'        => count($stampedIds),
                'missing_fields' => $missingFields,
            ]);
        }

        if ($stamped === 0) {
            Log::channel('cubsign')->error('SIGNED_PDF_FAIL', [
                'document_id' => $document->id,
                'error'       => 'zero fields stamped',
            ]);

            return null;
        }

        $dir      = "signed/user_{$document->user_id}";
        $filename = "signed_{$document->id}_" . time() . '.pdf';
        $relPath  = $dir . '/' . $filename;

        Storage::disk('documents')->makeDirectory($dir);
        $absPath = Storage::disk('documents')->path($relPath);

        $pdf->Output('F', $absPath);

        foreach (array_merge($tempFiles, $cleanupPaths) as $f) {
            @unlink($f);
        }

        $outputBytes = file_exists($absPath) ? (filesize($absPath) ?: 0) : 0;

        Log::channel('cubsign')->info('SIGNED_PDF_OUTPUT_CREATED', [
            'document_id'   => $document->id,
            'relative_path' => $relPath,
            'bytes'         => $outputBytes,
            'stamped'       => $stamped,
        ]);

        if ($outputBytes === 0) {
            Log::channel('cubsign')->error('SIGNED_PDF_FAIL', [
                'document_id' => $document->id,
                'error'       => 'output file empty',
            ]);

            return null;
        }

        Log::channel('cubsign')->info('SIGNED_PDF_SUCCESS', [
            'document_id'     => $document->id,
            'signed_pdf_path' => $relPath,
            'stamped'         => $stamped,
        ]);

        return $relPath;
    }

    private function openPdfWithFpdi(string $absPath): ?int
    {
        $probe = new Fpdi('P', 'pt');

        try {
            return $probe->setSourceFile($absPath);
        } catch (\Throwable) {
            return null;
        }
    }

    private function resolveImagePath(mixed $value, int $documentId, int $fieldId): ?string
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        if (str_starts_with($value, 'data:image/')) {
            if (! preg_match('#^data:image/(png|jpeg|jpg);base64,(.+)$#s', $value, $matches)) {
                return null;
            }
            $pngData = base64_decode($matches[2], true);
            if ($pngData === false || $pngData === '') {
                return null;
            }
            $tmpFile = tempnam(sys_get_temp_dir(), 'csig_') . '.png';
            file_put_contents($tmpFile, $pngData);

            return $tmpFile;
        }

        if (Storage::disk('documents')->exists($value)) {
            return Storage::disk('documents')->path($value);
        }

        Log::channel('cubsign')->warning('SignedPdfService: image path not found', [
            'document_id' => $documentId,
            'field_id'    => $fieldId,
            'value'       => $value,
        ]);

        return null;
    }

    private function imageTypeForPath(string $path): string
    {
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        return in_array($ext, ['jpg', 'jpeg'], true) ? 'JPEG' : 'PNG';
    }
}
