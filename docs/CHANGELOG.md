# Changelog

All notable changes to CubSign are documented here.

---

## [Unreleased]

---

## [0.8.0] — 2026-06-20

### Homepage — Full Redesign (v0.8.0)

Complete rewrite of `Home.vue` to match premium SaaS standards (TapSign / Dropbox Sign / DocuSign aesthetic).
All 9 sections rebuilt from scratch with CubSign branding.

#### Changed — `Home.vue`

**Section 1 — Hero (split layout)**
- Left: badge, headline "Sign Documents in Seconds. **Anywhere.**" (Anywhere in blue), subheadline, two CTAs (Sign a PDF for Free → `sign.index`, View Pricing), subtle continue-signing link, 3 trust badges (No account required / Download instantly / Secure & private)
- Right: pure CSS/SVG document illustration — signed PDF card with simulated body, signature field (SVG path), "Document signed · Just now" status row, floating stats card (top-right), floating "Signature verified" badge (bottom-left)
- Background: two large blurred gradient blobs (blue-50 + indigo-50) for depth
- Layout: `lg:grid-cols-2` split on desktop, stacked on mobile

**Section 2 — Trust Bar**
- 4-column compact row on `lg`, 2-column on smaller screens
- Each item: blue icon circle + title + description
- Items: Secure Signing / Audit Trails / Fast Workflows / Works Everywhere
- Background: `bg-gray-50` with `border-y border-gray-100`

**Section 3 — Interactive Demo**
- Headline "See CubSign work in under 30 seconds."
- Large `rounded-3xl` card, 3-column `lg:grid-cols-3` with dividers
- **Step 1 (Create Signature):** Tab switcher (Draw / Type / Upload) — Vue reactive; Draw shows predrawn SVG signature path; Type shows live-updating handwriting preview (`typedSignature` ref); Upload shows drop zone
- **Step 2 (Place on Document):** Mini PDF browser-chrome preview with signature placement widget (blue dashed ring, "Drag to move" label)
- **Step 3 (Done):** Completed document with emerald "SIGNED" badge; "Finish Signing →" CTA → `sign.index`

**Section 4 — Features (6 cards, 3-column grid)**
- Expanded from 4 to 6 feature cards
- Quick Sign (available), Request Signatures, Bulk Sign, Templates, Audit Trails, Team Access (last 5: "Coming Soon" badge)
- Each card: colored icon square, badge (if any), title, description

**Section 5 — How It Works (3 cards)**
- Three individual white cards (no connector lines)
- Each: blue rounded icon square, "Step N" label, title, description
- Step 1: Upload PDF / Step 2: Sign It / Step 3: Download

**Section 6 — Testimonials (3 cards)**
- Three quote cards: quote mark icon, body text, avatar initials circle, name + role
- Personas: Sarah Mitchell (Freelance Designer), James Torres (Real Estate Agent), Priya Kumar (HR Manager)

**Section 7 — Pricing** — unchanged (Free / Pro Coming Soon / Founder)

**Section 8 — FAQ** — updated copy, removed "up to 3 documents per month" inaccuracy; added "Do I need to create an account?" question replacing "Do recipients need a CubSign account?"

**Section 9 — Final CTA**
- Retained premium gradient card from v0.7.2
- Updated headline: "Ready to sign real documents?"
- Updated subheadline: "Upload PDFs, create signatures and download signed documents in seconds."
- Updated primary button: "Sign a PDF for Free" (was "Start Signing Now")
- Replaced trust checkmarks with 3 platform badges: Desktop Web / Mobile Friendly / Secure & Private
- Removed 3-step flow strip from the CTA (moved to dedicated Section 5)

**Removed**
- Social Proof section ("Why choose CubSign?" 4 trust cards) — absorbed into Trust Bar + Testimonials

---

## [0.7.3] — 2026-06-20

### Homepage — Conversion-Focused Final CTA

#### Changed — `Home.vue` (Final CTA section)

**Copy & routing**
- Badge: "Ready in under 60 seconds" → "Sign in under 60 seconds"
- Headline: "Start Signing Documents Today" → "Ready to sign your document?"
- Subheadline: updated to direct conversion copy
- Primary button: "Sign a PDF for Free" → **"Start Signing Now"**, route changed `register` → `sign.index`
- Trust badge: "Free forever" → "Download instantly"

