# CubSign Staging Validation Report

**Date:** 2026-06-24  
**Method:** Read-only code review + workflow trace (no live browser execution)  
**Baseline:** Post Phase 1 hardening (`docs/PRODUCTION_READY.md`)  
**Scope:** End-to-end workflow validation across upload → editor → review → send → recipient sign → download

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Release readiness score** | **58 / 100** |
| **Self-sign workflow** | Staging-testable with minor warnings |
| **Multi-recipient workflow** | **Broken in default UI order** |
| **Recipient security (Phase 1)** | Pass |
| **Infrastructure** | Requires checklist before deploy |

### Final Recommendation: **READY FOR STAGING**

Deploy to a **private staging environment** for QA and manual E2E testing only. Do **not** expose to external users or production traffic until workflow bugs below are fixed and infrastructure checklist is complete.

> Production recommendation: **NOT READY** (see Section 12).

---

## Validation Method

Each workflow was traced through routes, controllers, services, and Vue pages. PHPUnit was not used as a gate — the existing test suite fails on SQLite due to a MySQL-specific migration (`information_schema` in `2026_06_22_000004`). No automated signing tests exist.

**Recommended manual QA order for multi-recipient:**

1. Editor → Review  
2. **Finish Signing** (Complete page auto-saves PDF via `sign.save`)  
3. Return to Review → **Prepare Requests**  
4. Recipients sign in sequence  

The default Review page button order (**Prepare** before **Finish**) breaks recipient PDF access.

---

## 1. Document Upload

| Test | Result | Notes |
|------|--------|-------|
| Upload valid PDF | **PASS** | `POST /sign` → `SignSessionService::upload()` → redirect editor |
| Multi-page PDF | **PASS** | Full file stored; editor renders pages sequentially (`Editor.vue`) |
| Large PDF (≤25 MB) | **PASS** | Server `max:25600`; client checks 25 MB (`UploadPdfRequest`, `Upload.vue`) |
| Large PDF (>25 MB) | **PASS** | Rejected with message: *"The file must not exceed 25 MB."* |
| Invalid file type | **PASS** | `mimes:pdf` server-side; `application/pdf` client-side |
| Corrupted / non-PDF renamed | **WARNING** | May pass upload if MIME sniffing succeeds; fails in editor PDF.js parse |
| Empty PDF | **WARNING** | May upload; editor parse fails |
| Guest repeat upload | **PASS** | Blocked when `guest_completed` session flag set |
| Auth user re-upload | **WARNING** | New draft `Document` each upload; prior drafts orphaned |
| Disk write failure | **FAIL** | `storeAs()` return value not checked (`SignSessionService.php:19`) |
| PHP `post_max_size` exceeded | **WARNING** | No app-level handling; opaque 413 from webserver |

**Files:** `UploadController.php`, `UploadPdfRequest.php`, `SignSessionService.php`, `Upload.vue`, `PdfController.php`

---

## 2. Editor Workflow

| Test | Result | Notes |
|------|--------|-------|
| Add recipient | **PASS** | `addRecipient()` in `Editor.vue` |
| Edit recipient name/email | **PASS** | `v-model` on recipient inputs |
| Remove recipient | **PASS** | Min 1 retained; fields reassigned to first recipient |
| Drag reorder (signing order) | **PASS** | Updates `signingOrder` |
| Add signature field | **PASS** | Placed with `signerId` from active recipient |
| Add initials field | **PASS** | Same placement logic |
| Add text field | **PASS** | |
| Add date field | **PASS** | Defaults to today on recipient side |
| Add checkbox field | **PASS** | Toggle after placement |
| Add name field | **PASS** | Field type supported |
| Autosave | **FAIL** | `persistEditorState()` only called from `goToReview()` — no debounced/continuous save |
| Draft restore (auth) | **PASS** | `EditorController` + `Editor.vue` onMount restores `editor_state` |
| Guest draft persistence | **WARNING** | No `documentId` → no server-side editor state |
| Field persistence (`signerId`) | **PASS** | Set at placement; mapped to `editor_recipient_id` on send |
| Recipient mapping | **PASS** | `Review.vue` sends `editor_recipient_id: r.id` |
| PDF generation error UX | **WARNING** | `goToReview()` logs error, resets `isFinishing` — no user-visible message |
| Persist failure silent | **WARNING** | `persistEditorState()` swallows errors (`console.warn` only) |
| Signature for other recipients | **WARNING** | Owner's `capturedSig` embedded at field placement for all signers' fields |

