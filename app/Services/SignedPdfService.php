<?php

namespace App\Services;

use App\Models\Document;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use setasign\Fpdi\Fpdi;

class SignedPdfService
{
    /**
     * Overlay all recipient signed_fields onto the base PDF and save the result.
     * Returns the storage path (relative to the documents disk) or null on failure.
     */
    public function generate(Document $document): ?string
    {
        $editorState  = $document->editor_state ?? [];
        $placedFields = $editorState['placedFields'] ?? [];
        $editorScale  = max(0.1, (float) ($editorState['scale'] ?? 1.3));

        // Build lookup: field_id → placed field (position + page info)
        $positions = [];
        foreach ($placedFields as $pf) {
            $positions[(int) $pf['id']] = $pf;
        }

        // Build lookup: field_id → signed value (from all recipients' signed_fields)
        $signedValues = [];
        foreach ($document->recipients as $recipient) {
            foreach ($recipient->signed_fields ?? [] as $sf) {
                $signedValues[(int) $sf['id']] = [
                    'type'  => $sf['type'],
                    'value' => $sf['value'],
                ];
            }
        }

        if (empty($signedValues)) {
            return null;
        }

        $basePath = Storage::disk('documents')->path($document->pdf_path);

        $pdf = new Fpdi('P', 'pt');
        $pdf->SetAutoPageBreak(false);

        try {
            $pageCount = $pdf->setSourceFile($basePath);
        } catch (\Exception $e) {
            Log::channel('cubsign')->error('SignedPdfService: could not open base PDF', [
                'document_id' => $document->id,
                'error'       => $e->getMessage(),
            ]);
            return null;
        }

        // Group placed fields by page number
        $byPage = [];
        foreach ($placedFields as $pf) {
            $byPage[(int) ($pf['pageNum'] ?? 1)][] = $pf;
        }

        $tempFiles = [];

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

                // Convert editor pixels → PDF points (FPDF origin is top-left, same as CSS — no Y flip needed)
                $x = (float) $pf['x'] / $editorScale;
                $y = (float) $pf['y'] / $editorScale;
                $w = (float) $pf['w'] / $editorScale;
                $h = (float) $pf['h'] / $editorScale;

                if ($type === 'signature' || $type === 'initials') {
                    if (! $value || ! str_starts_with((string) $value, 'data:image/png;base64,')) {
                        continue;
                    }
                    $pngData  = base64_decode(substr($value, strlen('data:image/png;base64,')));
                    $tmpFile  = tempnam(sys_get_temp_dir(), 'csig_') . '.png';
                    file_put_contents($tmpFile, $pngData);
                    $tempFiles[] = $tmpFile;

                    $pdf->Image($tmpFile, $x, $y, $w, $h, 'PNG');

                } elseif ($type === 'date' || $type === 'name' || $type === 'text') {
                    $text = trim((string) ($value ?? ''));
                    if ($text === '') {
                        continue;
                    }
                    $fontSize = (float) max(8, min(14, $h * 0.55));
                    $pdf->SetFont('Helvetica', '', $fontSize);
                    $pdf->SetTextColor(0, 0, 0);
                    // Place text baseline roughly in vertical center of the field box
                    $pdf->Text($x + 2, $y + $h * 0.72, $text);

                } elseif ($type === 'checkbox') {
                    if (! $value) {
                        continue;
                    }
                    $pdf->SetDrawColor(26, 26, 204);
                    $pdf->SetLineWidth(1.5);
                    // Draw a checkmark (two lines forming a tick)
                    $pdf->Line($x + $w * 0.15, $y + $h * 0.55, $x + $w * 0.42, $y + $h * 0.80);
                    $pdf->Line($x + $w * 0.42, $y + $h * 0.80, $x + $w * 0.85, $y + $h * 0.28);
                }
            }
        }

        // Store the completed PDF
        $dir      = "signed/user_{$document->user_id}";
        $filename = "signed_{$document->id}_" . time() . '.pdf';
        $relPath  = $dir . '/' . $filename;

        Storage::disk('documents')->makeDirectory($dir);
        $absPath = Storage::disk('documents')->path($relPath);

        $pdf->Output('F', $absPath);

        foreach ($tempFiles as $f) {
            @unlink($f);
        }

        return $relPath;
    }
}
