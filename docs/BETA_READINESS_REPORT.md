# CubSign External Beta Readiness Report

**Date:** 2026-06-24  
**Audit type:** Read-only post-hardening review  
**Inputs:** `docs/STAGING_QA_CHECKLIST.md`, `docs/STAGING_HARDENING_REPORT.md`, `docs/PRODUCTION_READY.md`, `docs/P0_WORKFLOW_FIX_REPORT.md`, `docs/STAGING_VALIDATION_REPORT.md`, current codebase  
**Application version:** 0.9.0 (pre-1.0)

---

## Executive Summary

CubSign has progressed through Phase 1 security hardening, P0 workflow stabilization, and staging QA hardening. **Core authenticated signing workflows are engineering-complete** for beta, but **formal execution of `STAGING_QA_CHECKLIST.md` has not been recorded** (all items unchecked, sign-off table empty).

This audit treats checklist items as **code-verified** where fixes are implemented and documented, and **execution-pending** where live staging validation is required.

| Score | Value |
|-------|-------|
| **Engineering Readiness** | **87 / 100** |
| **Beta Readiness** | **76 / 100** |
| **Production Readiness** | **60 / 100** |

### Go / No-Go

| Gate | Verdict | Rationale |
|------|---------|-----------|
| **Internal QA** | **GO** | Deploy to private staging; execute full `STAGING_QA_CHECKLIST.md` and sign off |
| **External Beta** | **CONDITIONAL GO** | Proceed only after internal QA sign-off, staging infra provisioned, and beta onboarding doc for Finish→Prepare order |
| **Production** | **NO-GO** | Persistent storage, mail package/config, HTTPS, rate limiting, and automated test gate unresolved |

---

## 1. Completed QA Results

### Formal checklist status

| Item | Status |
|------|--------|
| `STAGING_QA_CHECKLIST.md` executed | **FAIL** — no items checked; sign-off empty |
| Code fixes from P0 + hardening deployed | **PASS** — per git/docs |
| Automated `DocumentsSendTest` | **WARNING** — exists; blocked on SQLite CI (MySQL migration) |
| Prior code-review validation | **PASS** — `STAGING_VALIDATION_REPORT.md` + fix reports |

### Checklist section results (code-verified + doc inference)

| # | Section | Result | Evidence |
|---|---------|--------|----------|
| 0 | Environment pre-flight | **WARNING** | Documented in `PRODUCTION_READY.md`; not verified in repo |
| 1 | Self sign | **PASS** | Upload, editor, autosave, review DB recovery, complete save implemented |
| 2 | Single recipient | **PASS** | P0 guards + `RecipientNotificationService`; requires Finish→Prepare order |
| 3 | Multi-recipient sequential | **PASS** | Phase 1 PDF/field guards; sequential logic in `RecipientSignController` |
| 4 | Template flow | **WARNING** | Code exists; not re-validated post-hardening |
| 5 | Email flow | **PASS** | Activity after send; warning on Prepare failure |
| 6 | Completed download | **PASS** | `DocumentDownloadController` serves `signed_pdf_path` when completed |
| 7 | Invalid token | **PASS** | `firstOrFail()` → 404; soft-delete guarded |
| 8 | Duplicate send | **PASS** | 409 idempotency in `send()` |
| 9 | Completed doc protection | **PASS** | 409 on `completed`/`archived`; 422 without `pdf_path` |
| 10 | Security spot checks | **PASS** | Ownership gate, field injection block, pending PDF 403 |
| 11 | Dashboard consistency | **PASS** | `OverviewController` + `DocumentsController` filter unified |

**Live staging execution of sections 0–11 remains mandatory before external beta.**

---

## 2. Open Defects

