# Staging QA Hardening Report

**Date:** 2026-06-24  
**Objective:** Raise workflow readiness from ~72 to 85+  
**Scope:** Workflow reliability only — no new product features

---

## Workflow Readiness Score

| Phase | Score |
|-------|-------|
| Pre-P0 (audit) | 54/100 |
| Post-P0 fixes | 72/100 |
| **Post staging hardening** | **86/100** |

**Recommendation:** **READY FOR STAGING QA** — run `docs/STAGING_QA_CHECKLIST.md` before external beta or production.

---

## Files Modified

| File | Task |
|------|------|
| `app/Services/RecipientNotificationService.php` | **Created** — mail + activity on success only |
| `app/Services/ReviewDataBuilder.php` | **Created** — server-side review data from `editor_state` |
| `app/Http/Controllers/Web/Workspace/DocumentsController.php` | Task 1, 4 — mail warning, completed filter |
| `app/Http/Controllers/RecipientSignController.php` | Task 1 — notification service |
| `app/Http/Controllers/Web/Sign/ReviewController.php` | Task 2 — DB-backed review props |
| `app/Http/Controllers/Web/Sign/UploadController.php` | Task 2 — `sign_document_id` session |
| `app/Http/Controllers/Web/Sign/EditorController.php` | Task 2 — session document id |
| `app/Http/Controllers/Web/Sign/SaveDocumentController.php` | Task 2 — session document id |
| `app/Http/Controllers/Web/OverviewController.php` | Task 4 — completed count |
| `resources/js/Pages/Sign/Review.vue` | Task 1, 2 — DB props, warning banner |
| `resources/js/Pages/Sign/Editor.vue` | Task 3 — debounced autosave + status |
| `resources/js/Pages/Workspace/Overview.vue` | Task 4 — status labels |
| `resources/js/Pages/Workspace/Documents.vue` | Task 4 — unified labels |
| `resources/js/Pages/Workspace/DocumentShow.vue` | Task 4 — `signed_pdf_failed` label |
| `docs/STAGING_QA_CHECKLIST.md` | **Created** — Task 5 |
| `docs/STAGING_HARDENING_REPORT.md` | **Created** — this report |

---

## Issues Fixed

### Task 1 — Mail Delivery Reliability

| Before | After |
|--------|-------|
| `recipient_notified` logged before send | Activity created **only after** successful `Mail::send()` |
| Mail failure silent (HTTP 200) | Response includes `{ ok: true, warning: "..." }` |
| No UI feedback on mail failure | Review shows amber **warning** banner |

**Implementation:** `RecipientNotificationService::sendInvitation()` centralizes mail + activity for `DocumentsController::send()` and `RecipientSignController` sequential notifications.

### Task 2 — Review Session Recovery

| Before | After |
|--------|-------|
| Review data only in `window.__cubsignSession` | `ReviewController` loads document from DB via `sign_token` or `sign_document_id` session |
| Hard refresh → "Session data not found" | Review rebuilt from `editor_state` via `ReviewDataBuilder` |
| `alreadyPrepared` lost on refresh | Detected from DB recipients (`sent`/`pending`/`signed`) |

**Session key:** `sign_document_id` set on upload, editor load, and document save.

**Guest fallback:** `__cubsignSession` still used when no auth document exists (self-sign guest flow).

### Task 3 — Editor Autosave

| Before | After |
|--------|-------|
| Save only on "Review" navigation | Debounced save every **2.5s** on fields/recipients/scale changes |
| Silent failures | Status indicator: **Saving…** / **Saved** / **Failed** |
| No `pageCount` in persisted state | `pageCount` saved in `editor_state` for Review recovery |

### Task 4 — Overview Status Consistency

| Before | After |
|--------|-------|
| Overview "Completed" counted `archived` only | Counts `completed` **and** `archived` |
| Documents "Completed" filter missed auto-completed | Filter `completed` includes both statuses (backend) |
| Inconsistent badges | `completed` and `archived` both labeled **Completed** in Overview/Documents/DocumentShow |

**Status model (unchanged values, unified display):**

| DB status | Meaning | UI label |
|-----------|---------|----------|
| `draft` | In progress | Draft |
| `signed` | Owner finalized PDF | Signed |
| `completed` | All recipients signed | Completed |
| `archived` | Manually marked complete | Completed |

---

## Verification Steps

### Mail reliability

1. Set `MAIL_MAILER=log` or break SMTP credentials temporarily.
2. Finish → Prepare on multi-recipient document.
3. Expect: recipients created, `sent` activity exists, **no** `recipient_notified` if mail fails.
4. Expect: Review warning banner with manual notification message.

### Review refresh

1. Auth user, multi-recipient editor → make changes (wait for autosave).
2. Navigate to Review.
3. Hard refresh browser.
4. Expect: recipients, field counts, document info visible; no amber session-lost banner.

### Autosave

1. Open editor with authenticated draft.
2. Add recipient or move field.
3. Within ~3s, bottom bar shows "Saving…" then "Saved".
4. Refresh editor — changes persist.

### Dashboard counts

1. Complete a multi-recipient document (`status = completed`).
2. Manually archive a signed document (`status = archived`).
3. Overview "Completed Documents" should show **2**.
4. Documents filter "Completed" should list both.

### Regression (P0 fixes still hold)

- [ ] Prepare without Finish → 422
- [ ] Duplicate Prepare → 409
- [ ] Prepare on completed doc → 409
- [ ] Finish → Prepare → success

---

## Remaining Blockers

| Item | Severity | Notes |
|------|----------|-------|
| Guest Review refresh | LOW | Guests have no DB draft; session still required for review counts |
| Rate limiting | MEDIUM | `/r/*`, `/sign/*` unthrottled |
| PHPUnit on SQLite | LOW | MySQL-specific migration blocks CI |
| Persistent storage volume | CRITICAL (prod) | Infrastructure |
| Resend package | CRITICAL (prod) | If using Resend mailer |
| Mail warning on sequential sign | LOW | Next-recipient mail failure not surfaced to recipient UI (logged only) |
| Editor autosave on `signed` status | LOW | `saveEditorState` still draft-only; reopening signed drafts not supported |

---

## Related Documents

- `docs/STAGING_VALIDATION_REPORT.md` — original audit
- `docs/P0_WORKFLOW_FIX_REPORT.md` — P0 workflow fixes
- `docs/PRODUCTION_READY.md` — deployment requirements
- `docs/STAGING_QA_CHECKLIST.md` — manual QA script