**Files:** `Editor.vue`, `EditorController.php`, `DocumentsController::saveEditorState`

---

## 3. Review Workflow

| Test | Result | Notes |
|------|--------|-------|
| Review page loads | **PASS** | `ReviewController` session gate |
| Page count | **WARNING** | Client-only from `window.__cubsignSession` |
| Field count | **WARNING** | Total fields; per-recipient counts may sum lower (unassigned `signerId`) |
| Recipient count | **WARNING** | Filters `name || email`; empty placeholder recipient excluded |
| Recipient list display | **WARNING** | Shows `(no email)` but send requires both name **and** email |
| Hard refresh on Review | **FAIL** | Session data lost → "Session data not found" banner |
| Status badges | **WARNING** | `statusBadgeClass()` defined but **never used** in template |
| `opened` status | **WARNING** | Supported in UI/schema; never set by backend |
| Self-sign (0 recipients) | **PASS** | Ready banner; Prepare hidden; Finish → Complete works |

**Files:** `Review.vue`, `ReviewController.php`, `Editor.vue` (`goToReview`)

---

## 4. Prepare Requests (Send)

| Test | Result | Notes |
|------|--------|-------|
| Auth + ownership gate | **PASS** | `auth` + `verified` + `gate()` |
| Guest cannot Prepare | **PASS** | Requires `documentId` (auth draft only) |
| Recipient creation | **PASS** | Sorted by `signing_order`; first `sent`, rest `pending` |
| Token generation | **PASS** | `Str::random(40)` per recipient |
| `sent` activity | **PASS** | Created with `recipient_count` |
| `recipient_notified` activity | **WARNING** | Logged **before** mail send; persists if mail fails |
| Email to first recipient | **WARNING** | Sync send; failure logged; HTTP still `200` |
| Duplicate Prepare | **FAIL** | No idempotency; `recipients()->delete()` then recreate; Back to Editor resets `sendState` |
| Send on non-draft document | **FAIL** | No `status === 'draft'` guard (unlike `saveEditorState`, `open`) |
| DB transaction | **WARNING** | Delete/create/activities not atomic |
| Validation error UX | **WARNING** | 422 returns Laravel `errors`; Review reads only `data.message` |
| **Prepare before Finish** | **FAIL** | **Critical workflow bug** — see below |
| Document status on send | **WARNING** | Stays `draft`; no `sent` status on document |

### Critical bug: Prepare before Finish

**Severity:** FAIL — breaks default UI flow

| Step | What happens |
|------|----------------|
| User clicks **Prepare Requests** on Review | `documents.send` creates recipients, emails recipient A |
| `pdf_path` on document | Still `null` — PDF not saved until Complete |
| Recipient A opens `/r/{token}/pdf` | **404** — no `pdf_path` or file |

**Root cause:** Review UI places Prepare before Finish (`Review.vue:242-275`). `pdf_path` is set only when authenticated user reaches Complete and `sign.save` runs (`Complete.vue` → `SaveDocumentController`).

**Files:** `Review.vue`, `DocumentsController::send`, `SaveDocumentController`, `RecipientSignController::pdf`

---

## 5. Recipient Signing

