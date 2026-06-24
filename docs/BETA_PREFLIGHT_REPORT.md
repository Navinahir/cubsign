# CubSign Beta Deployment Pre-Flight Report

**Date:** 2026-06-24  
**Audit type:** Read-only repository review (no code changes)  
**Target release:** `v0.9.5-beta`  
**Inputs reviewed:**
- `docs/BETA_DEPLOYMENT_PLAN_v0.9.5.md`
- `docs/PRODUCTION_READY.md`
- `docs/STAGING_HARDENING_REPORT.md`
- `docs/BETA_READINESS_REPORT.md`
- `composer.json`, `composer.lock`, `.env.example`, migrations, `config/*`, `package.json`, `bootstrap/app.php`

**Repository HEAD:** `3a62524` — *feat: enhance document workflow with notification service, review data handling, and autosave functionality*  
**Git tag `v0.9.5-beta`:** **Not present** in repository at audit time.

---

## Executive Summary

Deployment documentation is **substantially complete** and aligned with the Laravel 12 codebase. Core Artisan commands, cache steps, and MySQL migration ordering are **correct** for a fresh beta server. **No code defects block server provisioning**, but **several operational prerequisites are unresolved** in the repository and process layer.

| Metric | Value |
|--------|-------|
| **Final Beta Deployment Score** | **74 / 100** |
| **Deploy to private staging (Phase 1–2)** | **CONDITIONAL GO** |
| **External beta launch (Phase 4)** | **NO-GO** (until Phase 3 sign-off) |
| **Production** | **NO-GO** (unchanged from prior audits) |

---

## Area-by-Area Verdicts

### 1. Deployment Commands

| Check | Verdict | Notes |
|-------|---------|-------|
| `composer install --no-dev --optimize-autoloader` | **PASS** | Standard Laravel production install; matches `composer.json` PHP `^8.2` |
| `npm ci` + `npm run build` | **WARNING** | `package-lock.json` present. **Do not** run `npm ci --omit=dev` or set `NODE_ENV=production` before build — Vite/Vue/Tailwind are in `devDependencies` |
| `php artisan migrate --force` | **PASS** | Correct for non-interactive deploy |
| `php artisan config:cache` | **PASS** | Required before serving cached config |
| `php artisan route:cache` | **PASS** | Safe — no closure routes detected as blockers |
| `php artisan view:cache` | **PASS** | Standard |
| `php artisan event:cache` | **PASS** | Present in beta plan; **missing** from rollback section in same doc |
| `php artisan storage:link` | **PASS** | Optional — PDFs use `documents` disk, not `public/storage` (`PRODUCTION_READY.md` correct) |
| `php artisan key:generate` | **PASS** | Required once on first deploy |
| Service restarts (`php8.3-fpm`, `nginx`) | **PASS** | Correct socket path for Ubuntu 24.04 / PHP 8.3 |
| `git checkout v0.9.5-beta` | **FAIL** | Tag **does not exist** in repo; deploy will fail unless tag is created first or commit SHA is used |
| `curl … /up` smoke test | **PASS** | Health route registered at `/up` in `bootstrap/app.php` |
| `test ! -f public/hot` | **PASS** | Valid Vite production check |
| Permissions (`chown`/`chmod` on `storage`, `bootstrap/cache`) | **PASS** | Required and documented |
| Initial deploy command order | **WARNING** | `composer install` runs before `.env` exists — acceptable for Composer, but ensure `.env` exists **before** `migrate` and **before** any `*:cache` |
| Doc inconsistency PHP version | **WARNING** | `BETA_DEPLOYMENT_PLAN` → PHP 8.3; `PRODUCTION_READY.md` nginx example → `php8.2-fpm.sock` |

**Area verdict: WARNING**

---

### 2. Environment Variables

Compared beta plan template, `PRODUCTION_READY.md`, `.env.example`, and `config/*` usage.

