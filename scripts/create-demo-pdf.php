<?php

require __DIR__ . '/../vendor/autoload.php';

$outDir = __DIR__ . '/../storage/app/demo';
if (!is_dir($outDir)) {
    mkdir($outDir, 0755, true);
}

$pdf = new \setasign\Fpdi\FpdfTpl();
$pdf->AddPage();
$pdf->SetFont('Helvetica', 'B', 16);
$pdf->Cell(0, 10, 'CubSign Demo Agreement', 0, 1, 'C');
$pdf->Ln(8);
$pdf->SetFont('Helvetica', '', 11);
$pdf->MultiCell(
    0,
    6,
    "This is a sample document for CubSign product screenshots.\n"
    ."It contains no real customer or private information.\n\n"
    ."Party A: Demo User\n"
    ."Party B: Example Counterparty\n\n"
    ."By signing below, the parties acknowledge this is a demonstration PDF only."
);
$pdf->Ln(20);
$pdf->Cell(90, 8, 'Signature: ________________', 0, 0);
$pdf->Cell(90, 8, 'Date: ____________', 0, 1);

$path = $outDir . '/cubsign-demo-agreement.pdf';
$pdf->Output('F', $path);
echo 'Wrote '.$path.' ('.filesize($path)." bytes)\n";