| Test | Result | Notes |
|------|--------|-------|
| Valid token — show | **PASS** | Fields filtered by `editor_recipient_id` |
| Valid token — complete | **PASS** | Marks signed, advances chain |
| Invalid token | **PASS** | 404 via `firstOrFail()` |
| Already signed — show | **PASS** | `alreadySigned` UI |
| Already signed — complete | **PASS** | 422 `{error: 'Already signed'}` |
| Already signed — pdf | **PASS** | PDF still served (only `pending` blocked) |
| Pending — show | **PASS** | `notYetTurn` waiting UI |
| Pending — pdf | **PASS** | 403 (Phase 1 hardening) |
| Pending — complete | **PASS** | 422 `{error: 'Not your turn...'}` |
| Cross-recipient field injection | **PASS** | Phase 1 `allowedFieldIdsForRecipient()` validation |
| Empty signature submission | **WARNING** | No required-field validation client or server |
| Error message mapping | **WARNING** | Vue reads `data.message`; controller returns `error` key for some 422s |
| Mobile PDF preview | **WARNING** | iframe hidden below `lg`; signing panel only |
| Soft-deleted document | **PASS** | 404 on all recipient routes |

**Files:** `RecipientSignController.php`, `RecipientSign.vue`

---

## 6. Sequential Signing (A → B → C)

| Step | Expected | Result | Notes |
|------|----------|--------|-------|
| Prepare/send | A=`sent`, B/C=`pending` | **PASS** | `DocumentsController::send` |
| A receives email | Invitation sent | **WARNING** | Only if mail configured; silent failure possible |
| B blocked (UI) | Waiting view | **PASS** | `notYetTurn` |
| B blocked (PDF) | 403 | **PASS** | Phase 1 |
| C blocked | Same | **PASS** | |
| A signs | A=`signed` | **PASS** | |
| B activated | B=`sent`, email, `recipient_notified` | **PASS** | `RecipientSignController::complete` |
| B signs | B=`signed` | **PASS** | |
| C activated + email | C=`sent` | **PASS** | |
| C signs | Document completed | **PASS** | Only if `SignedPdfService` succeeds |
| Full flow (default UI order) | End-to-end success | **FAIL** | Prepare-before-Finish breaks PDF for A |

**Prerequisite:** `editor_state` must exist on document and `pdf_path` must be set before recipients use links.

### Critical bug: Finish before Prepare (editor_state cleared)

**Severity:** FAIL

| Step | What happens |
|------|----------------|
| User clicks **Finish Signing** without Prepare | Complete auto-saves via `sign.save` |
| Recipients in DB | None yet |
| `hasUnsignedRecipients` | `false` |
| `editor_state` | **Set to `null`** (`SaveDocumentController.php:56`) |
| Later Prepare + recipient signing | PDF may exist but **no fields** for recipients |

**Files:** `SaveDocumentController.php`, `Review.vue`, `Complete.vue`

---

## 7. Signed PDF Generation

| Test | Result | Notes |
|------|--------|-------|
| Signature placement (server) | **PASS** | PNG from canvas `toDataURL()` overlaid via FPDI |
| Date placement | **PASS** | Helvetica text at scaled coordinates |
| Text / name placement | **PASS** | |
| Checkbox placement | **PASS** | Drawn tick lines |
| Multi-page placement | **PASS** | Fields grouped by `pageNum` |
| Coordinate system (owner vs server) | **WARNING** | Owner pdf-lib uses bottom-left Y; server FPDI uses top-left — visual output may differ between owner-signed and recipient-overlaid PDFs |
| FPDI PDF 1.5+ / encrypted PDFs | **WARNING** | Free FPDI parser may fail `setSourceFile()` → `signed_pdf_failed` |
| Generation failure handling | **PASS** | Document not marked `completed`; `signed_pdf_failed` activity (Phase 1) |
| Synchronous in HTTP request | **WARNING** | Last recipient request blocks; gateway timeout risk on large docs |
| Missing `editor_state` | **FAIL** | No overlays possible; ties to Finish-before-Prepare bug |

**Files:** `SignedPdfService.php`, `RecipientSignController.php`

---

## 8. Download Workflow