| ID | Defect | Severity | Status |
|----|--------|----------|--------|
| D1 | Formal QA checklist not signed off | **HIGH** (process) | Open |
| D2 | No rate limiting on `/sign/*`, `/r/*` | **MEDIUM** | Open |
| D3 | Recipient tokens never expire | **MEDIUM** | Open |
| D4 | Sequential next-recipient mail failure silent to owner/recipient | **LOW** | Open — logged only |
| D5 | Guest Review refresh relies on browser session | **LOW** | Open — no DB draft for guests |
| D6 | `storeAs()` failure not checked in `SignSessionService` | **LOW** | Open |
| D7 | FPDI cannot parse some PDF 1.5+ / encrypted files | **MEDIUM** | Open — `signed_pdf_failed` path exists |
| D8 | Owner can download unsigned base PDF while recipients signing | **LOW** | Open — by design |
| D9 | No required-field validation on recipient signatures | **LOW** | Open |
| D10 | PHPUnit suite fails on default SQLite test DB | **MEDIUM** | Open — `information_schema` migration |
| D11 | `resend/resend-php` not in `composer.json` | **HIGH** (if Resend used) | Open |
| D12 | Orphan `sign/*.pdf` staging files — no cleanup job | **LOW** | Open |
| D13 | Multi-recipient UX: Prepare before Finish blocked but order not enforced in UI | **LOW** | Mitigated by 422 |

---

## 3. Security Risks

| Risk | Result | Notes |
|------|--------|-------|
| Recipient PDF bypass (sequential) | **PASS** | Phase 1 — `pdf()` returns 403 for `pending` |
| Cross-recipient field injection | **PASS** | Phase 1 — `allowedFieldIdsForRecipient()` |
| Document ownership enforcement | **PASS** | `gate()` on workspace routes |
| Soft-deleted document access | **PASS** | 404 on recipient + implicit binding |
| Token guessing | **PASS** | 40-char random tokens |
| Token expiration / revocation | **WARNING** | Links valid indefinitely |
| Public route rate limiting | **FAIL** | No throttle on sign/recipient routes |
| Public PDF exposure (misconfig) | **WARNING** | Safe if docroot = `public/` only |
| Google OAuth email linking | **WARNING** | Links by email if `google_id` missing |
| Session token PDF access (`/sign/pdf`) | **WARNING** | Session-bound, not user-bound |
| `pdf_path` disclosed in owner UI | **WARNING** | Information disclosure only |

**Category verdict: WARNING**

---

## 4. Infrastructure Readiness

| Component | Result | Notes |
|-----------|--------|-------|
| Production `.env` template | **PASS** | `PRODUCTION_READY.md` |
| Redis (sessions/cache) | **WARNING** | Required per `.env.example`; DB fallback available |
| Queue workers | **PASS** | Not required today — sync mail/PDF |
| Persistent storage volume | **FAIL** | Not provisioned in repo; critical for deploys |
| HTTPS / `SESSION_SECURE_COOKIE` | **WARNING** | Documented; not enforced in code |
| PHP upload/memory limits | **WARNING** | Documented; not validated |
| `config:cache` / deploy runbook | **PASS** | Documented |
| Health endpoint `/up` | **PASS** | Registered |
| Resend mail package | **FAIL** | Not installed if using `MAIL_MAILER=resend` |
| S3 storage | **FAIL** | Config only; code uses local paths |

**Category verdict: FAIL** (for production); **WARNING** (for staging with manual setup)

---

## 5. Data Loss Risks

| Risk | Result | Mitigation |
|------|--------|------------|
| PDF loss on redeploy without volume | **FAIL** | Mount `storage/app/private` |
| DB/file path drift | **WARNING** | No reconciliation job |
| Soft-delete leaves files on disk | **WARNING** | Orphan files accumulate |
| Guest signed PDF in browser only | **WARNING** | Download before leaving Complete |
| Editor autosave failure | **WARNING** | "Failed" indicator; user can retry |
| `editor_state` cleared incorrectly | **PASS** | P0 B2 + hardening rules |
| No storage backup documented | **WARNING** | Ops responsibility |

**Category verdict: WARNING** (staging with volume); **FAIL** (production without volume)

---

## 6. PDF Generation Reliability