**3-step process — full redesign**
- Removed: compact horizontal strip with tiny icons
- Added: premium frosted-glass step cards (`bg-white/10 ring-1 ring-white/15 backdrop-blur-sm rounded-2xl p-7`)
- Each card: "STEP N" label (uppercase tracking-widest text-blue-300), `h-16 w-16` icon container (`bg-white/15`), `h-8 w-8` icon, `text-[15px]` title, `text-sm` description with real copy
- Arrows between cards: `→` on desktop (`hidden sm:block`), `↓` on mobile (`sm:hidden`) — fully responsive
- Desktop: `sm:flex-row sm:items-start` flex layout, arrows centered via `sm:self-center`
- Mobile: `flex-col` stacked layout with down arrows

---

## [0.7.2] — 2026-06-20

### Homepage — Premium Final CTA Section

#### Changed — `Home.vue` (Final CTA section only)

- Replaced flat `bg-blue-600` section with a large rounded card (`rounded-[32px]`) inside a neutral `bg-gray-50` wrapper
- Card uses `bg-gradient-to-br from-blue-500 to-blue-700` — matches #3B82F6 → #2563EB spec
- Two ambient glow decorations (blurred circles, `blur-3xl`) add depth without visual noise
- `shadow-2xl` for soft card lift on the light background
- Generous interior padding: `py-20 sm:py-24 px-8 sm:px-16 lg:px-24`

**Badge** — `⚡ Ready in under 60 seconds`
- Frosted `bg-white/15 backdrop-blur-sm` pill, yellow lightning icon

**Headline** — `Start Signing Documents Today`
- `text-4xl sm:text-5xl font-bold text-white`

**Subheadline** — `text-lg text-blue-100`, max-width `xl`

**Buttons**
- Primary: `bg-white text-gray-900 rounded-xl shadow-sm` + `hover:-translate-y-px hover:shadow-md` (smooth lift)
- Secondary: `bg-white/10 border border-white/25 backdrop-blur-sm text-white` + `hover:bg-white/20`

**Trust badges** — three inline `text-sm text-blue-100` items with emerald-400 checkmarks

**Flow strip** — separated by `border-t border-white/10`, three icon steps with `bg-white/15 backdrop-blur-sm rounded-2xl` icon squares and right-arrow connectors:
- Upload PDF (DocumentArrowUp icon)
- Add Signature (Pencil icon)  
- Download Instantly (ArrowDownTray icon)

---

## [0.7.1] — 2026-06-20

### UI Polish — Premium Homepage + Dev Tools Refinement

#### Changed — `Home.vue`
- Removed large amber "Continue Signing" banner from hero
- Replaced with a single subtle text link: "Already started signing? Continue →"
- Style: `text-sm text-gray-400`, underline + `hover:text-gray-600` only — zero visual weight on the hero layout

#### Changed — `DevNav.vue`
- Removed always-visible orange panel
- Replaced with a small floating gear icon (`⚙`) fixed at `bottom-4 right-4`
- Clicking gear toggles a compact white panel: white bg, `rounded-xl`, `shadow-lg`, `ring-1 ring-black/5`
- Panel slides in/out with a 150ms fade + translate transition
- "Dev tools" label in `text-[10px]` uppercase gray — unobtrusive
- Panel collapses automatically when a link is clicked
- No orange, no borders, no visual noise — invisible unless you know it's there

#### Changed — `Sign/Editor.vue`
- Removed "Session: {{ session.token }}" debug paragraph — no technical details exposed to users

### Next — PDF Editor + Signature
- Planned: PDF.js preview, signature canvas (draw/type), placement, signed PDF download, register gate

---

## [0.7.0] — 2026-06-20

### Developer Experience

#### Added — `HandleInertiaRequests`
- Shared prop `app.isLocal` (`app()->environment('local')`) — available on every Inertia page via `usePage().props.app.isLocal`

#### Changed — `HomeController`
- Now injects `Request` to read `session()->has('sign_token')`
- Passes `hasSignSession: bool` to `Home` page props

#### Changed — `Home.vue`
- Added `defineProps({ hasSignSession })` (default `false`)
- Added "Continue Signing →" amber banner below hero CTA buttons, visible only when `hasSignSession` is `true`
- Links directly to `route('sign.editor')`; the PHP session carries the token

#### Added — `resources/js/Components/DevNav.vue`
- Fixed bottom-right floating panel (`z-[9999]`)
- Visible only when `usePage().props.app.isLocal` is `true` — **never appears in production**
- Orange "DEV" header badge for instant visual distinction
- Four shortcut links: Upload (`sign.index`), Editor (`sign.editor`), Complete (`sign.complete`), Workspace (`overview`)

#### Changed — Layouts
- `PublicLayout.vue`, `SignLayout.vue`, `WorkspaceLayout.vue` — all import and mount `<DevNav />`

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