| Document state | File served | Result | Notes |
|----------------|-------------|--------|-------|
| Draft | N/A | **WARNING** | No download button (expected) |
| Signed (owner self-sign) | `pdf_path` | **PASS** | Owner-signed PDF from Complete save |
| Signed (recipients pending) | `pdf_path` (base) | **WARNING** | Owner can download **unsigned** base PDF while recipients still signing |
| Completed + `signed_pdf_path` | `signed_pdf_path` | **PASS** | `DocumentDownloadController` |
| Completed, PDF gen failed | `pdf_path` (base) | **WARNING** | Status not `completed`; falls back to base |
| Wrong owner | 403 | **PASS** | Ownership check |
| Missing file on disk | 404 | **PASS** | |
| Guest download | **PASS** | Browser blob from `window.__cubsignSession` on Complete page |
| Guest session lost | **WARNING** | "Signed PDF is no longer in memory" on Complete |

**Files:** `DocumentDownloadController.php`, `Complete.vue`, `DocumentShow.vue`

---

## 9. Activity Timeline

| Event | Created when | UI label | Result |
|-------|--------------|----------|--------|
| `sent` | `documents.send` | "Requests prepared — N recipients" | **PASS** |
| `recipient_notified` | Before mail attempt | "{name} notified" | **WARNING** | May show even if mail failed |
| `recipient_signed` | Each `complete` | "{name} signed" | **PASS** |
| `document_completed` | PDF generation success | "Document completed" | **PASS** |
| `signed_pdf_failed` | PDF generation failure | Raw event name | **WARNING** | No friendly label in `DocumentShow.vue` |
| Chronological order | `created_at` ascending implied | **PASS** | Loaded via `$document->activities()` (default id order) |

### Document status inconsistency

| Source | "Completed" meaning |
|--------|---------------------|
| `RecipientSignController` | `status = completed` |
| `DocumentsController::archive` | `status = archived` |
| `OverviewController` stats | Counts `archived` as completed |
| `Documents.vue` filter | Separate `completed` and `archived` options |

Auto-completed multi-recipient documents (`completed`) appear in Documents filter but **not** in Overview completed count (`archived` only).

**Result:** **WARNING**

**Files:** `OverviewController.php`, `Documents.vue`, `DocumentShow.vue`

---

## 10. Security Validation

| Check | Result | Notes |
|-------|--------|-------|
| Owner cannot access another's document | **PASS** | `gate()` → 403 |
| Owner cannot download another's PDF | **PASS** | `DocumentDownloadController` |
| Template ownership | **PASS** | `TemplatesController::gate()` |
| Recipient cannot inject other fields | **PASS** | Phase 1 field ID validation |
| Pending recipient PDF bypass | **PASS** | Phase 1 — 403 on `pdf()` |
| Token tampering (guess) | **PASS** | 40-char random; DB lookup required |
| Token expiration | **WARNING** | Links valid indefinitely |
| Soft-deleted documents | **PASS** | 404 for workspace + recipient routes |
| Rate limiting on `/r/*`, `/sign/*` | **FAIL** | No throttle middleware |
| Public PDF exposure via URL | **PASS** | Private disk; controller-gated |
| `pdf_path` in owner UI | **WARNING** | Information disclosure (internal path) |
| Sign session PDF access | **WARNING** | Any holder of session `sign_token` can fetch `/sign/pdf` |
| Sanctum installed unused | **WARNING** | Dead dependency surface |

**Files:** `RecipientSignController.php`, `DocumentsController.php`, `routes/web.php`, `bootstrap/app.php`

---

## 11. Production Infrastructure Review

| Area | Result | Notes |
|------|--------|-------|
| Redis (sessions/cache) | **WARNING** | `.env.example` requires Redis; config defaults to `database` |
| Queue workers | **PASS** | Not required today — mail/PDF synchronous |
| Persistent storage | **FAIL** | `storage/app/private` gitignored; deploy without volume loses PDFs |
| Mail (Resend) | **FAIL** | `resend/resend-php` not in `composer.json` |
| Mail (SMTP/log fallback) | **PASS** | Works when configured |
| `.env.example` safety | **FAIL** | `APP_DEBUG=true`, WAMP `APP_URL`, `SESSION_DOMAIN=null` |
| `SESSION_SECURE_COOKIE` | **WARNING** | Not in `.env.example` |
| S3 storage | **WARNING** | Configured but incompatible with `Storage::path()` usage |
| Health endpoint | **PASS** | `GET /up` |
| PHPUnit CI gate | **FAIL** | Tests fail on SQLite migration; no signing tests |