| Variable / group | Verdict | Notes |
|------------------|---------|-------|
| `APP_NAME`, `APP_ENV`, `APP_DEBUG`, `APP_URL` | **PASS** | Beta template correct (`production`, `false`, HTTPS URL) |
| `APP_KEY` | **PASS** | Must be generated; never commit |
| `LOG_CHANNEL`, `LOG_STACK`, `LOG_LEVEL` | **PASS** | `stack` + `daily` + `info` appropriate for beta |
| `DB_*` (MySQL) | **PASS** | All required vars documented |
| `SESSION_DRIVER`, `SESSION_SECURE_COOKIE` | **PASS** | Redis + secure cookie behind HTTPS |
| `CACHE_STORE`, `QUEUE_CONNECTION` | **PASS** | Redis documented; queue unused at runtime |
| `FILESYSTEM_DISK` | **PASS** | `local` correct; do not set `DOCUMENTS_DISK_DRIVER=s3` |
| `REDIS_*` | **PASS** | `REDIS_CLIENT=phpredis` matches extension install list |
| `MAIL_*` + `RESEND_API_KEY` | **WARNING** | Beta plan documents SMTP and Resend; `.env.example` defaults to `MAIL_MAILER=resend` without package |
| `GOOGLE_*` | **PASS** | Required only if Google OAuth enabled; redirect must match `APP_URL` |
| `VITE_APP_NAME` | **PASS** | Used by frontend build |
| `SESSION_DOMAIN` | **WARNING** | `.env.example` sets `SESSION_DOMAIN=null` (literal string risk). Beta template correctly says *omit* — **do not copy `.env.example` verbatim** |
| `APP_LOCALE`, `APP_MAINTENANCE_DRIVER` | **PASS** | Have safe defaults; optional in beta template |
| `STRIPE_*` | **PASS** | In `.env.example` but **unused** in application code — omit on beta |
| `DOCUMENTS_DISK_DRIVER`, `AWS_*` | **PASS** | Omit for beta (local storage only) |
| `TRUSTED_PROXIES` / `APP_URL` behind CDN | **WARNING** | Not documented; needed if TLS terminates at load balancer before Nginx |
| `MAIL_ENCRYPTION` | **PASS** | Present in beta SMTP option; required for typical SMTP |

**Missing from beta `.env` template (non-blocking):**

- `SESSION_ENCRYPT` — defaults `false` in config ✓  
- `BROADCAST_CONNECTION` — defaults `log` ✓  

**Area verdict: WARNING**

---

### 3. Storage Directories

| Check | Verdict | Notes |
|-------|---------|-------|
| Persistent volume at `storage/app/private` | **FAIL** | **Infrastructure** — not in repo; **critical** for PDF survival across deploys |
| `documents` disk root | **PASS** | `config/filesystems.php` → `storage_path('app/private')` |
| Runtime subdirs (`sign/`, `templates/`, `documents/`, `signed/`) | **PASS** | Created on first write (`store()`, `makeDirectory('sign')`) — no manual mkdir required beyond volume root |
| `storage/logs/` (incl. `cubsign.log`) | **PASS** | `config/logging.php` channel `cubsign`; must be writable by `www-data` |
| `storage/framework/{cache,sessions,views}/` | **PASS** | Standard Laravel; gitignored placeholders exist |
| `storage/app/public/` + `public/storage` symlink | **PASS** | Not used for PDFs; `storage:link` optional |
| Symlink pattern for external volume | **WARNING** | `ln -sfn /var/lib/cubsign/storage-private …/storage/app/private` — ensure target is not a non-empty directory that hides the mount |
| Nginx block for `/storage/app/private` | **WARNING** | Documented in `PRODUCTION_READY.md` but **absent** from `BETA_DEPLOYMENT_PLAN` nginx snippet (defense in depth if docroot misconfigured) |
| S3 / cloud storage | **FAIL** | Code uses `Storage::path()` — **not beta-compatible** |

**Area verdict: WARNING** (PASS with mounted volume; **FAIL** without)

---

### 4. Laravel Cache Commands

