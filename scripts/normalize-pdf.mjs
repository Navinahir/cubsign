/**
 * Re-save a PDF without object streams so FPDI's free parser can read it.
 * Usage: node scripts/normalize-pdf.mjs <input.pdf> <output.pdf>
 */
import { readFileSync, writeFileSync } from 'fs';
import { PDFDocument } from 'pdf-lib';

const [input, output] = process.argv.slice(2);

if (!input || !output) {
    console.error('Usage: node scripts/normalize-pdf.mjs <input> <output>');
    process.exit(1);
}

const bytes = readFileSync(input);
const doc   = await PDFDocument.load(bytes);
writeFileSync(output, await doc.save({ useObjectStreams: false }));
