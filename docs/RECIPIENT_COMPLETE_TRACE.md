# Recipient complete() — Execution Trace & Log Guide

**Purpose:** Prove whether `status=completed` and `signed_pdf_path` are set after recipient signing.  
**Log file:** `storage/logs/cubsign.log`  
**Do not modify:** `DocumentDownloadController` (download logic is correct).

---

## Execution path (code order)

```
POST /r/{token}/complete
  └─ RecipientSignController::complete()
       ├─ LOG A: complete started
       ├─ [abort] recipient already signed → 422
       ├─ [abort] recipient pending (not their turn) → 422
       ├─ [abort] document missing → 404
       ├─ LOG B: signed_fields count
       ├─ persistImages() → recipient.update(status=signed, signed_fields=...)
       ├─ activity: recipient_signed
       ├─ find next recipient with status=pending
       │
       ├─ IF next recipient exists:
       │     activate next (status=sent), send mail
       │     SignedPdfService NOT called
       │     document.status stays signed (NOT completed)
       │
       └─ ELSE (last signer):
             LOG E: document status before update
             LOG C: calling SignedPdfService
             SignedPdfService::generate()
             LOG D: signedPath=... is_null=...
             IF signedPath truthy:
               document.update(status=completed, signed_pdf_path=...)
               LOG F: status after update
               LOG G: signed_pdf_path after update
               activity: document_completed
             ELSE:
               LOG D: signedPath is null
               LOG F/G: unchanged
               activity: signed_pdf_failed
       └─ final summary log (document_id, status, pdf_path, signed_pdf_path)
       └─ return { ok: true }   ← always 200 if no early abort
```

**Critical:** HTTP `{ ok: true }` does **not** mean `status=completed`. Success UI shows even when PDF generation fails.

---

## LOG reference

| Log | Meaning |
|-----|---------|
| **LOG A** | `complete()` entered |
| **LOG B** | Request field count after validation |
| **LOG C** | Last recipient — `SignedPdfService` invoked |
| **LOG D** | Return value: `signedPath` and `is_null` |
| **LOG E** | Document state before PDF gen / DB update |
| **LOG F** | `status` after branch (completed or unchanged) |
| **LOG G** | `signed_pdf_path` + `file_exists` on disk |

---

## SignedPdfService failure points (grep cubsign.log)

| Log message | Cause | Result |
|-------------|-------|--------|
| `FAIL: no placedFields in editor_state` | `documents.editor_state` empty/missing | `signedPath=null` |
| `FAIL: base PDF missing on disk` | `pdf_path` null or file gone | `signedPath=null` |
| `FAIL: FPDI could not open base PDF` | PDF 1.5+, encrypted, corrupt | `signedPath=null` |
| `FAIL: no signed field values` | All `recipients.signed_fields` empty | `signedPath=null` |
| `skip — image not resolved` | Truncated base64, bad path, missing PNG | field skipped |
| `FAIL: zero fields stamped` | Every field skipped | `signedPath=null` |
| `FAIL: Output() threw` | Write permission / disk full | `signedPath=null` |
| `FAIL: output file missing or empty` | Output failed silently | `signedPath=null` |
| `output saved` + `exists:true` | Success | `signedPath` set |

---

## Why status is NOT `completed` (decision tree)

### 1. `complete()` never reached LOG A
- Wrong URL / token
- CSRF failure
- 422 before LOG B (already signed / not your turn)

### 2. LOG A + LOG B but no LOG C
**Multi-recipient:** Another recipient still `pending`.  
→ `SignedPdfService` deferred until last signer.  
→ `status` remains `signed`.

Grep:
```bash
grep "SignedPdfService NOT called" storage/logs/cubsign.log
```

### 3. LOG C present, LOG D `is_null: true`
PDF generation failed. Check nearest `SignedPdfService FAIL:` line.

Grep:
```bash
grep "LOG D:" storage/logs/cubsign.log
grep "SignedPdfService FAIL" storage/logs/cubsign.log
```

### 4. LOG D has path, LOG F still not `completed`
Should not happen — update is in same `if ($signedPath)` block. Check DB transaction / replication lag.

### 5. LOG F `completed`, LOG G `file_exists: false`
Path written to DB but file missing — storage volume / permissions issue.

---

## Post-sign verification commands

```bash
# 1. Trace complete() for a document
grep "LOG [A-G]" storage/logs/cubsign.log | tail -30

# 2. Full flow for document ID 42
grep '"document_id":42' storage/logs/cubsign.log | tail -50

# 3. Check signed output directory
ls -la storage/app/private/signed/user_*/

# 4. Database
# SELECT id, status, pdf_path, signed_pdf_path FROM documents WHERE id = ?;
# SELECT id, status, signed_fields FROM recipients WHERE document_id = ?;
```

---

## Expected success sequence (single recipient)

```
LOG A: RecipientSignController complete started
LOG B: signed_fields count → signed_fields_count: 3
LOG E: document status before update → status: "signed"
LOG C: calling SignedPdfService
SignedPdfService: source PDF check → exists: true
SignedPdfService: FPDI loaded PDF → page_count: 7
SignedPdfService: stamping image field → image_exists: true
SignedPdfService: output saved → exists: true, bytes: >0
LOG D: SignedPdfService returned → signedPath: "signed/user_1/signed_42_....pdf", is_null: false
LOG F: document status after update → status: "completed"
LOG G: signed_pdf_path after update → file_exists: true
RecipientSignController::complete finished → status: "completed"
```

---

## Report template (fill after production test)

```
document_id:
status:              (expected: completed)
pdf_path:
signed_pdf_path:     (expected: signed/user_*/signed_{id}_*.pdf)

LOG A seen:          yes/no
LOG B field count:
LOG C seen:          yes/no  (no = multi-recipient, not last signer)
LOG D signedPath:
LOG D is_null:
LOG F status after:
LOG G file_exists:

storage/app/private/signed/ file present: yes/no

Root cause (from log line):
```
