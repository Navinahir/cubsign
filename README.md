# CubSign

A lightweight, privacy-first PDF signing SaaS built with Laravel 12 and Vue 3 (Inertia.js).  
Guests and authenticated users upload a PDF, apply a signature, and download the signed document — all processed in the browser. No third-party signing services required.

> **Product by Cubiz Infotech** · [cubizinfotech.com](https://cubizinfotech.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | PHP 8.2 · Laravel 12 |
| Frontend | Vue 3 · Inertia.js v2 · Tailwind CSS v3 |
| Build tool | Vite 8 · laravel-vite-plugin |
| PDF rendering (browser) | pdfjs-dist v3.11.174 |
| PDF embedding (browser) | pdf-lib v1.17.1 |
| Database | MySQL (WAMP64) |
| Storage | Local disk — `storage/app/sign/` |
| Auth | Laravel Breeze |

> **Hard rules — never break without explicit approval:**
> - PHP 8.2 + Laravel 12 only. Do not upgrade to Laravel 13 or PHP 8.3+.
> - Do not change package versions without approval.
> - Do not add Redis, S3, Stripe, or any external services in V1.

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
```

```bash
php artisan migrate
npm run build

# Hot-reload for development
npm run dev
```

---

## Architecture

Strict layered architecture — business logic never lives outside Services:

```
HTTP Request
    └── Controller      routes, validation, response only
            └── Service     ALL business logic lives here
                    └── Repository  ALL Eloquent queries live here
                                └── Model   fillable, casts, relations only
```

### Key Directories

```
app/
├── Enums/
│   └── SignSessionStatus.php           uploaded | editing | signed | downloaded
├── Http/
│   ├── Controllers/Web/
│   │   ├── Sign/
│   │   │   ├── UploadController.php    GET+POST /sign
│   │   │   ├── EditorController.php    GET /sign/editor
│   │   │   ├── PdfController.php       GET /sign/pdf  (serves original PDF)
│   │   │   └── CompleteController.php  GET /sign/complete
│   │   ├── HomeController.php
│   │   ├── OverviewController.php
│   │   ├── FeaturesController.php
│   │   ├── PricingController.php
│   │   └── FaqController.php
│   └── Requests/
│       └── UploadPdfRequest.php        PDF validation (mimes:pdf, max:25 MB)
├── Models/
│   ├── SignSession.php
│   └── User.php
├── Repositories/
│   └── SignSessionRepository.php
└── Services/
    └── SignSessionService.php

resources/js/
├── Layouts/
│   ├── SignLayout.vue                  4-step progress header (Upload/Preview/Sign/Download)
│   ├── WorkspaceLayout.vue
│   └── PublicLayout.vue
└── Pages/
    ├── Sign/
    │   ├── Upload.vue                  Step 1 — file picker
    │   ├── Editor.vue                  Steps 2+3 — PDF viewer + signature panel
    │   └── Complete.vue                Step 4 — download or create account
    ├── Home.vue                        Public marketing homepage (FROZEN — do not touch)
    ├── Features.vue
    ├── Pricing.vue
    ├── Faq.vue
    └── Workspace/
        └── Overview.vue
```

---

## Database Schema

### `sign_sessions`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint unsigned | PK |
| `token` | varchar(64) | Unique 40-char random string — stored in PHP session, never in the URL |
| `original_filename` | varchar(191) | As uploaded by the client |
| `disk_path` | varchar(191) | `sign/{token}.pdf` on local disk |
| `file_size` | bigint unsigned | Bytes |
| `status` | varchar(32) | `uploaded` · `editing` · `signed` · `downloaded` |
| `user_id` | bigint unsigned | Nullable FK → `users`, nullOnDelete |
| `ip_address` | varchar(45) | Nullable, IPv4 + IPv6 |
| `created_at` / `updated_at` | timestamp | |

### `SignSessionStatus` enum

```php
case Uploaded   = 'uploaded';
case Editing    = 'editing';
case Signed     = 'signed';
case Downloaded = 'downloaded';
```

---

## Routes

```
GET    /                    home          Public marketing homepage
GET    /features            features      Features page
GET    /pricing             pricing       Pricing page
GET    /faq                 faq           FAQ page

GET    /overview            overview      Workspace overview  [auth + verified]
GET    /profile             profile.edit  [auth]
PATCH  /profile             profile.update
DELETE /profile             profile.destroy

GET    /sign                sign.index    Upload page (guests + auth)
POST   /sign                sign.store    Handle upload
GET    /sign/editor         sign.editor   PDF editor
GET    /sign/pdf            sign.pdf      Serve original PDF (session-gated)
GET    /sign/complete       sign.complete Download / account CTA page
```

Auth routes (Breeze): `/login`, `/register`, `/forgot-password`, `/verify-email`, etc.

---

## Signing Flow

### 1 — Upload (`/sign`)

- User selects a PDF (max 25 MB, `mimes:pdf` validation)
- `UploadController` → `SignSessionService::upload()`
  - Generates a 40-char random `$token`
  - Stores file at `storage/app/sign/{token}.pdf`
  - Creates `sign_sessions` record (`status = uploaded`)
- `sign_token` written to the PHP session
- Redirect → `/sign/editor`

### 2+3 — Editor (`/sign/editor`)

- `EditorController` resolves session from `sign_token` in the PHP session
- Inertia renders `Sign/Editor.vue` with `pdfUrl`, `filename`, `fileSize`
- Browser fetches `/sign/pdf` (session cookie auth — token never in the URL)
- **pdfjs-dist** renders all PDF pages onto `<canvas>` elements
- Multi-page scroll, page thumbnails, zoom in/out

**Signature creation (right panel):**
- **Draw** — freehand on a `<canvas>` (blue ink, `lineWidth: 2.5`)
- **Type** — full name in 3 font styles (Script / Cursive / Print), live preview
- **Upload** — any image file

**Placement modes:**
| Mode | Behaviour |
|---|---|
| Place Manually | Click anywhere on the PDF canvas to drop the signature |
| Detect Fields | Scans the text layer, groups fragmented text runs into lines, scores keyword confidence (colon after keyword +60, short line +40, digit prefix −80, etc.) |
| Auto Place | Runs Detect, places at the highest-confidence field automatically |

Placed signatures are draggable, resizable (8-handle), and deletable.

### 4 — PDF Generation (browser-side, pdf-lib)

1. Fetches original PDF bytes via `/sign/pdf`
2. `PDFDocument.load()` parses the PDF
3. For each placed signature:
   - **Drawn / uploaded images:** re-drawn onto a white-filled canvas (`fillRect #ffffff` then `drawImage`) before `toDataURL()` — prevents transparent PNG being invisible in PDF viewers
   - **Typed text:** rendered onto white canvas with correct font/style/size
   - `embedPng()` + `drawImage()` writes the signature into the PDF page at converted coordinates (canvas px → PDF points)
4. `pdflibDoc.save()` → `Uint8Array`
5. Bytes stored in `window.__cubsignSignedPdf`
6. Inertia navigates to `/sign/complete`

**Coordinate conversion:**
```
scaleX = pageWidthPts  / canvasWidthPx
scaleY = pageHeightPts / canvasHeightPx
pdfX   = sig.x * scaleX
pdfY   = pageHeightPts - (sig.y + sig.h) * scaleY   // PDF Y-axis is bottom-up
pdfW   = sig.w * scaleX
pdfH   = sig.h * scaleY
```

### 5 — Complete (`/sign/complete`)

- Two-card layout: **Download Now** (guest) · **Create Free Account** (recommended)
- Guest download reads `window.__cubsignSignedPdf` and triggers a browser download
- If the user refreshed the page (bytes lost from memory), shows an amber warning with a re-upload link

---

## Logging

CubSign writes to a **dedicated log channel** separate from `laravel.log`.

```bash
# Tail logs in real time
tail -f storage/logs/cubsign.log
```

Logs rotate daily and are kept for **30 days**:
```
storage/logs/cubsign.log
storage/logs/cubsign-YYYY-MM-DD.log
```

### Events logged

| Event | Level | Context |
|---|---|---|
| PDF upload received | `info` | ip, user_id, filename, size, mime |
| PDF stored on disk | `debug` | token†, disk_path, filename, size |
| SignSession record created | `debug` | id, token†, status, user_id |
| Upload complete — session issued | `info` | token†, filename, status |
| Editor loaded | `info` | token†, filename, size, status, user_id |
| Editor — no session token | `warning` | ip |
| Editor — token not found in DB | `warning` | token†, ip |
| PDF served to browser | `info` | token†, filename, size |
| PDF serve — no session token | `warning` | ip |
| PDF serve — token not found in DB | `warning` | token†, ip |
| Complete page loaded | `info` | token†, filename, status, user_id |
| Complete — no session token | `warning` | ip |
| Complete — token not found in DB | `warning` | token†, ip |

† Token is **partially masked** — logged as `…last8chars` to allow session tracing without exposing the full secret.

**Example log line:**
```
[2026-06-22 14:23:01] cubsign.INFO: Editor loaded {"token":"…a3f9c2b1","filename":"NDA.pdf","size":245760,"status":"uploaded","user_id":null}
```

---

## Naming Conventions

| Banned | Use instead |
|---|---|
| Dashboard | Workspace |
| Admin Panel | Workspace |
| Admin | Overview |

These terms are prohibited in route names, controller names, Vue filenames, and all UI copy.

---

## Public Website (FROZEN)

The marketing website is complete and **must not be modified** without explicit instruction.

| Route | Page |
|---|---|
| `/` | Home (9 sections: Hero, Trust Bar, Demo, Features, How It Works, Testimonials, Pricing, FAQ, CTA) |
| `/features` | Features detail page |
| `/pricing` | Pricing tiers |
| `/faq` | FAQ accordion |

All visitors see the marketing homepage. Authenticated users are **never auto-redirected** away from it.

---

## Out of Scope for V1

These features will **not** be built:

- Teams / multi-user workspaces
- Send for signature (requesting others to sign)
- Public API or webhooks
- Mobile app
- AWS S3 / cloud storage
- OCR or AI document understanding
- Bulk signing
- Email notifications
- Stripe / payments

---

## V1 Progress

See [CHANGELOG.md](CHANGELOG.md) for the detailed build history.

### Completed

- [x] Public marketing website (Home, Features, Pricing, FAQ) — frozen
- [x] Laravel Breeze authentication (login, register, profile, email verification)
- [x] Workspace Overview page (authenticated + verified)
- [x] PDF upload with validation (25 MB max, PDF only, session token)
- [x] PDF viewer — pdfjs-dist, multi-page, page thumbnails, zoom in/out
- [x] Signature creation — Draw (canvas), Type (3 fonts + live preview), Upload
- [x] Signature placement — Manual click, Detect Fields, Auto Place
- [x] Field detection — text fragmentation fix, keyword confidence scoring
- [x] Signature interaction — drag, resize (8 handles), delete
- [x] Browser-side PDF embedding — pdf-lib, white-background PNG fix, coordinate conversion
- [x] Sign Complete page — download guest PDF, create account CTA
- [x] Dedicated `cubsign` log channel — full flow tracing across all 4 controllers + service
- [x] Vite/Rolldown EVAL warning suppressed for pdfjs-dist

### Pending

- [ ] Status progression: `editing` → `signed` → `downloaded` updated in DB as user progresses
- [ ] Server-side signed PDF storage (currently browser memory only)
- [ ] Workspace document history list (authenticated users)
- [ ] Saved / reusable signatures per account