| Command | Verdict | Notes |
|---------|---------|-------|
| `config:cache` | **PASS** | Documented in beta plan + `PRODUCTION_READY.md` |
| `route:cache` | **PASS** | Documented |
| `view:cache` | **PASS** | Documented |
| `event:cache` | **PASS** | Documented in beta plan (Laravel 12 supported) |
| `optimize` (bundled) | **PASS** | Not documented; equivalent to four cache commands — optional shorthand |
| `config:clear` before first cache | **WARNING** | Not mentioned; recommended if redeploying over a dev-cached tree |
| Rollback includes all cache commands | **WARNING** | Beta rollback omits `event:cache` and `view:cache` |

**Area verdict: PASS**

---

### 5. Supervisor Requirements

| Check | Verdict | Notes |
|-------|---------|-------|
| Queue workers required for beta | **PASS** | **No** — grep confirms no `ShouldQueue`, `dispatch()`, or `Queue::` usage in `app/` |
| Mail | **PASS** | Synchronous `Mail::send()` via `RecipientNotificationService` |
| PDF generation | **PASS** | Synchronous in HTTP request (`SignedPdfService`) |
| Supervisor install on server | **PASS** | Optional for v0.9.5-beta; correctly marked optional in deployment plan |
| Future worker config | **PASS** | Example `queue:work redis` config is valid for v1.0 |
| Cron / scheduler | **PASS** | No scheduled tasks in `routes/console.php` |

**Area verdict: PASS**

---

### 6. Redis Requirements

| Check | Verdict | Notes |
|-------|---------|-------|
| `SESSION_DRIVER=redis` | **WARNING** | **Requires** running Redis + `php8.3-redis` extension |
| `CACHE_STORE=redis` | **WARNING** | Same |
| `QUEUE_CONNECTION=redis` | **PASS** | Set but unused — no worker needed |
| Database fallback | **PASS** | `sessions`, `cache`, `jobs` tables exist via Laravel default migrations |
| `redis-cli ping` verification | **PASS** | Documented |
| Beta plan without Redis | **WARNING** | If Redis unavailable, must change **both** `SESSION_DRIVER` and `CACHE_STORE` to `database` — not spelled out as fallback in beta plan |

**Area verdict: WARNING** (PASS when Redis provisioned; plan assumes Redis)

---

### 7. Mail Requirements

| Check | Verdict | Notes |
|-------|---------|-------|
| SMTP path | **PASS** | `MAIL_MAILER=smtp` + credentials — no extra Composer packages |
| Resend path | **FAIL** | `config/mail.php` has `resend` transport; **`resend/resend-php` NOT in `composer.json`** — only suggested in `composer.lock` |
| `.env.example` default | **WARNING** | `MAIL_MAILER=resend` with empty `RESEND_API_KEY` — fresh copy breaks Resend until package + key added |
| Default mailer fallback | **PASS** | `env('MAIL_MAILER', 'log')` in config — safe if unset |
| `RecipientInvitationMail` | **PASS** | Sent synchronously; failure surfaces warning on Prepare (`STAGING_HARDENING_REPORT.md`) |
| Sequential recipient mail failure | **WARNING** | Logged only; not surfaced to owner UI |
| SPF/DKIM / domain verification | **WARNING** | Operational — not repo-verifiable |
| Mail smoke test (`tinker`) | **PASS** | Documented in both runbooks |

**Area verdict: WARNING** (FAIL if deploying with Resend without `composer require resend/resend-php`)

---

### 8. Migration Ordering

**13 migrations** — chronological order on fresh **MySQL 8** database:

| Order | Migration | Verdict |
|-------|-----------|---------|
| 1 | `0001_01_01_000000_create_users_table` | **PASS** |
| 2 | `0001_01_01_000001_create_cache_table` | **PASS** |
| 3 | `0001_01_01_000002_create_jobs_table` | **PASS** |
| 4 | `2026_06_20_000001_create_sign_sessions_table` | **PASS** |
| 5 | `2026_06_22_000001_create_documents_table` | **PASS** |
| 6 | `2026_06_22_000002_add_google_id_to_users_table` | **PASS** |
| 7 | `2026_06_22_000003_add_soft_deletes_to_documents_table` | **PASS** |
| 8 | `2026_06_22_000004_add_sign_token_to_documents_table` | **PASS** | Idempotent via `information_schema` — **MySQL-only** |
| 9 | `2026_06_23_000001_add_draft_fields_to_documents_table` | **PASS** | Depends on `sign_token` from #8 |
| 10 | `2026_06_23_000002_create_templates_table` | **PASS** |
| 11 | `2026_06_23_000003_create_recipients_table` | **PASS** |
| 12 | `2026_06_23_000004_create_document_activities_table` | **PASS** |
| 13 | `2026_06_24_000001_add_signed_pdf_path_to_documents_table` | **PASS** |

