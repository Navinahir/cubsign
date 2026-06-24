# CubSign v0.9.5-Beta Deployment Plan

**Goal:** Deploy CubSign to a private beta environment at `https://beta.cubsign.com`, complete staging validation, and run a controlled beta before **v1.0.0**.

**Current release:** v0.9.0 (engineering-complete)  
**Beta target:** `v0.9.5-beta`  
**Production candidate:** `v1.0.0-rc1`  
**Production:** `v1.0.0`

**Related docs:**
- [`STAGING_QA_CHECKLIST.md`](STAGING_QA_CHECKLIST.md) — Phase 3 validation script
- [`PRODUCTION_READY.md`](PRODUCTION_READY.md) — Environment template and storage/mail details
- [`BETA_READINESS_REPORT.md`](BETA_READINESS_REPORT.md) — Readiness scores and blockers

---

## Release Roadmap

| Milestone | Tag | Gate |
|-----------|-----|------|
| Engineering complete | `v0.9.0` | P0 + staging hardening merged |
| **Private beta deploy** | **`v0.9.5-beta`** | Phase 1–3 complete; QA + Dev sign-off |
| Beta bug-fix window | `v0.9.5-beta` (+ patches) | Phase 5 fixes only |
| Production candidate | `v1.0.0-rc1` | Phase 6 pre-production items + full QA |
| Production | `v1.0.0` | RC sign-off; production infra |

```bash
# After Phase 2 deploy succeeds locally on beta server
git tag -a v0.9.5-beta -m "Private beta release"
git push origin v0.9.5-beta
```

---

## Phase 1 — Infrastructure Setup

### Server requirements

| Component | Version / spec |
|-----------|----------------|
| OS | Ubuntu 24.04 LTS |
| PHP | 8.3 (FPM) |
| Web server | Nginx |
| Database | MySQL 8.0+ |
| Cache / sessions | Redis 7+ |
| Process manager | Supervisor (queue workers — optional today, required before v1.0) |
| TLS | Let's Encrypt (Certbot) |
| Node.js | 18+ (build step only) |

### PHP extensions (required)

```bash
sudo apt install php8.3-fpm php8.3-mysql php8.3-redis php8.3-mbstring \
  php8.3-xml php8.3-curl php8.3-zip php8.3-gd php8.3-bcmath php8.3-intl
```

### PHP configuration (`/etc/php/8.3/fpm/php.ini`)

```ini
upload_max_filesize = 50M
post_max_size = 50M
memory_limit = 256M
max_execution_time = 120
```

Restart after changes: `sudo systemctl restart php8.3-fpm`

### Domain

| Setting | Value |
|---------|-------|
| Beta URL | `https://beta.cubsign.com` |
| Document root | `/var/www/cubsign/public` |
| **Never** point root at `storage/` or project root |

### MySQL

```sql
CREATE DATABASE cubsign CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cubsign'@'localhost' IDENTIFIED BY '<strong-password>';
GRANT ALL PRIVILEGES ON cubsign.* TO 'cubsign'@'localhost';
FLUSH PRIVILEGES;
```

### Redis

```bash
sudo apt install redis-server
sudo systemctl enable redis-server
redis-cli ping   # expect PONG
```

### Persistent storage

PDFs **must survive** code deploys. Mount a dedicated volume or bind mount:

```bash
# Example: bind mount (adjust paths for your host)
sudo mkdir -p /var/lib/cubsign/storage-private
sudo chown -R www-data:www-data /var/lib/cubsign/storage-private

# In deployment directory
ln -sfn /var/lib/cubsign/storage-private /var/www/cubsign/storage/app/private
```

**Verify:** upload a PDF → redeploy code → PDF still downloadable.

**Backup:** schedule snapshots of `/var/lib/cubsign/storage-private` and MySQL dumps independently.

### SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d beta.cubsign.com
```

Enforce HTTPS redirect in Nginx (Certbot usually adds this).

### Nginx site (`/etc/nginx/sites-available/beta.cubsign.com`)

```nginx
server {
    listen 443 ssl http2;
    server_name beta.cubsign.com;
    root /var/www/cubsign/public;

    index index.php;

    ssl_certificate     /etc/letsencrypt/live/beta.cubsign.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/beta.cubsign.com/privkey.pem;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 120;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}

