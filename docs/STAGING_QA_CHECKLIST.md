# CubSign Staging QA Checklist

Use this checklist on a **private staging environment** with production-like configuration (Redis, mail, persistent storage, `APP_DEBUG=false`).

**Correct multi-recipient order:** Editor → Review → **Finish Signing** → return to Review → **Prepare Requests**

---

## Environment Pre-flight

- [ ] `APP_ENV=staging` or `production`, `APP_DEBUG=false`
- [ ] Persistent volume mounted at `storage/app/private`
- [ ] Redis or database session/cache configured
- [ ] Mail configured (`smtp`, `log`, or Resend + package)
- [ ] `php artisan migrate --force` completed
- [ ] `npm run build` deployed (no `public/hot`)

---

## 1. Self Sign (No Recipients)

- [ ] Upload PDF as authenticated user
- [ ] Place signature field in editor
- [ ] Autosave shows "Saving…" then "Saved" within ~3 seconds
- [ ] Refresh editor — fields and layout restored
- [ ] Go to Review — counts match editor
- [ ] Refresh Review — data still visible (DB recovery)
- [ ] Finish Signing → Complete page saves document
- [ ] Download signed PDF from Complete page
- [ ] Document appears in workspace with status `signed`

---

## 2. Single Recipient

- [ ] Add one recipient with name + email in editor
- [ ] Assign signature field to recipient
- [ ] Review → Finish Signing first
- [ ] Return to Review → Prepare Requests
- [ ] First recipient receives invitation email
- [ ] `sent` and `recipient_notified` activities logged (notified only after mail success)
- [ ] Recipient opens `/r/{token}` — fields visible, PDF loads
- [ ] Recipient signs — document not yet `completed` (only one signer)
- [ ] Owner downloads appropriate PDF from workspace

---

## 3. Multi Recipient (Sequential)

- [ ] Add recipients A, B, C with signing order
- [ ] Assign fields per recipient
- [ ] Finish → Prepare workflow
- [ ] A receives email; B and C see "waiting" UI
- [ ] B `/r/{token}/pdf` returns 403 while pending
- [ ] A signs → B receives email
- [ ] B signs → C receives email
- [ ] C signs → document `status = completed`
- [ ] `document_completed` activity logged
- [ ] Owner download serves `signed_pdf_path`

---

## 4. Template Flow

- [ ] Create template with PDF upload
- [ ] Use template → opens editor with PDF
- [ ] Place fields and proceed through review/sign flow
- [ ] Template PDF missing flag shows if file deleted from disk

---

## 5. Email Flow

- [ ] Successful prepare sends invitation to first recipient
- [ ] Mail failure shows **warning** on Review (recipients still created)
- [ ] `recipient_notified` activity **not** created when mail fails
- [ ] Sequential next-recipient mail after prior signer completes
- [ ] Verify mail in provider inbox / Mailtrap / log driver

---

## 6. Completed Download

- [ ] Draft document — no download button
- [ ] Signed document (owner self-sign) — download works
- [ ] Completed multi-recipient — download serves final signed PDF
- [ ] Wrong owner — download returns 403

---

## 7. Invalid Token

- [ ] `/r/invalid-token` → 404
- [ ] `/r/{valid-token}` after soft-delete document → 404

---

## 8. Duplicate Send Protection

- [ ] Prepare Requests succeeds once
- [ ] Second Prepare attempt → 409 "Signing requests have already been prepared"
- [ ] Recipient tokens unchanged after duplicate attempt
- [ ] No duplicate `sent` activities

---

## 9. Completed Document Protection

- [ ] Attempt Prepare on `completed` document → 409
- [ ] Prepare without Finish (no `pdf_path`) → 422 finalize message

---

## 10. Security Spot Checks

- [ ] Cross-owner document access → 403
- [ ] Cross-recipient field injection → 422
- [ ] Pending recipient PDF → 403

---

## 11. Dashboard Consistency

- [ ] Overview "Completed" count includes `completed` + `archived` statuses
- [ ] Documents filter "Completed" lists both statuses
- [ ] Status badges show "Completed" for both `completed` and `archived`

---

## Sign-off

| Role | Name | Date | Pass/Fail |
|------|------|------|-----------|
| QA | | | |
| Dev | | | |

**Notes:**

---

## Known Limitations (Post-Hardening)

- Guest Review still relies on browser session for PDF bytes (no DB draft)
- PHPUnit requires MySQL test DB (SQLite migration incompatibility)
- Rate limiting not yet implemented on public routes
- Infrastructure blockers remain for production (see `docs/PRODUCTION_READY.md`)
