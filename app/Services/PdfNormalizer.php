<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

/**
 * Produce an FPDI-compatible PDF from pdf-lib / modern PDFs (object streams, PDF 1.5+).
 */
class PdfNormalizer
{
    /**
     * @return array{path: string, method: string, cleanup: bool}|null
     */
    public function normalize(string $absPath): ?array
    {
        if (! is_readable($absPath)) {
            return null;
        }

        foreach (['node_pdf_lib', 'qpdf', 'ghostscript', 'imagick'] as $method) {
            $result = match ($method) {
                'qpdf'         => $this->viaQpdf($absPath),
                'ghostscript'  => $this->viaGhostscript($absPath),
                'imagick'      => $this->viaImagick($absPath),
                'node_pdf_lib' => $this->viaNodePdfLib($absPath),
            };

            if ($result !== null) {
                Log::channel('cubsign')->info('PdfNormalizer: success', [
                    'method'      => $method,
                    'source'      => $absPath,
                    'output'      => $result['path'],
                    'output_bytes'=> filesize($result['path']) ?: 0,
                ]);

                return ['path' => $result['path'], 'method' => $method, 'cleanup' => true];
            }
        }

        return null;
    }

    /**
     * @return array{path: string}|null
     */
    private function viaQpdf(string $absPath): ?array
    {
        $qpdf = $this->binary('qpdf');
        if ($qpdf === null) {
            return null;
        }

        $out = tempnam(sys_get_temp_dir(), 'csnorm_') . '.pdf';
        $cmd = sprintf(
            '%s --stream-data=uncompress %s %s 2>&1',
            escapeshellarg($qpdf),
            escapeshellarg($absPath),
            escapeshellarg($out),
        );

        return $this->runAndVerify($cmd, $out);
    }

    /**
     * @return array{path: string}|null
     */
    private function viaGhostscript(string $absPath): ?array
    {
        $gs = $this->binary('gswin64c') ?? $this->binary('gswin32c') ?? $this->binary('gs');
        if ($gs === null) {
            return null;
        }

        $out = tempnam(sys_get_temp_dir(), 'csnorm_') . '.pdf';
        $cmd = sprintf(
            '%s -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/prepress -dNOPAUSE -dQUIET -dBATCH -sOutputFile=%s %s 2>&1',
            escapeshellarg($gs),
            escapeshellarg($out),
            escapeshellarg($absPath),
        );

        return $this->runAndVerify($cmd, $out);
    }

    /**
     * @return array{path: string}|null
     */
    private function viaImagick(string $absPath): ?array
    {
        if (! extension_loaded('imagick') || ! class_exists(\Imagick::class)) {
            return null;
        }

        try {
            $im = new \Imagick();
            $im->setResolution(200, 200);
            $im->readImage($absPath);
            $im->setImageFormat('pdf');
            $im->setOption('pdf:compatibility-level', '1.4');

            $out = tempnam(sys_get_temp_dir(), 'csnorm_') . '.pdf';
            $im->writeImages($out, true);
            $im->clear();
            $im->destroy();

            if (! is_readable($out) || (filesize($out) ?: 0) === 0) {
                @unlink($out);

                return null;
            }

            return ['path' => $out];
        } catch (\Throwable $e) {
            Log::channel('cubsign')->warning('PdfNormalizer: Imagick failed', [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Re-save via project's pdf-lib (Node) — strips object streams for FPDI.
     *
     * @return array{path: string}|null
     */
    private function viaNodePdfLib(string $absPath): ?array
    {
        $node = $this->binary('node');
        if ($node === null) {
            return null;
        }

        $script = base_path('scripts/normalize-pdf.mjs');
        if (! is_readable($script)) {
            return null;
        }

        $out = tempnam(sys_get_temp_dir(), 'csnorm_') . '.pdf';
        $cmd = sprintf(
            '%s %s %s %s 2>&1',
            escapeshellarg($node),
            escapeshellarg($script),
            escapeshellarg($absPath),
            escapeshellarg($out),
        );

        return $this->runAndVerify($cmd, $out);
    }

    /**
     * @return array{path: string}|null
     */
    private function runAndVerify(string $cmd, string $outPath): ?array
    {
        $output = [];
        $code   = 1;
        exec($cmd, $output, $code);

        if ($code !== 0 || ! is_readable($outPath) || (filesize($outPath) ?: 0) === 0) {
            @unlink($outPath);

            return null;
        }

        return ['path' => $outPath];
    }

    private function binary(string $name): ?string
    {
        $output = [];
        $code   = 1;
        exec(escapeshellarg($name) . ' --version 2>&1', $output, $code);

        return $code === 0 ? $name : null;
    }

    public function inspectPdf(string $absPath): array
    {
        $info = [
            'bytes'    => is_readable($absPath) ? (filesize($absPath) ?: 0) : 0,
            'header'   => null,
            'has_objstm' => false,
        ];

        if (! is_readable($absPath)) {
            return $info;
        }

        $head = file_get_contents($absPath, false, null, 0, 8192);
        if (is_string($head) && preg_match('/%PDF-(\d\.\d)/', $head, $m)) {
            $info['header'] = $m[0];
        }

        $body = file_get_contents($absPath, false, null, 0, 65536);
        if (is_string($body)) {
            $info['has_objstm'] = str_contains($body, '/ObjStm') || str_contains($body, '/objstm');
        }

        return $info;
    }
}