**Reference:** `docs/PRODUCTION_READY.md`

### Storage path audit

| Path | Purpose | Public? |
|------|---------|---------|
| `sign/{token}.pdf` | Upload staging | No |
| `templates/` | Template PDFs | No |
| `documents/user_{id}/` | Owner/base PDFs | No |
| `signed/user_{id}/` | Final signed PDFs | No |

All served via authenticated or token-gated controller routes only.

---

## 12. Bugs Found

### Critical (FAIL)

| # | Bug | Impact |
|---|-----|--------|
| B1 | **Prepare before Finish** — default Review button order sends invites before `pdf_path` exists | Recipient A gets 404 on PDF; signing flow broken |
| B2 | **Finish before Prepare** — `editor_state` cleared when no recipients exist at save time | Recipients have no fields after later Prepare |
| B3 | **Duplicate Prepare** — no send idempotency; Back to Editor resets UI state | Duplicate emails; invalidated tokens |
| B4 | **Send on non-draft** — no status guard on `documents.send` | Can wipe recipients on signed/archived documents |

### High (WARNING → treat as bugs for release)

| # | Bug | Impact |
|---|-----|--------|
| B5 | Mail failure returns HTTP 200 | Owner believes invites sent |
| B6 | `recipient_notified` logged before mail succeeds | Misleading activity timeline |
| B7 | Overview "completed" counts `archived` only | Auto-completed docs missing from stats |
| B8 | No continuous autosave | Work lost if user leaves editor before Review |
| B9 | Review session lost on hard refresh | Must return to editor |
| B10 | `storeAs()` failure not handled | Potential corrupt session record |

### Medium

| # | Bug | Impact |
|---|-----|--------|
| B11 | No required signature validation for recipients | Empty signatures accepted |
| B12 | Recipient 422 errors use `error` key; UI reads `message` | Generic error shown |
| B13 | Owner can download unsigned PDF during recipient signing | Premature disclosure of base doc |
| B14 | `signed_pdf_failed` has no friendly activity label | Owner may miss failure |
| B15 | Review shows name-only recipients; send requires email | Opaque validation failure |

---

## 13. Broken Workflows

| Workflow | Status | Workaround |
|----------|--------|------------|
| Self-sign (no recipients) | **Works** | Editor → Review → Finish → Complete |
| Multi-recipient (default UI) | **Broken** | Use Finish → Prepare order manually |
| Multi-recipient (Prepare first) | **Broken** | None — recipient PDF 404 |
| Multi-recipient (Finish first, then Prepare) | **Works** | Correct order; return to Review after Complete |
| Guest sign + download | **Works** | Download from Complete before leaving page |
| Template → sign session | **Works** | `TemplatesController::useTemplate` |
| Re-Prepare after success | **Broken** | Invalidates prior tokens; duplicate activities |
| Workspace Overview stats | **Partial** | `completed` status docs not counted |

---

## 14. Missing Validations

| Location | Missing validation |
|----------|-------------------|
| `DocumentsController::send` | Document must be `draft`; `pdf_path` must exist; idempotency guard |
| `DocumentsController::send` | Recipients not already sent |
| `SaveDocumentController` | Do not clear `editor_state` when `editor_state` has placed fields for future recipients |
| `RecipientSignController::complete` | Required field values (non-empty signatures) |
| `SignSessionService::upload` | Verify `storeAs()` succeeded |
| `DocumentsController::saveEditorState` | Schema validation for `placedFields` / `recipients` |
| `Review.vue` | Disable Prepare until `documentSaved` or `pdf_path` exists |
| Public routes | Rate limiting |

---

## 15. Recommended Fixes (Priority Order)

