# Recipient Signing Production Fix Report

**Date:** 2026-06-25  
**Scope:** Signature quality + signed PDF not updating after recipient completes signing

---

## 1. Root Cause

### PDF not updating (primary)

Three compounding failures:

| # | Issue | Effect |
|---|--------|--------|
| **R1** | `recipients.signed_fields` was MySQL **TEXT** (64 KB max) | Base64 signature PNGs were **truncated** on save → corrupt JSON/images → `SignedPdfService` skipped fields |
| **R2** | Signature images stored only inline in JSON | Large payloads; fragile for PDF generation |
| **R3** | `SignedPdfService` only runs when **last** recipient signs | Document stays `signed` (not `completed`) until then; owner download uses `pdf_path` (base PDF without overlays) |
| **R4** | If PDF generation fails (FPDI, empty fields, truncated data) | `signed_pdf_failed` activity; `signed_pdf_path` never set; download still serves original `pdf_path` |

Data was **not lost in the API** — it was lost or corrupted at **DB persistence** and never stamped because generation failed or never completed.

### Signature quality (secondary)

| Issue | Effect |
|--------|--------|
| Canvas fixed low resolution (320×120) with CSS scaling | Jagged strokes on retina/mobile |
| Simple `lineTo` between points | No velocity smoothing or bezier curves |
| `toDataURL()` without quality flag | Lower export quality |

---

## 2. Files Modified

| File | Change |
|------|--------|
| `database/migrations/2026_06_25_000001_change_recipients_signed_fields_to_longtext.php` | **New** — `signed_fields` → LONGTEXT |
| `app/Services/RecipientSignatureStorage.php` | **New** — save PNGs to disk, store paths in JSON |
| `app/Services/SignedPdfService.php` | Load images from disk or data URI; detailed logging; zero-stamp guard |
| `app/Http/Controllers/RecipientSignController.php` | Persist images; refresh document; structured logging |
| `app/Http/Controllers/Web/Workspace/DocumentDownloadController.php` | Log which path is served |
| `resources/js/utils/signatureCanvas.js` | **New** — DPR scaling, velocity strokes, quadratic curves |
| `resources/js/Pages/RecipientSign.vue` | Use signature canvas; validate fields; high-res export |

---

## 3. Database Impact

**Migration required on production:**

```bash
php artisan migrate --force
```

| Column | Before | After |
|--------|--------|-------|
| `recipients.signed_fields` | TEXT (64 KB) | LONGTEXT (4 GB) |

**New storage paths** (documents disk):

```
storage/app/private/signatures/recipient_{id}/field_{fieldId}.png
storage/app/private/signed/user_{userId}/signed_{docId}_{timestamp}.pdf
```

No new tables. `signed_fields` JSON now stores:

```json
[
  { "id": 1, "type": "signature", "value": "signatures/recipient_5/field_1.png" },
  { "id": 2, "type": "text", "value": "John Smith" }
]
```

Legacy inline `data:image/png;base64,...` values still supported by `SignedPdfService`.

---

## 4. API Impact

**No route changes.** `POST /r/{token}/complete` payload unchanged:

```json
{
  "signed_fields": [
    { "id": 1, "type": "signature", "value": "data:image/png;base64,..." },
    { "id": 2, "type": "initials", "value": "data:image/png;base64,..." },
    { "id": 3, "type": "text", "value": "Hello" }
  ]
}
```

Server now:
1. Decodes images → saves to `signatures/...`
2. Stores paths in `signed_fields`
3. Generates final PDF when last recipient signs
4. Sets `documents.status = completed` and `signed_pdf_path`

---

## 5. Before / After Flow

### Before

```
Recipient draws → toDataURL (low-res)
  → POST complete → signed_fields TEXT column (TRUNCATED if >64KB)
  → SignedPdfService: empty/corrupt image → skip field
  → signed_pdf_path = null, status ≠ completed
  → Owner download → pdf_path (original, no signatures)
```

### After

```
Recipient draws → signatureCanvas (DPR + bezier, PNG quality 1.0)
  → POST complete → images saved to signatures/recipient_*/
  → signed_fields LONGTEXT with file paths + text values
  → Last recipient → SignedPdfService stamps all fields
  → signed_pdf_path set, status = completed
  → Owner download → signed_pdf_path (final PDF with all fields)
```

---

## 6. Test Cases

| # | Test | Expected |
|---|------|----------|
| T1 | Single recipient signs signature + text | `status=completed`, `signed_pdf_path` set, download shows signature |
| T2 | Multi-recipient A then B | A signs → still `pdf_path` on download; B signs → `signed_pdf_path` with both |
| T3 | Large signature (many strokes) | No truncation; file in `signatures/recipient_*` |
| T4 | Mobile draw | Smooth strokes, no jagged lines |
| T5 | Submit without drawing signature | Client error: complete all signature fields |
| T6 | FPDI-incompatible PDF | `signed_pdf_failed` activity; check `storage/logs/cubsign.log` |

---

## 7. Verification Steps (Production)

1. **Deploy + migrate:**
   ```bash
   composer install --no-dev --optimize-autoloader
   npm ci && npm run build
   php artisan migrate --force
   php artisan config:cache && php artisan route:cache && php artisan view:cache
   ```

2. **Send document to test recipient** (Finish → Prepare workflow).

3. **Recipient signs** all assigned fields → Finish Signing.

4. **Check logs:**
   ```bash
   grep "RecipientSignController::complete" storage/logs/cubsign.log
   grep "RecipientSignatureStorage" storage/logs/cubsign.log
   grep "SignedPdfService" storage/logs/cubsign.log
   grep "DocumentDownloadController" storage/logs/cubsign.log
   ```

5. **Check database:**
   ```sql
   SELECT status, signed_fields FROM recipients WHERE id = ?;
   SELECT status, pdf_path, signed_pdf_path FROM documents WHERE id = ?;
   ```

6. **Check files exist:**
   ```bash
   ls storage/app/private/signatures/recipient_*/
   ls storage/app/private/signed/user_*/
   ```

7. **Owner download** from workspace — log should show `serving_path` = `signed_pdf_path`.

8. **If `signed_pdf_failed`:** re-export source PDF (PDF 1.4 compatible); check FPDI error in log.

---

## Monitoring Log Keys

| Log message | Meaning |
|-------------|---------|
| `RecipientSignController::complete request` | Payload received |
| `RecipientSignatureStorage: image saved` | PNG persisted to disk |
| `SignedPdfService: complete` | Final PDF written (`stamped` count) |
| `SignedPdfService: zero fields stamped` | Generation failed — no overlays applied |
| `DocumentDownloadController` | Which file owner received |

Remove or reduce `debug` logs after production validation if desired.