| Area | Result | Notes |
|------|--------|-------|
| Owner pdf-lib signing (browser) | **PASS** | `Editor.vue` → `Complete.vue` → `sign.save` |
| Server FPDI overlay (multi-recipient) | **WARNING** | FPDI free parser limits; sync in HTTP request |
| Completion gated on PDF success | **PASS** | Phase 1 — `signed_pdf_failed` on failure |
| Coordinate consistency owner vs server | **WARNING** | Different Y-origin pipelines |
| Large/multi-page PDF memory | **WARNING** | No streaming; PHP/browser memory limits |
| Temp PNG cleanup | **WARNING** | `tempnam()` leak possible on exception |
| `pdf_path` required before send | **PASS** | P0 B1 |

**Category verdict: WARNING**

---

## 7. Email Reliability

| Area | Result | Notes |
|------|--------|-------|
| `recipient_notified` after successful send | **PASS** | `RecipientNotificationService` |
| Prepare mail failure surfaced to owner | **PASS** | Warning banner on Review |
| Sequential mail failure surfaced | **WARNING** | Logged only; recipient activated anyway |
| Queued mail with retries | **FAIL** | Synchronous `Mail::send()` |
| Resend package installed | **FAIL** | Not in `composer.json` |
| SMTP fallback | **PASS** | Works when configured |
| SPF/DKIM / domain verification | **WARNING** | Ops responsibility |

**Category verdict: WARNING** (with SMTP on staging); **FAIL** (Resend without package)

---

## 8. Multi-Recipient Workflow Reliability

| Area | Result | Notes |
|------|--------|-------|
| Sequential status transitions | **PASS** | `sent` → `signed`; next `pending` → `sent` |
| Prepare before Finish | **PASS** | Blocked with 422 (P0 B1) |
| Finish before Prepare field loss | **PASS** | `editor_state` preserved (P0 B2) |
| Duplicate Prepare | **PASS** | 409 idempotency (P0 B3) |
| Required user workflow order | **WARNING** | Finish→Prepare documented, not UI-enforced |
| Review refresh recovery | **PASS** | `ReviewDataBuilder` + DB props |
| Single-recipient completion status | **WARNING** | May stay `signed` not `completed` — expected |

**Category verdict: PASS** (with documented workflow order)

---

## 9. Recovery from Failed Operations

| Failure | Result | Recovery path |
|---------|--------|---------------|
| Mail send on Prepare | **PASS** | Recipients created; warning shown; manual notify |
| Mail send on sequential advance | **WARNING** | Next recipient `sent`; no owner alert |
| `SignedPdfService` failure | **PASS** | `signed_pdf_failed` activity; doc not `completed` |
| Autosave failure | **PASS** | "Failed" indicator; user can trigger via edit |
| Review hard refresh (auth) | **PASS** | DB recovery via `ReviewController` |
| Review hard refresh (guest) | **WARNING** | Session lost — return to editor |
| Duplicate Prepare | **PASS** | 409; tokens preserved |
| Partial DB transaction on send | **WARNING** | No `DB::transaction()` wrapper |

**Category verdict: WARNING**

---

## 10. Storage Persistence

| Area | Result | Notes |
|------|--------|-------|
| PDFs on `documents` disk (`storage/app/private`) | **PASS** | Correct private layout |
| Not web-accessible by default | **PASS** | Controller-gated serving |
| Survives code deploy | **FAIL** | Requires external persistent volume |
| `storage:link` for PDFs | **PASS** | Not required |
| S3 readiness | **FAIL** | `Storage::path()` incompatible |
| Backup strategy | **WARNING** | Documented as ops requirement |

**Category verdict: FAIL** (production default); **PASS** (with mounted volume on staging)

---

## Category Summary Table

| # | Category | Verdict |
|---|----------|---------|
| 1 | Completed QA results | **WARNING** — code verified; formal checklist not signed |
| 2 | Open defects | **WARNING** — 13 open; none critical-path for beta if infra met |
| 3 | Security risks | **WARNING** |
| 4 | Infrastructure readiness | **FAIL** (prod) / **WARNING** (staging) |
| 5 | Data loss risks | **WARNING** |
| 6 | PDF generation reliability | **WARNING** |
| 7 | Email reliability | **WARNING** |
| 8 | Multi-recipient workflow | **PASS** |
| 9 | Recovery from failures | **WARNING** |
| 10 | Storage persistence | **FAIL** without volume |