| Check | Verdict | Notes |
|-------|---------|-------|
| Fresh MySQL `migrate --force` | **PASS** | Ordering and FK dependencies valid |
| SQLite / PHPUnit | **WARNING** | `2026_06_22_000004` uses `information_schema` — **fails on SQLite** (CI only; not beta blocker) |
| Partial re-run safety | **PASS** | `sign_token` migration is idempotent |
| Seeders required | **PASS** | None required for beta |

**Area verdict: PASS** (for beta MySQL target)

---

### 9. Composer Dependency Issues

| Package | Verdict | Notes |
|---------|---------|-------|
| `laravel/framework` ^12.0 | **PASS** | Matches bootstrap structure |
| `inertiajs/inertia-laravel` ^2.0 | **PASS** | |
| `laravel/socialite` ^5.28 | **PASS** | Google OAuth |
| `setasign/fpdf` + `setasign/fpdi` | **PASS** | Server-side PDF overlay |
| `resend/resend-php` | **FAIL** | **Not installed** — required only if `MAIL_MAILER=resend` |
| PHP extensions (runtime) | **WARNING** | Plan lists `gd`, `mbstring`, `xml`, `curl`, `zip`, `bcmath`, `intl`, `redis`, `mysql` — also need **`fileinfo`** (uploads) and **`openssl`** (TLS/encryption); typically included in PHP 8.3 packages |
| `--no-dev` on server | **PASS** | Dev tools (PHPUnit, Pint) correctly excluded |
| Platform PHP 8.3 vs `^8.2` | **PASS** | Compatible |

**Area verdict: WARNING**

---

### 10. Known Blockers Preventing Beta Deployment

| Blocker | Severity | Type | Verdict |
|---------|----------|------|---------|
| Git tag `v0.9.5-beta` missing | **HIGH** | Process | **FAIL** |
| Formal `STAGING_QA_CHECKLIST.md` not executed/signed | **HIGH** | Process | **FAIL** (for Phase 4 external beta) |
| Persistent storage volume not provisioned | **CRITICAL** | Infra | **FAIL** |
| Production `.env` not applied on server | **CRITICAL** | Infra | **FAIL** |
| Redis not running (if using plan defaults) | **HIGH** | Infra | **FAIL** |
| Resend without package (if following `.env.example`) | **HIGH** | Config | **FAIL** |
| HTTPS + `SESSION_SECURE_COOKIE=true` | **HIGH** | Infra | **WARNING** — documented, not verified |
| Rate limiting on `/sign/*`, `/r/*` | **MEDIUM** | Security | **WARNING** — accepted beta limitation |
| Recipient token expiration | **MEDIUM** | Security | **WARNING** — accepted beta limitation |
| FPDI PDF 1.5+ parse failures | **MEDIUM** | Product | **WARNING** — `signed_pdf_failed` path exists |
| PHPUnit on SQLite | **MEDIUM** | CI | **WARNING** — not deploy blocker |
| No automated deploy gate | **MEDIUM** | Process | **WARNING** |

**Area verdict: FAIL** (infra + process); **no application code blocker** prevents starting Phase 1–2.

---

## Cross-Document Consistency

| Topic | BETA_DEPLOYMENT_PLAN | PRODUCTION_READY | Codebase | Verdict |
|-------|---------------------|------------------|----------|---------|
| PHP version | 8.3 | 8.2+ | `^8.2` | **PASS** |
| Redis sessions/cache | Required | Recommended | Config defaults to redis in `.env.example` | **PASS** |
| Supervisor | Optional | Phase 2 queues | No queues used | **PASS** |
| Mail default | SMTP option A | Resend option A | `.env.example` = resend | **WARNING** |
| Workflow score | — | — | 86/100 post-hardening | **PASS** |
| Multi-recipient order | Documented | — | 422 guard on Prepare-before-Finish | **PASS** |

