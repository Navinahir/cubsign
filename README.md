# CubSign

A document signing platform built with Laravel 12, Vue 3, and Inertia.js. Owners upload PDFs, place signature fields, add recipients, and send — recipients sign in order via secure token links. When all recipients have signed, a final PDF with all signatures overlaid is generated and made available for download.

> **Product by Cubiz Infotech** · [cubizinfotech.com](https://cubizinfotech.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | PHP 8.2 · Laravel 12 |
| Frontend | Vue 3 (Composition API) · Inertia.js v2 · Tailwind CSS v3 |
| Build tool | Vite 8 · laravel-vite-plugin |
| PDF rendering (browser) | pdfjs-dist v3.11.174 |
| PDF embedding (browser) | pdf-lib v1.17.1 |
| PDF overlay generation (server) | setasign/fpdi + setasign/fpdf |
| Database | MySQL |
| Cache / Session / Queue | Redis |
| Auth | Laravel Breeze |
| JS routing | Ziggy |

---

## Architecture

```
app/
  Http/Controllers/
    Web/
      Sign/
        UploadController.php         — guest upload flow
        EditorController.php         — PDF editor page
        PdfController.php            — serve original PDF
        CompleteController.php       — complete/download page
      Workspace/
        DocumentsController.php      — CRUD + send
        DocumentShowController.php   — detail + activity
        DocumentDownloadController.php — download signed or base PDF
    RecipientSignController.php      — token-based recipient signing
  Mail/
    RecipientInvitationMail.php
  Models/
    Document.php
    Recipient.php
    DocumentActivity.php
    SignSession.php
    User.php
  Services/
    SignedPdfService.php             — final PDF overlay generation
  Repositories/
    SignSessionRepository.php
resources/
  js/Pages/
    Workspace/
      Documents.vue                  — document list (status badge + download icon)
      DocumentShow.vue               — detail view + activity timeline
    Sign/
      Editor.vue                     — owner PDF editor with field placement
      Upload.vue
      Complete.vue
    RecipientSign.vue                — recipient signing page (token-gated)
  views/emails/
    recipient-invitation.blade.php
```

---

## Database Schema

### `documents`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| user_id | bigint FK | owner |
| name | string | original filename |
| status | string | `draft` / `sent` / `completed` |
| pdf_path | string | base PDF on `documents` disk |
| signed_pdf_path | string nullable | final overlay PDF path |
| sign_token | string | owner session token |
| editor_state | json | placed fields, scale, recipients |
| deleted_at | timestamp nullable | soft delete |

### `recipients`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| document_id | bigint FK | |
| name | string | |
| email | string | |
| color | string | hex — used in editor UI |
| signing_order | integer | sequential position |
| editor_recipient_id | string | matches `signerId` in `editor_state.placedFields` |
| sign_token | string unique | URL token for signing link |
| status | string | `pending` / `sent` / `signed` |
| signed_at | timestamp nullable | |
| signed_fields | json nullable | field values submitted on signing |

### `document_activities`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| document_id | bigint FK | |
| recipient_id | bigint FK nullable | |
| event | string | `document_sent`, `recipient_notified`, `recipient_signed`, `document_completed` |
| meta | json | name, email |

### `sign_sessions`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| token | string unique | 40-char random |
| original_filename | string | |
| disk_path | string | |
| file_size | bigint | bytes |
| status | enum | Uploaded / Editing / Signed / Downloaded |
| user_id | bigint nullable | null for guests |
| ip_address | string | |

---

## Signing Workflow

```
Owner uploads PDF
  └─ Places fields (signature, initials, date, name, text, checkbox)
       └─ Assigns each field to a recipient
            └─ Adds recipients (name, email, signing order)
                 └─ DocumentsController::send() called
                      ├─ first recipient → status='sent', invitation email sent
                      └─ remaining recipients → status='pending'

RecipientSignController::complete() (recipient submits)
  ├─ recipient → status='signed', signed_fields saved
  ├─ create 'recipient_signed' activity
  ├─ next pending recipient exists?
  │     YES → status='sent', create 'recipient_notified', send email
  └─ NO (all signed):
        ├─ document → status='completed'
        ├─ create 'document_completed' activity
        └─ SignedPdfService generates final PDF → signed_pdf_path saved
```

---

## Email Delivery

Mail is configured via `.env` only — no credentials in code. Supports any Laravel mail driver.

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_user
MAIL_PASSWORD=your_pass
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@cubsign.com
MAIL_FROM_NAME="CubSign"
```

Email failures are caught, logged, and never abort the signing flow or HTTP response.

---

## Signed PDF Generation (`SignedPdfService`)

1. Opens `pdf_path` (base PDF) via FPDI
2. Iterates every page; overlays all recipient `signed_fields`
3. Coordinate conversion: `pdf_pts = field_pixels / editorScale`
   - FPDF uses top-left origin — same as CSS — no Y-flip required
4. Field types rendered:
   - `signature` / `initials` — base64 PNG decoded → temp file → `Image()`
   - `date` / `name` / `text` — `Text()` with Helvetica, font size clamped 8–14 pt
   - `checkbox` — two-line tick drawn with `Line()`
5. Stored at `signed/user_{id}/signed_{doc_id}_{timestamp}.pdf` on `documents` disk
6. `signed_pdf_path` updated; original `pdf_path` preserved

`DocumentDownloadController` serves `signed_pdf_path` for completed documents, falling back to `pdf_path` for all other statuses.

---

## Local Development Setup

### Requirements

- WAMP64 (PHP 8.2 + MySQL + Apache)
- Node.js 20+
- Composer 2

### Steps

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Configure `.env`:
```
DB_DATABASE=cubsign
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=log   # use 'log' for local dev, check storage/logs/laravel.log

# Email verification (optional — defaults shown)
AUTH_VERIFICATION_EXPIRE=1440          # link expiry in minutes (24 hours)
AUTH_VERIFICATION_RESEND_COOLDOWN=60   # seconds between resend clicks
AUTH_VERIFICATION_RESEND_LIMIT=5       # max resends per hour
AUTH_VERIFICATION_RESEND_DECAY=60      # rate-limit window in minutes
```

**PHPUnit note:** Tests use `.env.testing` with `APP_URL=http://localhost`. If tests return 404, run `php artisan config:clear` — a cached config with a subdirectory `APP_URL` (e.g. `http://localhost/cubsign/public`) breaks route matching in tests.

```bash
php artisan migrate
php artisan storage:link
npm run build

# Hot-reload for development
npm run dev
```

Storage disks:

| Disk | Root | Purpose |
|---|---|---|
| `documents` | `storage/app/private` | owner PDFs, signed PDFs |
| `local` (default) | `storage/app` | sign session uploads |

---

## Email Verification

Mandatory email verification is enforced for all email/password accounts. Users must verify before accessing the workspace, signing editor (when logged in), settings, or any authenticated feature.

### User flow

1. User registers → account created with `email_verified_at = null`, `status = pending_verification`
2. Verification email sent immediately (Laravel signed URL, 24-hour expiry)
3. User redirected to `/verify-email` (not the workspace)
4. User clicks **Verify Email** in email → auto-logged in → redirected to `/overview` with success toast
5. Unverified users who log in are redirected to `/verify-email`
6. Google OAuth users are auto-verified (`status = active`)

### Verify Email screen (`/verify-email`)

- Resend verification email (60-second cooldown, max 5 per hour)
- Change email address (`/verify-email/change`)
- Log out
- Expired links show `/verify-email/expired`

### Technical implementation

| Layer | Files |
|---|---|
| Model | `app/Models/User.php` — implements `MustVerifyEmail`, `UserStatus` enum |
| Notification | `app/Notifications/VerifyEmailNotification.php` |
| Email template | `resources/views/emails/verify-email.blade.php` |
| Middleware | `app/Http/Middleware/EnsureEmailIsVerified.php` — returns `403 Email Verification Required` for JSON |
| Controllers | `RegisteredUserController`, `VerifyEmailController`, `EmailVerificationPromptController`, `EmailVerificationNotificationController`, `ChangeVerificationEmailController`, `VerificationExpiredController` |
| Vue pages | `Auth/VerifyEmail.vue`, `Auth/VerificationExpired.vue`, `Auth/ChangeEmail.vue` |
| Migration | `2026_06_25_000001_add_status_to_users_table.php` |

### Routes added

```
GET  /verify-email                    verification.notice        [auth]
GET  /verify-email/change             verification.change        [auth]
PUT  /verify-email/change             verification.update-email  [auth]
GET  /verify-email/expired            verification.expired
GET  /verify-email/{id}/{hash}        verification.verify        [signed]
POST /email/verification-notification verification.send          [auth]
```

### Database

`users.status` — `pending_verification` | `active`

---

## Routes

```
GET    /                          home               Public homepage
GET    /features                  features           Features page
GET    /pricing                   pricing            Pricing page
GET    /faq                       faq                FAQ page

GET    /overview                  overview           Workspace  [auth + verified]
GET    /documents                 documents.index    [auth + verified]
GET    /profile                   profile.edit       [auth + verified]

GET    /verify-email              verification.notice           [auth]
GET    /verify-email/{id}/{hash}  verification.verify           [signed]
GET    /verify-email/expired      verification.expired
POST   /email/verification-notification  verification.send      [auth]

GET    /sign                      sign.index         Upload (guests OK; auth users need verified)
POST   /sign                      sign.store         [verified if authenticated]
GET    /sign/editor               sign.editor        [verified if authenticated]
GET    /sign/pdf                  sign.pdf           Serve original PDF
GET    /sign/complete             sign.complete      Download / account CTA

GET    /sign/{token}              recipient.sign     Recipient signing page
GET    /sign/{token}/pdf          recipient.pdf      Serve PDF to recipient
POST   /sign/{token}/complete     recipient.complete Submit signed fields
```

---

## Naming Conventions

| Banned | Correct |
|---|---|
| Dashboard | Workspace |
| Admin Panel | Workspace |
| Admin | Overview |

These terms are prohibited in route names, controller names, Vue filenames, and all UI copy.

---

## Logging

CubSign writes to a dedicated log channel:

```bash
tail -f storage/logs/cubsign.log
```

Logs rotate daily and are kept for 30 days. The token is partially masked (`…last8chars`) in all log entries.

---

## Remaining Planned Features

- **Audit Trail PDF** — downloadable certificate with all signing events, timestamps, and IP addresses
- **Completion Certificate** — branded PDF summary attached to each completed document
- **Document Expiration** — auto-expire unsigned documents after a configurable number of days
- **Reminders** — automatic follow-up emails to recipients who have not yet signed
- **Template Enhancements** — reusable field layouts, bulk send from template
- **Team Workspaces** — shared documents across team members with role-based access
- **Branding Customization** — custom logo and colors in invitation emails
- **API Access** — REST API for programmatic document sending and status polling
- **Webhooks** — POST to a configured URL on signing events (sent, signed, completed)
- **Production Hardening** — S3 storage, queue-based email and PDF generation, rate limiting, virus scan on upload

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) and [docs/CHANGELOG.md](docs/CHANGELOG.md) for the full build history.

See [DEVELOPMENT_TRACKER.md](DEVELOPMENT_TRACKER.md) for feature completion status.