| Priority | Fix | Effort |
|----------|-----|--------|
| P0 | Block `documents.send` until `pdf_path` exists (or copy staging PDF to `pdf_path` on send) | Small |
| P0 | Disable **Prepare Requests** until Finish/Complete has saved PDF; or reorder buttons | Small |
| P0 | Preserve `editor_state` when `placedFields` exist regardless of recipient count at save | Small |
| P1 | Add `status === 'draft'` guard on `send()` | Trivial |
| P1 | Add send idempotency (reject if recipients already `sent`/`signed`) | Small |
| P1 | Return mail failure status to client; log `recipient_notified` after successful send | Small |
| P2 | Debounced editor autosave | Medium |
| P2 | Align Overview stats with `completed` status | Trivial |
| P2 | Required signature validation on recipient complete | Small |
| P2 | Rate limit `/r/*` and `/sign/*` | Small |
| P3 | Friendly `signed_pdf_failed` activity label | Trivial |
| Infra | Persistent storage, mail package, production `.env` | Ops |

---

## 16. Release Readiness Score

| Category | Weight | Score | Notes |
|----------|--------|-------|-------|
| Upload | 10% | 7/10 | Validation good; disk failure gap |
| Editor | 15% | 6/10 | No autosave; field placement warnings |
| Review/Send | 20% | 3/10 | Critical order bugs |
| Recipient signing | 15% | 12/15 | Phase 1 security solid |
| Sequential signing | 15% | 6/15 | Logic correct; prerequisites broken |
| PDF generation | 10% | 7/10 | Works when data present |
| Download | 5% | 4/5 | Minor premature base PDF issue |
| Security | 5% | 4/5 | Rate limiting gap |
| Infrastructure | 5% | 1/5 | Storage/mail/env blockers |

**Total: 58 / 100**

### Score interpretation

| Score range | Meaning |
|-------------|---------|
| 0–40 | Not deployable |
| 41–60 | **Staging QA only** ← current |
| 61–80 | Staging with external testers after P0 fixes |
| 81–100 | Production candidate |

---

## 17. Final Recommendation

### **READY FOR STAGING**

Deploy to an internal staging environment with:

- [ ] Production `.env` (not verbatim `.env.example`)
- [ ] Persistent volume on `storage/app/private`
- [ ] Redis or database session/cache drivers
- [ ] Working mail (`smtp`, `log`, or Resend + package)
- [ ] QA uses **Finish → Prepare** order for multi-recipient tests
- [ ] P0 workflow bugs tracked before external beta

### **NOT READY** for:

- External / customer-facing beta
- Production launch
- Multi-recipient flows using default Review button order without fixes

---

## Appendix: Manual Test Scripts

### A. Self-sign happy path

1. Upload PDF → Editor → place signature → Review → Finish → Complete  
2. Verify download works (guest blob or auth save)  
3. Verify document in workspace with `status=signed`

### B. Multi-recipient (correct order)

1. Auth + verified user; add 3 recipients with emails in Editor  
2. Place fields per recipient → Review  
3. **Finish Signing** → wait for Complete "Saved"  
4. Navigate back to Review → **Prepare Requests**  
5. Verify A email received; B/C see waiting UI  
6. A signs → B notified → B signs → C notified → C signs  
7. Document `status=completed`; download serves signed PDF  
8. Activity: `sent` → `recipient_notified` → `recipient_signed` ×3 → `document_completed`

### C. Security negatives

1. Pending recipient: `GET /r/{token}/pdf` → 403  
2. POST foreign field IDs → 422  
3. Wrong owner `GET /documents/{id}/download` → 403  
4. Invalid token → 404  
5. Soft-delete document → recipient 404

### D. Known failure reproduction

1. Review → **Prepare** before **Finish** → A opens link → PDF 404 (**B1**)  
2. Review → **Finish** before **Prepare** → **Prepare** → recipients have no fields (**B2**)

---

## Related Documents

- `docs/PRODUCTION_READY.md` — Phase 1 hardening + deployment checklist  
- `docs/CHANGELOG.md` — Feature history  
- `README.md` — Architecture reference (some route docs outdated: `/sign/{token}` vs `/r/{token}`)