---

## Score Breakdown

### Final Beta Deployment Score: **74 / 100**

| Factor | Weight | Score | Rationale |
|--------|--------|-------|-----------|
| Deployment runbook accuracy | 20% | 15/20 | Commands correct; tag missing; minor rollback/nginx gaps |
| Environment completeness | 15% | 11/15 | Strong template; Resend/SESSION_DOMAIN traps |
| Storage & durability | 15% | 9/15 | Correct layout; volume is external ops dependency |
| Cache & optimize steps | 10% | 10/10 | Complete |
| Redis / Supervisor | 10% | 8/10 | Correctly scoped; Redis mandatory per plan |
| Mail readiness | 10% | 6/10 | SMTP OK; Resend package gap |
| Migrations | 10% | 10/10 | MySQL ordering valid |
| Composer / runtime deps | 10% | 8/10 | Core deps fine; Resend optional gap |
| Process & blockers | 10% | 3/10 | No tag, no QA sign-off, infra pending |

---

## Go / No-Go

| Gate | Verdict | Condition |
|------|---------|-----------|
| **Begin server provisioning (Phase 1)** | **GO** | Team accepts documented infra requirements |
| **Execute Phase 2 deploy** | **CONDITIONAL GO** | After: tag or pin commit, `.env`, Redis, MySQL, storage volume, mail choice |
| **Phase 3 staging validation** | **GO** | Deploy must succeed first |
| **Phase 4 external beta invites** | **NO-GO** | Until Phase 3 checklist signed by QA + Developer |
| **Production (`v1.0.0`)** | **NO-GO** | Rate limits, token TTL, ops hardening per `BETA_DEPLOYMENT_PLAN` Phase 6 |

---

## Required Fixes Before Deployment

### Must fix (deployment will fail or misbehave without these)

1. **Create and push git tag** `v0.9.5-beta` on the intended commit — *or* replace `git checkout v0.9.5-beta` with explicit branch/SHA in runbook.
2. **Provision persistent volume** mounted at `storage/app/private` (bind mount or symlink per beta plan).
3. **Create server `.env`** from beta template — **not** verbatim `.env.example`:
   - `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://beta.cubsign.com`
   - `SESSION_SECURE_COOKIE=true`
   - **Omit** `SESSION_DOMAIN` (do not use literal `null`)
4. **Provision Redis** and install `php8.3-redis` — *or* explicitly switch `SESSION_DRIVER` and `CACHE_STORE` to `database`.
5. **Choose mail strategy:**
   - **SMTP:** set `MAIL_MAILER=smtp` + provider credentials, **or**
   - **Resend:** `composer require resend/resend-php` **before** `composer install --no-dev`, then set `RESEND_API_KEY`.
