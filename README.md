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
  └─ Editor auto-scans PDF text layer for signature keywords (after render)
       └─ Places fields (signature, initials, date, name, text, checkbox) — manually or via detected overlays
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

## Editor Auto-Detection

Signature detection in `Sign/Editor.vue` is **user-initiated only** — it never runs automatically on PDF load. When the user clicks **Detect Signature Fields**, `detectFields()` scans the pdf.js text layer for signature-related keywords (`signature`, `sign here`, `signed by`, etc.). Matches appear as amber dashed overlays on the PDF and in the sidebar list. Users can click a suggestion to place their saved signature, use **Auto Place** (which runs detection first if needed) for the highest-confidence match, or **Place Manually**.

Initials, name, date, and other field types are placed manually via the field-type grid (not keyword-scanned). Detection results are temporary UI helpers and are not restored from saved editor state.

After **Save Signature** or **Save Initials**, the editor automatically enters manual placement mode (highlighted **Place Manually** button + floating “Click anywhere…” banner) so the user can click the PDF immediately — no extra step required.

---

## Workspace Loading

The signing editor shows a full-screen CubSign-branded overlay while the PDF initializes (`SignWorkspaceLoader.vue`, teleported to `body`). The workspace layout stays mounted underneath with pointer events disabled until rendering completes, then the overlay fades out smoothly — no layout jump.

---

## Document Delete & Missing Routes

Deleting a document redirects to **My Documents** with a “Document deleted successfully.” toast. Accessing a deleted or missing document (show, open, download, etc.) redirects to the documents list with “This document is no longer available.” instead of Laravel’s default 404. Custom `document` route binding lives in `AppServiceProvider`.

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

Mandatory email verification is enforced for all email/password accounts. Users must verify before accessing the workspace (overview, documents, templates, profile) and other authenticated workspace features.

Guest signing (`/sign`), public signing, and recipient signing (`/r/{token}`) do **not** require authentication or email verification.

**Guest self-sign flow (v0.12.1):** Upload → Editor → Review → Finish Signing → Complete → Download. The signed PDF is held in `window.__cubsignSession` until download; no server save or login is required.

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

GET    /sign                      sign.index         Upload (public — no auth)
POST   /sign                      sign.store         Upload PDF
GET    /sign/editor               sign.editor        Editor
GET    /sign/pdf                  sign.pdf           Serve original PDF
GET    /sign/complete             sign.complete      Download / account CTA
POST   /sign/save                 sign.save          Save draft to workspace [auth]
GET    /sign/sent                 sign.sent          Post-send summary [auth]

GET    /r/{token}                 recipient.sign     Recipient signing page
GET    /r/{token}/pdf             recipient.pdf      Serve PDF to recipient
POST   /r/{token}/complete        recipient.complete Submit signed fields
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

## Marketing Website

Public marketing pages are built with Vue 3 + Inertia + Tailwind under `PublicLayout.vue`. Frontend-only — no backend API changes.

**Current version:** v0.13.2 — Template module production audit: hardened save/load, lazy PDF rendering, mobile preview parity, feature tests. Sign Editor unchanged.

### Template Module (v0.13.2)

Production audit fixes: field type validation, bounds clamping, shared `TemplateFieldPlaceholder`, lazy page rendering for large PDFs, mobile preview toolbar, feature tests for save/use/duplicate/session isolation. Sign Editor was not modified.

### Template Module (v0.13.1)

Template editor defines reusable field layouts only: select field type → click PDF → placeholder created. No detect/auto-place, no signing mode, no recipients. Saved state is layout metadata only. Creating a document from a template opens the normal Sign Editor with a fresh session. Preview shows structural placeholders. Sign Editor was not modified.

### Template Module (v0.13.0)

Template editor reuses Sign Editor components (`EditorFieldTypeGrid`, `EditorPlacementHelper`, etc.), shared `editorConstants`, and `pdfPageRenderer`. Manual click-to-place workflow, placeholder-only fields, read-only preview at `/templates/{id}/preview`. Sign Editor was not modified.

### Features Page (v0.12.3)

Compact product overview at `/features`: hero with dashboard mockup, six alternating feature sections, audience workflow cards, included-capabilities grid, and a single bottom CTA. Removed homepage-duplicate sections (workflow, stats, testimonial, comparison). Content in `resources/js/constants/featuresPage.js`.

### Features Page (v0.12.2)

Premium SaaS-style product page at `/features`: hero with product illustration, four alternating feature showcases, workspace grid, workflow timeline, comparison block, testimonial, statistics, and gradient CTA. Content in `resources/js/constants/featuresPage.js`; illustrations in `resources/js/Components/Marketing/Features/`.

### Homepage Structure (v0.12.0)

| Section | Description |
|---|---|
| Hero | Product screenshot, CTAs, trust badges |
| How it works | Upload → Sign → Download (compact mockups) |
| Workflow | 6-step timeline |
| Social proof | Stats, audience categories, testimonials |
| Pricing | Early Access card + comparison |
| FAQ | Top 5 questions + link to `/faq` |
| Final CTA | Single banner before footer |

Removed from homepage (v0.12.0): duplicate Features grid, Security section. Full feature list remains on `/features`. Security details remain in hero badges, Privacy Policy, and footer.

### Footer (v0.11.4+)

| Section | Links |
|---|---|
| Product | Features, Pricing, FAQ |
| Company | About, Blog, Contact |
| Legal | Privacy Policy, Terms, Cookie Policy |
| Resources | Documentation (coming soon), Help Center → `/faq` |

Removed: Developers column, Support column, duplicate bottom legal links, broken external URLs (Status, API, docs.cubsign.com). Social links and newsletter are UI-only until launch.

### Public Pages

| Route | Page |
|---|---|
| `/` | Home — streamlined SaaS landing page |
| `/features` | Features |
| `/pricing` | Pricing |
| `/faq` | FAQ with search |
| `/about` | About Us |
| `/contact` | Contact Us (frontend form + success state) |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/cookies` | Cookie Policy |
| `/blog` | Blog homepage |
| `/blog/{slug}` | Blog article detail |

### Marketing Components

Reusable components live in `resources/js/Components/Marketing/`:

- `ScrollReveal.vue` — Intersection Observer fade/slide animations (respects `prefers-reduced-motion`)
- `SectionHeader.vue` (supports `compact`), `WorkflowTimeline.vue`, `ProductMockup.vue` (supports `size="compact"`)
- `SocialProof.vue` (supports `compact`), `PricingSection.vue` (supports `compact`), `FaqAccordion.vue`, `MarketingHero.vue`, `CtaBanner.vue`

### Shared Constants

- `resources/js/constants/marketing.js` — copy, `homePricingComparison`, `securityPageFeatures` (reserved for future Trust Center), footer links
- Blog articles are stored in the database and managed from the workspace

### Responsive Checklist

- [x] Desktop (1280px+)
- [x] Laptop (1024px)
- [x] Tablet (768px)
- [x] Mobile (375px)
- [x] No horizontal scrolling

### Regression Checklist (Marketing Redesign)

- [x] Authentication — unchanged
- [x] Signing Editor — unchanged
- [x] Dashboard / Workspace — unchanged
- [x] Upload / Review / Complete flows — unchanged (v0.12.1: guest Review finish fix)
- [x] Email Verification — unchanged
- [x] Request Signatures — unchanged
- [x] Auto Detection — unchanged
- [x] Backend APIs — unchanged
- [x] Routes — unchanged (v0.11.3 is marketing UI only)
- [x] Footer — no broken external links; Documentation uses `#` until live
- [x] Contact form — frontend validation only (no backend mail yet; documented in audit)

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