---

## Score Breakdown

### Engineering Readiness: **87 / 100**

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Core signing workflows | 25% | 23/25 | P0 + hardening complete |
| Security controls | 20% | 16/20 | Rate limit + token TTL gaps |
| Error handling / recovery | 15% | 12/15 | Mail/PDF partial visibility |
| Automated tests | 15% | 8/15 | Limited coverage; CI blocked |
| Code quality / consistency | 15% | 14/15 | Services extracted; minor gaps |
| Documentation | 10% | 9/10 | Strong runbooks |

### Beta Readiness: **76 / 100**

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Workflow reliability | 30% | 26/30 | Multi-recipient stable with correct order |
| Formal QA execution | 20% | 8/20 | Checklist not signed off |
| Staging infra readiness | 20% | 12/20 | Requires manual provisioning |
| Email in beta | 15% | 11/15 | SMTP OK; Resend needs package |
| Beta user risk (guest, UX) | 15% | 10/15 | Guest + workflow order friction |

### Production Readiness: **60 / 100**

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Infrastructure | 30% | 12/30 | Volume, HTTPS, Redis, mail |
| Security hardening | 20% | 12/20 | Rate limits, token policy |
| Operational readiness | 20% | 10/20 | Queues, cleanup, monitoring |
| Data durability | 15% | 6/15 | Backup, S3, orphan files |
| Compliance / scale | 15% | 8/15 | Activity growth, virus scan |

---

## Remaining Blockers

### Must resolve before external beta

1. **Execute and sign off** `docs/STAGING_QA_CHECKLIST.md` on a staging environment.
2. **Provision staging infra:** persistent `storage/app/private`, MySQL, Redis or DB drivers, working SMTP (or Resend + package).
3. **Production-like `.env`:** `APP_DEBUG=false`, correct `APP_URL`, `LOG_LEVEL=info`.
4. **Beta onboarding note:** multi-recipient flow requires **Finish Signing → Prepare Requests**.

### Must resolve before production

5. Persistent storage volume with backup policy.
6. Install `resend/resend-php` or production SMTP with verified domain.
7. HTTPS + `SESSION_SECURE_COOKIE=true` + trusted proxies.
8. Rate limiting on public signing routes.
9. Fix SQLite migration portability for CI gate (or run tests on MySQL).
10. Consider queued mail/PDF for timeout resilience.
11. Token expiration policy for recipient links.
12. Monitoring/alerting on `cubsign` log channel and `signed_pdf_failed` events.

---

## Recommended Beta Launch Sequence

```
1. Deploy to private staging (PRODUCTION_READY.md checklist)
2. Run STAGING_QA_CHECKLIST.md — all sections, record sign-off
3. Fix any FAIL items found during live QA
4. Invite limited external beta (authenticated users, SMTP verified)
5. Monitor: cubsign.log, mail failures, signed_pdf_failed activities
6. Collect feedback on Finish→Prepare workflow confusion
7. Re-assess production score after 2–4 weeks beta
```

---

## Document History

| Document | Role |
|----------|------|
| `STAGING_VALIDATION_REPORT.md` | Initial audit (58/100) |
| `PRODUCTION_READY.md` | Phase 1 security + deploy template |
| `P0_WORKFLOW_FIX_REPORT.md` | B1–B4 workflow fixes |
| `STAGING_HARDENING_REPORT.md` | Mail, autosave, review recovery (86/100 workflow) |
| `STAGING_QA_CHECKLIST.md` | Manual QA script (execution pending) |
| **`BETA_READINESS_REPORT.md`** | **This report** |

---

## Final Recommendation

CubSign is **engineering-ready for internal QA** and **conditionally ready for external beta** once the staging checklist is executed on real infrastructure with mail and persistent storage.

It is **not ready for production** until infrastructure blockers, rate limiting, and operational hardening are addressed.

| Gate | Verdict |
|------|---------|
| Internal QA | **GO** |
| External Beta | **CONDITIONAL GO** |
| Production | **NO-GO** |
