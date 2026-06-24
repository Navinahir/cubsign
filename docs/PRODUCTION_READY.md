# CubSign Production Readiness — Phase 1 Hardening

**Date:** 2026-06-24  
**Scope:** Critical security and integrity fixes only. No new features, UI changes, or package upgrades.

---

## Go / No-Go Recommendation

| Environment | Verdict | Score |
|-------------|---------|-------|
| **Staging** | **GO** — deploy after completing staging checklist below | **72 / 100** |
| **Production** | **NO-GO** — infrastructure and mail setup required first | **62 / 100** |

Staging is acceptable for end-to-end testing with real Redis, persistent storage, and configured mail. Production requires the remaining blockers in [Production Blockers Remaining](#production-blockers-remaining) to be resolved.

---

## Fixed Issues (Phase 1)

### 1. Recipient PDF security

**File:** `app/Http/Controllers/RecipientSignController.php`

- `pdf()` now returns **403 Forbidden** when `recipient.status === 'pending'`.
- Matches the existing `complete()` sequential-signing rule.
- Direct access to `/r/{token}/pdf` no longer bypasses the "waiting for others" UI.
- Workflow unchanged: recipients with `status === 'sent'` can view and sign; `show()` still renders the waiting view for `pending` recipients.

### 2. Recipient field ownership validation

**File:** `app/Http/Controllers/RecipientSignController.php`

- `complete()` validates every submitted `signed_fields.*.id` against fields assigned to the recipient's `editor_recipient_id` in `document.editor_state.placedFields`.
- Cross-recipient field injection returns **422** with message: *"One or more fields are not assigned to you."*
- Invalid attempts are logged to the `cubsign` channel with `recipient_id`, `document_id`, and `invalid_ids`.

### 3. Signed PDF integrity

**File:** `app/Http/Controllers/RecipientSignController.php`

- Document `status` is set to `completed` **only after** `SignedPdfService::generate()` returns a valid path.
- `signed_pdf_path` is written in the same update as `status = completed`.
- On failure (exception or `null` return):
  - Document **remains** in its prior status (not `completed`).
  - Error logged to `cubsign` channel.
  - `document_activities` record created with event `signed_pdf_failed` and explanatory `meta.message`.
- Recipient signing still returns `{ ok: true }` — the individual signature is recorded; only document completion is gated on PDF generation.

---

## Production Blockers Remaining

These were identified in the audit and are **not** fixed by Phase 1 code changes:

| # | Blocker | Severity | Action required |
|---|---------|----------|-----------------|
| 1 | **Ephemeral PDF storage** — `storage/app/private` is gitignored; deploys without a persistent volume lose all PDFs | CRITICAL | Mount persistent volume at `storage/app/private` |
| 2 | **Resend package missing** — `MAIL_MAILER=resend` requires `resend/resend-php` (not in `composer.json`) | CRITICAL | Run `composer require resend/resend-php` **or** use SMTP |
| 3 | **Production `.env` not applied** — `APP_DEBUG=true` and WAMP defaults in `.env.example` | CRITICAL | Create production `.env` from template below |
| 4 | **Redis infrastructure** — sessions/cache expect Redis per recommended config | HIGH | Provision Redis or align all drivers to `database` |
| 5 | **PHP / webserver limits** — upload 50 MB, memory for FPDI | HIGH | Set `upload_max_filesize`, `post_max_size` ≥ 50M; `memory_limit` ≥ 256M |
| 6 | **HTTPS / secure cookies** — `SESSION_SECURE_COOKIE` not set | HIGH | Enable TLS; set `SESSION_SECURE_COOKIE=true` |
| 7 | **No rate limiting** on public signing routes | MEDIUM | Planned Phase 2 |
| 8 | **Synchronous mail/PDF** — no queue workers | MEDIUM | Planned Phase 2 |
| 9 | **Token expiration** — recipient links never expire | MEDIUM | Planned Phase 2 |
| 10 | **S3 incompatibility** — `Storage::path()` used throughout PDF code | LOW until S3 needed | Refactor before enabling `DOCUMENTS_DISK_DRIVER=s3` |

---

## Remaining Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Mail send failures are silent (HTTP 200) | Recipients may not receive invitations | Monitor logs; queue mail in Phase 2 |
| FPDI cannot parse some PDF 1.5+ files | `signed_pdf_failed` activity; document not completed | Re-export source PDF; consider FPDI PDF parser add-on |
| Orphan `sign/*.pdf` staging files | Disk growth | Scheduled cleanup (Phase 2) |
| Google OAuth links by email | Account takeover if email verified elsewhere | Document in security policy |
| No signing feature tests | Regressions possible | Add tests in Phase 2 |
| `document_activities` unbounded growth | DB size | Archival policy (Phase 2) |

---

## Production `.env` Template

Copy to `.env` on the server. **Do not** copy `.env.example` verbatim.

```dotenv
# ── Application ──────────────────────────────────────────────
APP_NAME=CubSign
APP_ENV=production
APP_KEY=                          # php artisan key:generate
APP_DEBUG=false
APP_URL=https://your-domain.com   # HTTPS, no /public suffix

# ── Logging ──────────────────────────────────────────────────
LOG_CHANNEL=stack
LOG_STACK=daily
LOG_LEVEL=info

# ── Database ─────────────────────────────────────────────────
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cubsign
DB_USERNAME=cubsign
DB_PASSWORD=                      # strong password

# ── Session (Redis recommended) ──────────────────────────────
SESSION_DRIVER=redis
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_SECURE_COOKIE=true
# SESSION_DOMAIN=                 # omit unless using a parent domain
SESSION_PATH=/

# ── Cache & Queue ─────────────────────────────────────────────
CACHE_STORE=redis
QUEUE_CONNECTION=redis
FILESYSTEM_DISK=local

# ── Redis ─────────────────────────────────────────────────────
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# ── Mail — Option A: Resend (requires resend/resend-php) ───────
MAIL_MAILER=resend
MAIL_FROM_ADDRESS="noreply@your-domain.com"
MAIL_FROM_NAME="${APP_NAME}"
RESEND_API_KEY=                   # re_...

# ── Mail — Option B: SMTP (Mailtrap staging / production SMTP)
# MAIL_MAILER=smtp
# MAIL_HOST=smtp.your-provider.com
# MAIL_PORT=587
# MAIL_USERNAME=
# MAIL_PASSWORD=
# MAIL_ENCRYPTION=tls
# MAIL_FROM_ADDRESS="noreply@your-domain.com"
# MAIL_FROM_NAME="${APP_NAME}"

# ── Google OAuth ──────────────────────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"

# ── Document storage (local default; S3 not yet supported in code)
# DOCUMENTS_DISK_DRIVER=local

VITE_APP_NAME="${APP_NAME}"
```

### Recommended values summary

| Variable | Production value | Notes |
|----------|------------------|-------|
| `APP_ENV` | `production` | Never `local` on a public server |
| `APP_DEBUG` | `false` | Prevents stack trace leakage |
| `APP_URL` | `https://your-domain.com` | Must match TLS cert and OAuth redirect |
| `SESSION_DRIVER` | `redis` | Or `database` if Redis unavailable |
| `CACHE_STORE` | `redis` | Or `database` if Redis unavailable |
| `QUEUE_CONNECTION` | `redis` | Currently unused by app; set for future queues |
| `LOG_LEVEL` | `info` | Use `warning` for high-traffic |
| `MAIL_MAILER` | `resend` or `smtp` | See [Mail Requirements](#mail-requirements) |
| `SESSION_SECURE_COOKIE` | `true` | Required behind HTTPS |
| `SESSION_DOMAIN` | *(omit)* | Do not set literal `null` |

---

## Deployment Requirements

### Server stack

| Component | Requirement |
|-----------|-------------|
| PHP | 8.2+ with extensions: `mbstring`, `openssl`, `pdo_mysql`, `redis` (if using Redis), `fileinfo`, `gd` or image support for FPDI PNG overlay |
| Database | MySQL 8.0+ or MariaDB 10.6+ |
| Redis | 6.0+ (recommended for sessions and cache) |
| Node.js | 18+ (build step only) |
| Web server | nginx or Apache; **document root must be `public/`** |

### PHP configuration

```ini
upload_max_filesize = 50M
post_max_size = 50M
memory_limit = 256M
max_execution_time = 120
```

### Deploy commands

```bash
git pull origin main
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan migrate --force
php artisan storage:link          # optional; not required for PDFs
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
# restart PHP-FPM / Apache
```

### Post-deploy checks

- [ ] `GET /up` returns 200
- [ ] `APP_DEBUG=false` — no stack traces on errors
- [ ] Upload → sign → save flow works
- [ ] Send document → invitation email received
- [ ] Recipient sign (sequential) → document `completed` + download returns signed PDF
- [ ] Pending recipient gets 403 on `/r/{token}/pdf`
- [ ] `storage/logs/cubsign.log` writable
- [ ] No `public/hot` file present

### Web server (nginx example)

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    root /var/www/cubsign/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Never expose storage
    location ~ /storage/app/private {
        deny all;
    }
}
```

---

## Storage Requirements

### Disk layout (`documents` disk → `storage/app/private/`)

| Path | Purpose | Created by |
|------|---------|------------|
| `sign/{token}.pdf` | Ephemeral upload staging (sign sessions, template use) | `SignSessionService`, `TemplatesController` |
| `templates/{hash}.pdf` | Reusable template PDFs | `TemplatesController::store` |
| `documents/user_{id}/{name}-{timestamp}.pdf` | Owner-signed / base PDFs (`documents.pdf_path`) | `SaveDocumentController` |
| `signed/user_{id}/signed_{docId}_{timestamp}.pdf` | Final multi-recipient overlay PDF (`documents.signed_pdf_path`) | `SignedPdfService` |

### Public exposure audit

| Location | Web accessible? | Access method |
|----------|-----------------|---------------|
| `storage/app/private/**` | **No** (not in `public/`) | Controller routes only |
| `storage/app/public/**` | Yes, via `public/storage` symlink | General public assets only; **not used for PDFs** |
| `public/storage` | Symlink to `storage/app/public` | `php artisan storage:link` |

**PDF serving routes (all authenticated or token-gated):**

| Route | Auth |
|-------|------|
| `GET /sign/pdf` | Session `sign_token` |
| `GET /documents/{id}/download` | `auth` + ownership |
| `GET /templates/{id}/pdf` | `auth` + ownership |
| `GET /r/{token}/pdf` | Recipient `sign_token`; **403 if pending** |

### Production volume requirements

- **Mount a persistent volume** at `storage/app/private` (or the full `storage/` directory).
- PDF files are **gitignored** — code deploys do not include document data.
- Back up the storage volume independently of the database.
- Ensure the web server user (`www-data`, `nginx`, `IUSR`) has read/write on `storage/`.
- **Do not** point the web document root at `storage/` or the project root.

### S3 note

`DOCUMENTS_DISK_DRIVER=s3` is configured in `config/filesystems.php` but **not production-ready**. Multiple code paths call `Storage::disk('documents')->path()` and `response()->file()`, which require a local filesystem. Do not enable S3 until those paths are refactored.

---

## Mail Requirements

### Current configuration audit

| Item | Status |
|------|--------|
| Default mailer (`config/mail.php`) | `env('MAIL_MAILER', 'log')` — safe fallback writes to log |
| `.env.example` mailer | `MAIL_MAILER=resend` |
| Resend transport | Configured in `config/mail.php` → `mailers.resend` |
| Resend API key | `config/services.php` → `RESEND_API_KEY` |
| `resend/resend-php` package | **NOT installed** — only listed as suggested dependency in `composer.lock` |
| SMTP mailer | Configured and functional when `MAIL_MAILER=smtp` |
| Mailable | `RecipientInvitationMail` — sent synchronously via `Mail::send()` |
| Queue | Not used (`ShouldQueue` not implemented) |

### Resend integration

To use Resend in production:

```bash
composer require resend/resend-php
```

Then set:

```dotenv
MAIL_MAILER=resend
RESEND_API_KEY=re_your_key_here
MAIL_FROM_ADDRESS=noreply@your-verified-domain.com
```

Verify the sender domain in the Resend dashboard (SPF/DKIM).

### SMTP fallback

For Mailtrap (staging) or any SMTP provider:

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io   # staging
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@your-domain.com
```

Remove or ignore `RESEND_API_KEY` when using SMTP.

### Pre-launch mail test

```bash
php artisan tinker
>>> Mail::raw('CubSign mail test', fn ($m) => $m->to('you@example.com')->subject('Test'));
```

Check `storage/logs/laravel.log` if `MAIL_MAILER=log`.

---

## Redis Requirements

Redis is **recommended** for staging and production when using the recommended `.env` values.

| Service | Env variable | Fallback if no Redis |
|---------|--------------|----------------------|
| Sessions | `SESSION_DRIVER=redis` | `database` (requires `sessions` table — exists) |
| Cache | `CACHE_STORE=redis` | `database` (requires `cache` table — exists) |
| Queue | `QUEUE_CONNECTION=redis` | `database` (requires `jobs` table — exists) |

**Current app behavior:** No queued jobs are dispatched. Redis is required for sessions/cache performance, not for queue workers.

### Redis checklist

- [ ] Redis server running and reachable from app host
- [ ] `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` set correctly
- [ ] Firewall allows app → Redis (port 6379)
- [ ] `phpredis` or `predis` extension installed (`REDIS_CLIENT=phpredis` in `.env.example`)

---

## Staging Deployment Checklist

- [ ] Phase 1 code deployed (`RecipientSignController` fixes)
- [ ] Production `.env` applied with `APP_ENV=staging` or `production`, `APP_DEBUG=false`
- [ ] Persistent storage mounted
- [ ] Redis running
- [ ] Mail configured and test email sent
- [ ] `php artisan migrate --force`
- [ ] `npm run build` (no `public/hot`)
- [ ] Full sign → send → recipient → download test passed
- [ ] Verify `signed_pdf_failed` appears in activity log when PDF generation fails (optional negative test)

---

## Rollback

```bash
git checkout <previous-tag-or-commit>
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
# restart PHP-FPM
```

Database: prefer forward-fix migrations over `migrate:rollback` in production.  
Storage: rollback does not restore PDF files — rely on volume snapshots.

---

## Version

Application version: **0.9.0** (pre-1.0, post Phase 1 hardening)  
Recommended git tag: `v0.9.0-phase1-hardening`