server {
    listen 80;
    server_name beta.cubsign.com;
    return 301 https://$host$request_uri;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/beta.cubsign.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Environment file (`.env` on beta server)

**Do not copy `.env.example` verbatim.** Create from template:

```dotenv
APP_NAME=CubSign
APP_ENV=production
APP_KEY=                          # php artisan key:generate
APP_DEBUG=false
APP_URL=https://beta.cubsign.com

LOG_CHANNEL=stack
LOG_STACK=daily
LOG_LEVEL=info

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cubsign
DB_USERNAME=cubsign
DB_PASSWORD=

SESSION_DRIVER=redis
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_SECURE_COOKIE=true
SESSION_PATH=/

CACHE_STORE=redis
QUEUE_CONNECTION=redis
FILESYSTEM_DISK=local

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Option A — SMTP
MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@beta.cubsign.com
MAIL_FROM_NAME="${APP_NAME}"

# Option B — Resend (run: composer require resend/resend-php on build server)
# MAIL_MAILER=resend
# RESEND_API_KEY=re_...
# MAIL_FROM_ADDRESS=noreply@beta.cubsign.com

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"

VITE_APP_NAME="${APP_NAME}"
```

### Mail setup

| Option | Steps |
|--------|-------|
| **A — SMTP** | Configure provider (Mailtrap for smoke test, production SMTP for beta). Verify SPF/DKIM for sending domain. |
| **B — Resend** | `composer require resend/resend-php` before `composer install --no-dev`. Set `RESEND_API_KEY`. Verify domain in Resend dashboard. |

**Smoke test:**

```bash
php artisan tinker
>>> Mail::raw('CubSign beta mail test', fn ($m) => $m->to('you@example.com')->subject('Beta test'));
```

### Supervisor (optional for v0.9.5-beta)

CubSign does not dispatch queued jobs today. Install Supervisor for future v1.0; no worker required for beta unless mail is queued later.

```ini
# /etc/supervisor/conf.d/cubsign-worker.conf (future)
[program:cubsign-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/cubsign/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/cubsign/storage/logs/worker.log
```

### Phase 1 completion checklist

- [ ] Ubuntu 24.04 provisioned
- [ ] PHP 8.3 + extensions installed
- [ ] Nginx configured; docroot = `public/`
- [ ] MySQL database and user created
- [ ] Redis running
- [ ] Persistent volume at `storage/app/private`
- [ ] SSL active; HTTP → HTTPS redirect
- [ ] `.env` created with values above
- [ ] `APP_KEY` generated
- [ ] Mail provider tested
- [ ] Google OAuth callback URL updated to beta domain (if used)

---

## Phase 2 — Deployment

### Initial deploy

```bash
# On server (as deploy user)
cd /var/www
git clone <repository-url> cubsign
cd cubsign
git checkout v0.9.5-beta   # or main after tag is created

# Dependencies
composer install --no-dev --optimize-autoloader
# If Resend: ensure resend/resend-php is in composer.json first

npm ci
npm run build

# Application setup
cp .env.example .env   # then edit — see Phase 1 template
php artisan key:generate
php artisan migrate --force

# Permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R ug+rwx storage bootstrap/cache

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Verify no Vite dev artifact
test ! -f public/hot && echo "OK: no public/hot"
```

### Post-deploy smoke test

```bash
curl -s -o /dev/null -w "%{http_code}" https://beta.cubsign.com/up   # expect 200
```

### Subsequent deploys (code only — preserve storage)

```bash
cd /var/www/cubsign
git fetch --tags
git checkout v0.9.5-beta

composer install --no-dev --optimize-autoloader
npm ci && npm run build

php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

sudo systemctl restart php8.3-fpm
sudo systemctl reload nginx
# sudo supervisorctl restart cubsign-worker:*   # when queues are enabled
```

### Phase 2 completion checklist

- [ ] `composer install --no-dev` succeeded
- [ ] `npm run build` succeeded
- [ ] Migrations applied
- [ ] Config/route/view cached
- [ ] `GET /up` returns 200
- [ ] `public/hot` absent
- [ ] Git tag `v0.9.5-beta` pushed and checked out

---

## Phase 3 — Staging Validation

Execute **every item** in [`STAGING_QA_CHECKLIST.md`](STAGING_QA_CHECKLIST.md) on `https://beta.cubsign.com`.

### Critical workflow reminder

Multi-recipient documents require this order:

1. Editor → Review  
2. **Finish Signing** (wait for Complete “Saved”)  
3. Return to Review → **Prepare Requests**  
4. Recipients sign in sequence  

Prepare before Finish must return **422** with finalize message (P0 guard).

### Validation sign-off

| Section | QA (Pass/Fail) | Developer (Pass/Fail) | Notes |
|---------|----------------|---------------------|-------|
| 0. Environment pre-flight | | | |
| 1. Self sign | | | |
| 2. Single recipient | | | |
| 3. Multi-recipient sequential | | | |
| 4. Template flow | | | |
| 5. Email flow | | | |
| 6. Completed download | | | |
| 7. Invalid token | | | |
| 8. Duplicate send protection | | | |
| 9. Completed document protection | | | |
| 10. Security spot checks | | | |
| 11. Dashboard consistency | | | |

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA | | | |
| Developer | | | |

### Phase 3 gate

| Criteria | Required |
|----------|----------|
| All checklist sections Pass (or documented Waived with reason) | Yes |
| No open **Critical** or **High** defects | Yes |
| QA + Developer sign-off | Yes |

**If any section fails:** fix in Phase 5 window (bugs only), redeploy, re-run failed sections.

---

## Phase 4 — Beta Launch

### Invite list (private beta)

- Internal team  
- Friends (trusted testers)  
- 2–5 trusted clients  

### Beta onboarding (send to testers)

Include in invite email:

1. URL: `https://beta.cubsign.com`  
2. Create account or use Google OAuth  
3. For sending to others: **Finish Signing before Prepare Requests**  
4. Report issues to: *[your support channel]*  
5. Do not upload highly sensitive production legal documents during beta  

### Monitoring

| Log / signal | Path / command |
|--------------|----------------|
| Application log | `storage/logs/laravel.log` |
| CubSign channel | `storage/logs/cubsign.log` |
| Nginx errors | `/var/log/nginx/error.log` |
| PHP-FPM | `/var/log/php8.3-fpm.log` |

**Watch for:**

```bash
# Mail failures
grep -i "RecipientInvitationMail failed" storage/logs/cubsign.log

# PDF generation failures
grep -i "SignedPdfService" storage/logs/cubsign.log
grep "signed_pdf_failed" storage/logs/cubsign.log

# HTTP 5xx (nginx access log)
```

| Failure type | Where to look |
|--------------|---------------|
| Email failures | `cubsign.log`; Review warning banner; missing `recipient_notified` activity |
| PDF generation failures | `signed_pdf_failed` activity; document not `completed` |
| Download failures | 404 on `pdf_path` / `signed_pdf_path`; storage volume mount |
| Recipient signing failures | 403 pending PDF; 422 field validation; empty `editor_state` |

### Phase 4 completion checklist

- [ ] Beta users invited  
- [ ] Onboarding doc sent  
- [ ] Log monitoring in place (daily review during first week)  
- [ ] Issue tracker ready (GitHub Issues / spreadsheet)  

---

## Phase 5 — Bug Fix Window

| Parameter | Value |
|-----------|-------|
| Duration | 1–2 weeks |
| Scope | **Bug fixes only** — no new features |
| Allowed | Critical/high signing bugs, data loss, mail, PDF, security regressions |
| Not allowed | Audit trail, certificates, API, UI redesign |

### Severity guide

| Severity | Examples | SLA |
|----------|----------|-----|
| **Critical** | Data loss, wrong PDF served, auth bypass | Fix within 24h |
| **High** | Signing flow blocked, mail never sends | Fix within 48h |
| **Medium** | UX confusion, non-blocking warnings | Fix before v1.0.0-rc1 |
| **Low** | Cosmetic, guest edge cases | Backlog |

### Patch release process

```bash
git checkout -b fix/beta-<issue>
# fix only
git commit -m "fix: <description>"
git tag -a v0.9.5-beta.1 -m "Beta patch 1"
# redeploy Phase 2 steps; re-run affected QA sections
```

---

## Phase 6 — Pre-Production (v1.0.0-rc1)

**Not in scope for v0.9.5-beta deploy.** Required before `v1.0.0-rc1`:

| # | Item | Priority |
|---|------|----------|
| 1 | Rate limiting (`/sign/*`, `/r/*`) | Required |
| 2 | Token expiration for recipient links | Required |
| 3 | Audit Trail PDF | Product (v1.0 scope) |
| 4 | Completion Certificate | Product (v1.0 scope) |

After implementation: full re-run of [`STAGING_QA_CHECKLIST.md`](STAGING_QA_CHECKLIST.md) + security review.

---

## Rollback procedure

```bash
cd /var/www/cubsign
git checkout <previous-tag>
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan migrate --force    # prefer forward-fix; avoid rollback in beta if possible
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo systemctl restart php8.3-fpm
```

**Storage:** rollback does not restore PDF files — rely on volume snapshots.

---

## Known beta limitations (document for testers)

- Guest users: Review page may not survive refresh (no DB draft)  
- No rate limiting on public signing URLs (v0.9.5)  
- Recipient links do not expire (v0.9.5)  
- Mail and PDF generation run synchronously (timeout risk on very large PDFs)  
- FPDI may fail on some PDF 1.5+ files → `signed_pdf_failed` activity  

---

## Quick reference

| Item | Value |
|------|-------|
| Beta URL | `https://beta.cubsign.com` |
| Tag | `v0.9.5-beta` |
| Multi-recipient order | Finish → Prepare |
| Storage | `/var/lib/cubsign/storage-private` → `storage/app/private` |
| QA doc | [`STAGING_QA_CHECKLIST.md`](STAGING_QA_CHECKLIST.md) |
| Readiness audit | [`BETA_READINESS_REPORT.md`](BETA_READINESS_REPORT.md) |

---

## Approval

| Phase | Owner | Status | Date |
|-------|-------|--------|------|
| 1 — Infrastructure | | Pending | |
| 2 — Deployment | | Pending | |
| 3 — Staging validation | | Pending | |
| 4 — Beta launch | | Pending | |
| 5 — Bug fix window | | Pending | |
| 6 — Pre-production | | Deferred to v1.0 | |

**Beta launch authorized:** ☐ Yes ☐ No — *requires Phase 3 sign-off*