6. **Enable HTTPS** (Let's Encrypt) before setting `SESSION_SECURE_COOKIE=true`.
7. **Run `npm ci` without omitting devDependencies** before `npm run build`.

### Must fix before external beta (Phase 4)

8. **Execute and sign off** every section of `docs/STAGING_QA_CHECKLIST.md` on the live beta host.
9. **Send beta onboarding** noting Finish Signing → Prepare Requests order.

### Recommended (non-blocking)

10. Add `location ~ /storage/app/private { deny all; }` to Nginx config.
11. Document `fileinfo` and `openssl` in PHP extension checklist.
12. Add `php artisan event:cache` to rollback procedure.
13. Smoke-test mail via `php artisan tinker` before inviting users.
14. Schedule backup for MySQL + `/var/lib/cubsign/storage-private`.

---

## Recommended Deployment Order

```
┌─────────────────────────────────────────────────────────────────┐
│  PRE-DEPLOY (repository / ops)                                  │
├─────────────────────────────────────────────────────────────────┤
│  1. Tag release: git tag -a v0.9.5-beta && git push origin tag  │
│  2. Decide mail: SMTP (simpler) OR Resend (+ composer package)  │
│  3. Register DNS: beta.cubsign.com → server IP                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1 — Infrastructure (BETA_DEPLOYMENT_PLAN § Phase 1)      │
├─────────────────────────────────────────────────────────────────┤
│  4. Ubuntu 24.04 + PHP 8.3-FPM + extensions (incl. redis)       │
│  5. Nginx → docroot public/ + SSL (Certbot)                     │
│  6. MySQL 8: create DB + user                                   │
│  7. Redis: install, enable, verify PONG                        │
│  8. Persistent volume → storage/app/private                     │
│  9. Write .env (beta template), php artisan key:generate        │
│ 10. Mail smoke test (tinker)                                    │
│ 11. Google OAuth redirect URI (if used)                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2 — Application deploy                                   │
├─────────────────────────────────────────────────────────────────┤
│ 12. git clone → checkout v0.9.5-beta                            │
│ 13. composer install --no-dev --optimize-autoloader             │
│ 14. npm ci && npm run build   (keep devDeps for build)          │
│ 15. php artisan migrate --force                                 │
│ 16. chown/chmod storage + bootstrap/cache                       │
│ 17. php artisan config:cache                                    │
│ 18. php artisan route:cache                                     │
│ 19. php artisan view:cache                                      │
│ 20. php artisan event:cache                                     │
│ 21. Verify: curl /up → 200; no public/hot                       │
│ 22. systemctl restart php8.3-fpm; reload nginx                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3 — Staging validation (BLOCKING for external beta)     │
├─────────────────────────────────────────────────────────────────┤
│ 23. Run STAGING_QA_CHECKLIST.md sections 0–11 on live host      │
│ 24. QA + Developer sign-off in checklist + deployment plan      │
│ 25. Fix any FAIL items; redeploy; re-test affected sections     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4 — Beta launch (only after Phase 3 pass)                │
├─────────────────────────────────────────────────────────────────┤
│ 26. Invite internal team → friends → 2–5 clients                │
│ 27. Monitor laravel.log + cubsign.log daily (first week)        │
│ 28. Phase 5 bug-fix window (1–2 weeks, no features)             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary Table (All Areas)

| # | Deployment area | Verdict |
|---|-----------------|---------|
| 1 | Deployment commands | **WARNING** |
| 2 | Environment variables | **WARNING** |
| 3 | Storage directories | **WARNING** |
| 4 | Laravel cache commands | **PASS** |
| 5 | Supervisor requirements | **PASS** |
| 6 | Redis requirements | **WARNING** |
| 7 | Mail requirements | **WARNING** |
| 8 | Migration ordering | **PASS** |
| 9 | Composer dependencies | **WARNING** |
| 10 | Known blockers | **FAIL** |

---

## Final Recommendation

The repository and deployment runbooks are **ready to support a private beta deploy** once operational prerequisites are met. **Application engineering is not the gating factor** — infrastructure provisioning, mail configuration, release tagging, and live QA sign-off are.

| Question | Answer |
|----------|--------|
| Can we start Phase 1 infrastructure today? | **Yes** |
| Can we run Phase 2 deploy today without prep? | **No** — tag, `.env`, Redis, volume, mail required |
| Can we invite external beta users today? | **No** — Phase 3 checklist unsigned |
| Is code change required before deploy? | **No** (audit-only; ops/config only) |

**Overall: CONDITIONAL GO for private staging deploy after required fixes above.**

---

## Document References

| Document | Role in this audit |
|----------|-------------------|
| `BETA_DEPLOYMENT_PLAN_v0.9.5.md` | Primary deploy runbook — verified against codebase |
| `PRODUCTION_READY.md` | Env template, storage layout, mail/Redis notes |
| `STAGING_HARDENING_REPORT.md` | Workflow fixes (86/100); remaining infra blockers |
| `BETA_READINESS_REPORT.md` | Prior scores (Beta 76/100); defect register D1–D13 |
| `STAGING_QA_CHECKLIST.md` | Phase 3 gate — execution pending |
