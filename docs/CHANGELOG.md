# Changelog

All notable changes to CubSign are documented here.

---

## [Unreleased]

### Next — PDF Editor + Signature
- Planned: PDF.js preview, signature canvas (draw/type), placement, signed PDF download, register gate

---

## [0.6.1] — 2026-06-20

### Architecture Corrections

#### Changed — `HomeController`
- Removed authenticated-user redirect to `/overview`
- All visitors (guests and authenticated) now see the marketing homepage
- Follows "Value first. Account second." philosophy

#### Changed — `routes/web.php`
- `/sign` is now the upload page (`sign.index` + `sign.store`); separate `/sign/upload` route removed
- `/sign/editor` and `/sign/complete` no longer carry `{token}` in the URL
- Token passed through PHP session after upload, looked up by controllers on each request

#### Changed — Backend Controllers
- `UploadController::store()` — stores `sign_token` in PHP session, redirects to `sign.editor`
- `EditorController::__invoke()` — reads token from `$request->session()->get('sign_token')` instead of URL param
- `CompleteController::__invoke()` — same session-based token lookup; both guard-redirect to `sign.index` on missing/invalid token

#### Changed — Frontend
- `Sign/Upload.vue` — POST route updated from `sign.upload.store` to `sign.store`
- `Sign/Editor.vue` — back link updated from `sign.upload` to `sign.index`
- `Sign/Complete.vue` — "Sign another PDF" link updated from `sign.upload` to `sign.index`

---

## [0.6.0] — 2026-06-20

### Signing Flow — Upload Module

#### Added — Backend

- `sign_sessions` table — stores uploaded PDF metadata: `token` (40-char random, unique), `original_filename`, `disk_path`, `file_size`, `status`, `user_id` (nullable, guests supported), `ip_address`
- `App\Enums\SignSessionStatus` — `Uploaded | Editing | Signed | Downloaded`
- `App\Models\SignSession` — fillable, status cast to enum, `user()` relation
- `App\Repositories\SignSessionRepository` — `create()`, `findByToken()`
- `App\Services\SignSessionService` — `upload()` generates token, stores PDF at `storage/app/sign/{token}.pdf` via `storeAs`, creates session record
- `App\Http\Requests\UploadPdfRequest` — `mimes:pdf`, `max:25600` (25 MB), friendly messages, guests allowed (`authorize: true`)
- `App\Http\Controllers\Web\Sign\IndexController` — invokable, renders `Sign/Index`
- `App\Http\Controllers\Web\Sign\UploadController` — `show()` renders `Sign/Upload`, `store()` delegates to service and redirects to editor
- `App\Http\Controllers\Web\Sign\EditorController` — invokable, looks up session by token, guards against invalid token
- `App\Http\Controllers\Web\Sign\CompleteController` — invokable placeholder

#### Added — Routes (`routes/web.php`)

```
GET  /sign              → sign.index
GET  /sign/upload       → sign.upload
POST /sign/upload       → sign.upload.store
GET  /sign/editor/{token} → sign.editor
GET  /sign/complete/{token} → sign.complete
```

All routes: no auth middleware — guests and authenticated users both allowed.

#### Added — Frontend

- `SignLayout.vue` — minimal layout: top bar (logo + "Secure & Private"), 4-step progress indicator (Upload → Preview → Sign → Download), `step` prop drives active/done/future circle states
- `Sign/Index.vue` — entry page with 4-step explainer cards, CTA to `/sign/upload`
- `Sign/Upload.vue` — drag-and-drop PDF upload:
  - Idle state: drag zone + "Select PDF file" button
  - File-selected state: filename, size, remove button
  - Upload in progress: progress bar (`form.progress.percentage`)
  - Error state: client-side (type/size) + server-side (validation) with red alert
  - Submit: "Sign this PDF →" button, disabled until file selected
- `Sign/Editor.vue` — placeholder: shows upload-success banner with filename, editor skeleton (toolbar + preview area), "PDF editor — coming next" message
- `Sign/Complete.vue` — placeholder for download step

---

## [0.5.0] — 2026-06-19

### Landing Page Final — Marketing Website Frozen

#### Changed — `Home.vue`

**Feature section** — cards updated to reflect actual MVP functionality only:
- Removed: "Send for Signature", "Reusable Templates", "Audit Trail" (future features)
- Added: "Draw or Type Signatures" (create and reuse signatures)
- Kept: "Self Sign PDFs", "Secure Documents", "Works Everywhere"
- Self Sign PDFs description updated to spec copy
- Feature section subheading updated: "Upload, sign, and download PDFs from any device — fast, simple, and secure."

**Hero section** — trust line replaced with 3 explicit trust badges:
- ✓ No account required
- ✓ Free forever
- ✓ No credit card required

**Pricing section** — corrected to show only honest, accurate information:
- Free: `$0 / forever`, features: Self sign PDFs, Download signed documents, Email support
- Pro: "Coming Soon" badge (data-driven via `plan.badge`), no price shown, description: "Advanced features arriving soon.", no feature list
- Founder: "Limited Lifetime Offer" as price label, description: "Early supporter access.", no feature list
- Removed fake monthly prices from Pro and Founder
- Template updated: badge now reads from `plan.badge` instead of hardcoded "Most Popular"
- Empty feature list handled gracefully with `v-if="plan.features.length"`
- Founder price rendered as text label (`text-base font-semibold`) not a dollar amount

> **Marketing website is now frozen.** Future development focus: core signing flow (Upload → Preview → Sign → Download).

---

## [0.4.0] — 2026-06-19

### Landing Page Polish

#### Changed — `Home.vue`
- Hero: larger headline, more generous vertical padding, subheadline updated
- Features: premium white cards (`border-gray-200 shadow-sm hover:shadow-md`), padding `p-7`
- Pricing: Pro "Coming Soon", Founder "Limited Lifetime Offer"; conditional price rendering
- FAQ: accordion wrapped in bordered card container
- CTA section: updated headline and subheadline copy

#### Added — `Home.vue`
- Social Proof section ("Why choose CubSign?"): 4 trust cards

#### Changed — `PublicLayout.vue`
- Footer: 3 columns (Brand, Product, Account); "Built by Cubiz Infotech" added
- Navbar link colour refined

---

## [0.3.0] — 2026-06-19

### Public Website Foundation

#### Added
- `PublicLayout.vue`, `Home.vue`, `Features.vue`, `Pricing.vue`, `Faq.vue`
- `HomeController`, `FeaturesController`, `PricingController`, `FaqController`
- Routes: `GET /`, `/features`, `/pricing`, `/faq`
- `Welcome.vue` removed

---

## [0.2.0] — 2026-06-19

### Week 1 — Workspace Foundation

- `WorkspaceLayout.vue`, `Overview.vue`, `OverviewController`
- `/dashboard` renamed to `/overview`
- Auth controllers updated to redirect → `overview`

---

## [0.1.0] — 2026-06-18

### Week 1 — Project Setup & Authentication

- Laravel 12 + PHP 8.2 scaffold
- Vue 3 + Inertia.js + TailwindCSS v3
- MySQL, Redis, Laravel Breeze, PHPUnit 11, Ziggy
