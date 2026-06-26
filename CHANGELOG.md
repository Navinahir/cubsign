# Changelog

All notable changes to CubSign are recorded here in reverse-chronological order.  
Format: `[vX.Y.Z] YYYY-MM-DD — Title`

---

## [v0.11.2] 2026-06-26 — Homepage Optimization (Reduce Length & Improve Conversion)

### Removed
- **7-screen Product Showcase** — redundant with the compact Upload → Sign → Download demo.
- **Duplicate CTA banners** — removed mid-page CTAs after Features and Security; one final CTA before footer only.
- **Section dividers** — decorative dividers between sections removed to reduce vertical height.
- **Homepage FAQ search** — search remains on `/faq`; homepage shows top 5 questions only.
- **Success story cards** — removed from homepage social proof (stats, logos, testimonials retained).

### Merged / Consolidated
- **Product demo** — single 3-column section (Upload → Sign → Download) with `ProductMockup` variants.
- **Security messaging** — one `SecuritySection` with shield + 6 cards; link to `/security` for full details.
- **Features** — 6 key features via `homeFeatureGrid` (full 9+ list remains on `/features`).
- **Pricing comparison** — 3 essential rows via `homePricingComparison` (full table on `/pricing`).

### Spacing & Compactness
- Section padding: `py-14 lg:py-20` (~56px mobile / ~80px desktop), down from ~90px / ~140px.
- Added `marketing-section-tight` for final CTA.
- `MarketingHero` — reduced vertical padding.
- `FeatureGrid` compact mode — max-height ~180px cards.
- `WorkflowTimeline` — smaller icons, tighter descriptions.
- `SecuritySection` compact — smaller shield illustration, p-4 cards.
- `SocialProof` compact — 3 testimonials only, tighter stats/logos.
- `PricingSection` compact — 5 benefits, 3-row comparison.
- Footer — reduced top padding (`py-10`).

### Changed
- `Home.vue` — streamlined to 9 sections (Hero → Demo → Features → Workflow → Security → Social Proof → Pricing → FAQ → CTA).
- Marketing components — `compact` prop on FeatureGrid, SecuritySection, SocialProof, PricingSection.
- `APP_VERSION` → `0.11.2`.

### Performance
- Homepage bundle reduced (Home chunk ~37 kB gzip ~10 kB).
- `npm run build` — pass (1.53s).

### Regression Checklist
- [x] Authentication, Editor, Dashboard, Signing flows — unchanged
- [x] Backend APIs and routes — unchanged (marketing pages only)

---

## [v0.11.1] 2026-06-26 — Marketing Website Final SaaS Polish

### Added
- **Product mockup system** — `ProductBrowserFrame`, `ProductMockup` (7 variants: dashboard, editor, signature, request, review, complete, mobile) with realistic UI chrome — no placeholder rectangles.
- **Enhanced hero** — `MarketingHero` with customer avatars, star ratings, security badges, floating dashboard cards, animated signature draw.
- **Product showcase section** — 7-screen product tour on homepage.
- **Animated workflow timeline** — 6-step process (Upload → Prepare → Sign → Send → Track → Complete) with auto-cycling progress bar.
- **Animated counters** — `AnimatedCounter` for social proof and About page stats.
- **Multiple CTA banners** — after Features, Security, and before footer with distinct messaging.
- **Dedicated Security page** — `/security` with encryption, audit trail, GDPR, infrastructure, SOC 2 readiness.
- **Blog polish** — `BlogCover` illustrations, featured/popular ribbons, category colors, hover lift, sticky TOC sidebar.
- **About page expansion** — Our Story, 6 company values, 5-step timeline, 6 team cards, 5 company stats.
- **Contact page expansion** — Sales/Support/Tech/Partnerships cards, office address, map placeholder, response time.
- **Legal page layout** — `LegalPageLayout` with hero, sticky TOC, section icons (Privacy redesigned).
- **Footer redesign** — dark theme, newsletter signup, Developers column, version display, sitemap link.
- **SEO** — Organization + WebSite + Article JSON-LD, Twitter site tag, `sitemap.xml`, updated `robots.txt`.

### Changed
- Homepage spacing tightened (`marketing-section` utilities), decorative SVG patterns, section dividers, gradient backgrounds.
- `SocialProof` — animated counters, star ratings, success story cards.
- `MarketingSeo` — structured data for Organization, WebSite, Article.
- `PublicLayout` — Security nav link, expanded 7-column footer.

### Performance
- Vite code-splitting maintained; inline SVG mockups (zero image CLS).
- `npm run build` — pass (1.59s).

### Regression Checklist
- [x] Authentication, Editor, Dashboard, Signing flows — unchanged
- [x] Backend APIs — unchanged (one new public route: `/security`)

### Files Created
- `resources/js/Components/Marketing/ProductBrowserFrame.vue`
- `resources/js/Components/Marketing/ProductMockup.vue`
- `resources/js/Components/Marketing/MarketingHero.vue`
- `resources/js/Components/Marketing/ProductShowcase.vue`
- `resources/js/Components/Marketing/AnimatedCounter.vue`
- `resources/js/Components/Marketing/CtaBanner.vue`
- `resources/js/Components/Marketing/SectionDivider.vue`
- `resources/js/Components/Marketing/DecorativeBg.vue`
- `resources/js/Components/Marketing/BlogCover.vue`
- `resources/js/Components/Marketing/LegalPageLayout.vue`
- `resources/js/Pages/Security.vue`
- `app/Http/Controllers/Web/SecurityController.php`
- `public/sitemap.xml`

---

## [v0.11.0] 2026-06-26 — Marketing Website & SaaS Landing Page Redesign

### Added
- **Homepage redesign** — modern SaaS landing with hero browser mockup, floating UI cards, 9-feature grid with mini illustrations, 5-step workflow timeline, enterprise security section with shield illustration, social proof (stats + logos + testimonials), pricing with comparison table, searchable FAQ accordion, scroll-reveal animations.
- **New public pages** — About Us, Contact Us, Privacy Policy, Terms of Service, Cookie Policy, Blog homepage, Blog article detail.
- **Professional SaaS footer** — Product, Company, Legal, Resources sections + social links (LinkedIn, Twitter, GitHub).
- **Marketing component library** — `ScrollReveal`, `SectionHeader`, `WorkflowTimeline`, `FeatureGrid`, `SecuritySection`, `SocialProof`, `PricingSection`, `FaqAccordion`, `LegalToc`.
- **Blog system (frontend-only)** — featured article, categories, search, popular/recent posts, newsletter signup, article TOC, share buttons, prev/next navigation.
- **FAQ search** — searchable accordion on homepage and dedicated FAQ page.
- **CSS animations** — smooth scroll, float animation, button ripple, gradient hero; all respect `prefers-reduced-motion`.

### Changed
- `PublicLayout.vue` — expanded footer, Blog nav link, professional 6-column layout.
- `Home.vue` — complete redesign using shared marketing components.
- `resources/js/constants/marketing.js` — extended with feature grid, security cards, social stats, footer links.
- `resources/css/app.css` — marketing animation utilities.

### Performance
- Lazy-loaded via Vite code-splitting per page.
- SVG illustrations (no external image dependencies).
- `npm run build` — pass (1.79s).

### Accessibility
- Semantic HTML sections and headings.
- ARIA labels on nav, FAQ accordions, forms, social links.
- Keyboard-focusable interactive elements.
- `sr-only` labels on search inputs.
- Color contrast maintained on all text/background pairs.

### Files Modified
- `resources/js/Pages/Home.vue`
- `resources/js/Pages/Faq.vue`
- `resources/js/Layouts/PublicLayout.vue`
- `resources/js/constants/marketing.js`
- `resources/css/app.css`
- `routes/web.php`
- `README.md`, `CHANGELOG.md`, `DEVELOPMENT_TRACKER.md`

### Files Created
- `resources/js/Pages/About.vue`
- `resources/js/Pages/Contact.vue`
- `resources/js/Pages/Privacy.vue`
- `resources/js/Pages/Terms.vue`
- `resources/js/Pages/CookiePolicy.vue`
- `resources/js/Pages/Blog.vue`
- `resources/js/Pages/BlogPost.vue`
- `resources/js/constants/blog.js`
- `resources/js/composables/useScrollReveal.js`
- `resources/js/Components/Marketing/ScrollReveal.vue`
- `resources/js/Components/Marketing/SectionHeader.vue`
- `resources/js/Components/Marketing/WorkflowTimeline.vue`
- `resources/js/Components/Marketing/FeatureGrid.vue`
- `resources/js/Components/Marketing/SecuritySection.vue`
- `resources/js/Components/Marketing/SocialProof.vue`
- `resources/js/Components/Marketing/PricingSection.vue`
- `resources/js/Components/Marketing/FaqAccordion.vue`
- `resources/js/Components/Marketing/LegalToc.vue`
- `app/Http/Controllers/Web/AboutController.php`
- `app/Http/Controllers/Web/ContactController.php`
- `app/Http/Controllers/Web/PrivacyController.php`
- `app/Http/Controllers/Web/TermsController.php`
- `app/Http/Controllers/Web/CookiePolicyController.php`
- `app/Http/Controllers/Web/BlogController.php`

### Regression Checklist
- [x] Signing Editor — unchanged
- [x] Dashboard — unchanged
- [x] Upload / Review / Complete flows — unchanged
- [x] Authentication — unchanged
- [x] Email Verification — unchanged
- [x] APIs — unchanged
- [x] Request Signatures — unchanged
- [x] Auto Detection — unchanged

### QA Performed
- `npm run build` — pass

---

## [v0.10.4] 2026-06-25 — Workspace UX, Delete Redirects & Auto-Placement

### Added
- **Full-screen workspace loading overlay** — CubSign-branded centered loader with dual-ring spinner, “Loading document…” / “Preparing your signing workspace…” copy, smooth fade-out after PDF init; workspace stays mounted underneath with interaction blocked until ready.
- **Graceful document-delete redirects** — deleting a document always redirects to My Documents with a success toast; accessing a deleted or missing document redirects instead of Laravel’s default 404.
- **Auto placement mode after Save Signature / Save Initials** — `captureSignature()` now enters manual placement immediately (highlighted Place Manually button + floating helper banner). Does not auto-switch after Change Signature, Cancel, or failed upload.
- **Initials placement panel** — Place Manually button for initials (parity with signature flow).
- `tests/Feature/DocumentDeleteRedirectTest.php` — regression tests for delete redirect and missing-document handling.

### Fixed
- **404 after deleting documents** — `destroy()` returned `back()`, which could reload the deleted document’s show URL and hit soft-deleted route model binding (404). Now redirects to `documents.index` with flash status `document-deleted`.
- **Missing document routes** — custom `document` route binding in `AppServiceProvider` redirects to My Documents with `document-unavailable` instead of throwing `ModelNotFoundException`.

### Changed
- `SignWorkspaceLoader.vue` — redesigned as fixed full-screen overlay (Teleport from Editor).
- `EditorPlacementHelper.vue` — accepts dynamic `message` prop for signature vs initials.
- `Documents.vue` — shows flash toasts for delete success and unavailable documents.

### Files Modified
- `resources/js/Components/Sign/SignWorkspaceLoader.vue`
- `resources/js/Components/Editor/EditorPlacementHelper.vue`
- `resources/js/Pages/Sign/Editor.vue`
- `resources/js/Pages/Workspace/Documents.vue`
- `resources/js/Pages/Workspace/DocumentShow.vue`
- `app/Http/Controllers/Web/Workspace/DocumentsController.php`
- `app/Providers/AppServiceProvider.php`
- `tests/Feature/DocumentDeleteRedirectTest.php`
- `CHANGELOG.md`, `README.md`, `DEVELOPMENT_TRACKER.md`

### QA Performed
- `npm run build` — pass
- `php artisan test --filter=DocumentDeleteRedirectTest` — pass

---

## [v0.10.3] 2026-06-25 — User-Initiated Signature Detection Only

### Changed
- **Signature detection is now completely user-initiated and never runs automatically on PDF load.** Removed automatic `detectFields()` triggers from `initializeWorkspace()`, `captureSignature()`, and `useExistingAsset()`. Detection runs only when the user clicks **Detect Signature Fields** or **Auto Place** (which calls detection if results are not already present).
- Removed unused `runAutoDetection()` helper.

### Files Modified
- `resources/js/Pages/Sign/Editor.vue`
- `CHANGELOG.md`, `README.md`, `DEVELOPMENT_TRACKER.md`

---

## [v0.10.2] 2026-06-25 — Auto-Detection Regression Fix

### Fixed
- **Signature field auto-detection was dead code** — commit `72616ee` (Editor component extraction) removed the placement-mode UI (`Place Manually`, `Detect Signature Fields`, `Auto Place`) while leaving `detectFields()` / `autoPlace()` in `Editor.vue` with no callers. Detection never ran after upload.
- Restored placement-mode buttons, detected-field sidebar list, and amber PDF overlays.
- `detectFields()` no longer requires a saved signature to scan (scan runs after PDF render); placing still requires a saved signature via `placeAtField()`.
- `initializeWorkspace()` calls `runAutoDetection()` once after pages render.
- `captureSignature()` triggers `detectFields()` after saving a signature asset.

### Files Modified
- `resources/js/Pages/Sign/Editor.vue`

### QA Performed
- `npm run build` — pass
- `php artisan test` — 47 passed
- Code-path trace: upload → PDF render → `detectFields()` → `detectedFields` → overlay/list UI

---

## [v0.10.1] 2026-06-25 — Guest Signing Regression Fix

### Fixed
- **Guest signing blocked by email verification middleware** — `verified` was applied to the entire `/sign` route group. Laravel's default `EnsureEmailIsVerified` treats unauthenticated requests as unverified and redirects guests to `/verify-email`, which requires `auth` and then sends them to `/login`. Removed `verified` from signing routes; verification remains enforced only on workspace routes (`/overview`, `/documents`, `/templates`, `/profile`).
- **Expired verification links returned 403** — `bootstrap/app.php` now redirects invalid/expired signed URLs on `verification.verify` to `/verify-email/expired` (as documented in `docs/architecture.md`).
- **PHPUnit SQLite compatibility** — `2026_06_22_000004` migration now uses `Schema::hasColumn()` instead of MySQL-only `information_schema` queries.

### Added
- `tests/Feature/GuestSigningAccessTest.php` — regression tests for guest and unverified-user access to `/sign`

---

## [v0.10.0] 2026-06-25 — Mandatory Email Verification

### Added
- Mandatory email verification for email/password registration
- `users.status` column (`pending_verification` | `active`) with `UserStatus` enum
- CubSign-branded verification email (`VerifyEmailNotification`, `emails/verify-email.blade.php`)
- Verify Email screen with resend cooldown (60s), hourly limit (5), change email, and log out
- Expired verification link page (`/verify-email/expired`)
- Guest-accessible signed verification URLs with auto-login on success
- Custom `EnsureEmailIsVerified` middleware returning `403 Email Verification Required` for JSON/API requests
- `DEVELOPMENT_TRACKER.md` and `docs/architecture.md`
- Cursor rule for feature-completion documentation policy

### Changed
- Registration redirects to `/verify-email` instead of workspace
- Login redirects unverified users to `/verify-email`
- `User` model implements `MustVerifyEmail`
- Profile and signing routes require verified email for authenticated users
- Profile email change resets verification and sends new email
- Overview shows success toast after email verification

### Fixed
- Verification emails were never sent (MustVerifyEmail was commented out)

---

## [v0.9.0] 2026-06-22 — Logging & Documentation

### Added
- Dedicated `cubsign` log channel (`config/logging.php`) writing to `storage/logs/cubsign.log`
  - Daily rotation, 30-day retention, separate from `laravel.log`
- Structured `info` / `debug` / `warning` log entries across the full signing flow:
  - `UploadController` — upload received + session created
  - `SignSessionService` — file stored + DB record persisted
  - `EditorController` — editor loaded, missing token, token not in DB
  - `PdfController` — PDF served, missing token, token not in DB
  - `CompleteController` — complete page loaded, missing token, token not in DB
- Tokens are partially masked in logs (`…last8chars`) for traceability without exposing secrets
- Rewrote `README.md` to reflect actual current state (tech stack, architecture, DB schema, routes, signing flow, logging, naming conventions, out-of-scope, progress)
- Created `CHANGELOG.md` (this file)

---

## [v0.8.5] 2026-06-22 — Sign Complete Page Redesign (No-Scroll Layout)

### Changed
- Redesigned `Sign/Complete.vue` to fit entirely within the viewport without scrolling
  - Root container changed from `justify-center` to `justify-start` + `overflow-y-auto` — prevents top-clipping when content exceeds viewport height
  - Success hero: icon reduced to `h-14 w-14`, tighter margins
  - Cards: padding reduced to `p-6`, gap reduced to `gap-4`
  - Benefits list: switched from single-column `space-y-3` to **2-column grid** — halves the vertical height of the benefits section
  - All button padding reduced from `py-3` to `py-2.5`
  - Footer links: `mt-10` → `mt-6`

---

## [v0.8.4] 2026-06-22 — Sign Complete Page Premium Redesign

### Changed
- Full redesign of `Sign/Complete.vue` to match premium SaaS onboarding (Stripe / Dropbox Sign style):
  - Wider container (`max-w-[54rem]`), `items-stretch` for equal-height cards
  - Success hero: larger icon with glow halo, expanded heading and subtext
  - **Guest card:** renamed to "Download Now", dark `bg-slate-900` download button with hover micro-animation, stronger `border-gray-300`
  - **Account card:** 2-column benefits grid option explored, larger Google button (`h-5 w-5`), stronger blue CTA, Recommended badge with shadow
  - `transition-all duration-150` on all interactive elements
  - Footer links wrapped in centered flex column with consistent spacing

---

## [v0.8.3] 2026-06-22 — Production Cleanup (Remove All Debug Code)

### Removed
- All `console.log` / `console.warn` / `console.error` tracing statements from `generateSignedPdf()` and `finishSigning()` in `Editor.vue`
- `page.drawRectangle()` diagnostic red box
- `page.drawText('TEST SIGN', ...)` diagnostic label
- Automatic `debug-signed.pdf` download that fired on every signing attempt
- `rgb` and `StandardFonts` imports from pdf-lib dynamic import (no longer needed)
- All `console.log` / `console.error` statements from `downloadSignedPdf()` in `Complete.vue`

### Kept (production logic)
- `embedPng()` + `drawImage()` + `pdflibDoc.save()`
- White-background PNG flattening for drawn and typed signatures
- `window.__cubsignSignedPdf` storage and Complete.vue download flow
- Legitimate `console.error` error handlers in `loadPdf`, `renderPage`, `renderThumb`, embed try/catch

---

## [v0.8.2] 2026-06-22 — Fix: Invisible Signature in Downloaded PDF

### Fixed
- Signature was invisible in the downloaded PDF because `canvas.toDataURL()` produces a transparent-background PNG — some PDF viewers render the alpha channel as invisible
- **Drawn / uploaded signatures:** image data-URL re-drawn onto a white-filled `<canvas>` (`fillStyle = '#ffffff'` + `fillRect`) before `toDataURL()` and `embedPng()`
- **Typed signatures:** white `fillRect` added before drawing text on the temp canvas
- Both fixes ensure the embedded PNG always has an opaque white background, regardless of PDF viewer

### Added (debug only, removed in v0.8.3)
- Diagnostic `page.drawRectangle()` (red 0.25 opacity) and `page.drawText('TEST SIGN')` to isolate coordinate vs. image rendering issues
- Automatic `debug-signed.pdf` download to verify bytes before Inertia navigation

---

## [v0.8.1] 2026-06-22 — Sign Complete: Download Signed PDF

### Added
- `Sign/Complete.vue` redesigned with two-card layout (premium SaaS onboarding style):
  - **Card 1 — Continue as Guest:** Download Signed PDF button (reads `window.__cubsignSignedPdf`)
  - **Card 2 — Create Free Account (Recommended):** Google SSO + email register CTA, 6-benefit list
  - Amber warning state when signed PDF is no longer in browser memory (page refresh)
  - Footer: "Already have an account? Log in" + "Sign another document"
- `pdf-lib@1.17.1` added to `package.json` dependencies (browser-side PDF embedding)
- `generateSignedPdf()` function in `Editor.vue`:
  - Fetches original PDF bytes via `/sign/pdf` with `credentials: 'same-origin'`
  - Iterates `placedSigs`, converts canvas coordinates → PDF points
  - `embedPng()` + `drawImage()` per signature
  - `pdflibDoc.save()` → `Uint8Array` stored in `window.__cubsignSignedPdf`
- `finishSigning()` triggers PDF generation then navigates to `/sign/complete` via `router.visit()`

### Fixed
- Signed PDF bytes survive Inertia client-side navigation via `window.__cubsignSignedPdf` (persists across SPA navigation)

---

## [v0.8.0] 2026-06-21 — Signing Engine: Placement Modes, Drag/Resize, Delete

### Added
- **Place Manually mode:** click anywhere on the PDF canvas to drop the signature; blue crosshair cursor + banner; `e.currentTarget.getBoundingClientRect()` for accurate click coordinates
- **Detect Signature Fields mode:**
  - Scans PDF text layer via `pdfjs-dist` `getTextContent()`
  - Groups fragmented text runs (pdfjs delivers "Signature:" as `["S","ign","ature:"]`) by grouping items within 10px Y into visual lines before searching
  - Keyword list: signature, signed by, authorized signature, sign here, signatory, undersigned, etc.
  - **Confidence scoring:** colon after keyword +60, line ≤15 chars +40, ≤30 chars +20, digit-prefixed line (section heading) −80, line >60 chars −50, ALL-CAPS −30
  - **Context gate:** keyword only accepted if it starts the line OR line ≤40 chars (prevents false positives in paragraph text)
  - Detected fields shown as amber dashed overlays on the PDF; click any to place at that location
- **Auto Place mode:** runs Detect silently, places at highest-confidence field; no fallback placement if no fields found
- **Mode switching:** switching modes clears the previous mode's visual state (no stale overlays)
- Signature drag (mousedown + global mousemove/mouseup)
- Signature resize with 8 directional handles (NW, N, NE, E, SE, S, SW, W)
- Signature delete button: `@mousedown.stop` prevents `startDrag`'s `preventDefault` from blocking the subsequent click event

### Fixed
- Delete button was unresponsive: `startDrag` called `e.preventDefault()` on the parent's `mousedown`, which blocked the `click` event from firing on the child button. Fixed with `@mousedown.stop` on the delete button.
- Auto Place was placing at the bottom of the last page (fallback) when no signature fields were found — removed fallback entirely; now does nothing if no fields detected
- Mode state persisted visually when switching between modes — fixed by clearing `detectedFields`, `showFields`, `detectionRan`, and `placementMode` on each mode entry

---

## [v0.7.0] 2026-06-21 — Signature Panel: Type Tab & Upload Tab Fixes

### Fixed
- **Type tab:** font selector buttons were rendering the user's typed text instead of static font labels, causing overflow and distorted UI. Buttons now always show static labels ("Script", "Cursive", "Print"); live preview of typed name appears in a separate preview box below the selector.
- **Type tab overflow:** added `overflow-hidden`, `whitespace-nowrap`, `text-overflow:ellipsis` to the live preview element so long names don't break the layout

---

## [v0.6.0] 2026-06-21 — PDF Viewer: Full Rendering & pdfjs-dist Integration

### Added
- `pdfjs-dist@3.11.174` integrated (plain JS worker, no ESM issues)
- PDF worker loaded via Vite `?url` import: `import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url'`
- `GlobalWorkerOptions.workerSrc = workerUrl`
- `pdfDoc` stored as plain `let` (NOT a Vue `ref`) — Vue's deep Proxy breaks pdfjs internal methods
- `pageCanvases` stored as plain `let` array with `:ref="el => { if (el) pageCanvases[i] = el }"` — avoids Vue Ref unwrap issues
- Fetch-first PDF loading: `fetch(url, { credentials: 'same-origin' }) → ArrayBuffer → getDocument({ data })`
- Multi-page rendering with scroll, page thumbnails in left sidebar, zoom in/out
- `pageDims` array populated per page for coordinate conversion

### Fixed
- "Could not load the document" error: PDF was being passed as a URL directly to `getDocument()`, which failed because the browser blocked cross-origin requests without the session cookie. Fixed by fetching in the main thread with `credentials: 'same-origin'` first, then passing `ArrayBuffer` to `getDocument({ data })`.

### Added (Vite)
- `build.rollupOptions.onwarn` in `vite.config.js` to suppress Rolldown `EVAL` warning from pdfjs-dist's internal `eval("require")` for Node.js worker loading

---

## [v0.5.0] 2026-06-20 — Signing Flow: Upload, Session, Editor & PDF Serve

### Added
- `sign_sessions` database table and migration
- `SignSessionStatus` enum (`uploaded`, `editing`, `signed`, `downloaded`)
- `SignSession` model with fillable, casts, user relationship
- `SignSessionRepository` — `create()`, `findByToken()`
- `SignSessionService::upload()` — generates token, stores file, creates DB record
- `UploadPdfRequest` — validates `mimes:pdf`, max 25 MB, with user-facing messages
- `UploadController` — `show()` renders Upload page, `store()` handles upload
- `EditorController` — resolves session from `sign_token` in PHP session, renders Editor
- `PdfController` — serves original PDF inline (session-gated, `Cache-Control: no-store`)
- `CompleteController` — resolves session, renders Complete page
- Sign route group: `GET/POST /sign`, `GET /sign/editor`, `GET /sign/pdf`, `GET /sign/complete`
- `SignLayout.vue` — 4-step progress header (Upload → Preview → Sign → Download)
- `Sign/Upload.vue` — drag-and-drop file picker with PDF icon, file info preview
- `Sign/Editor.vue` — shell with 3-column layout (thumbnails | PDF viewer | signature panel)

---

## [v0.4.0] 2026-06-19 — Workspace Overview

### Added
- `WorkspaceLayout.vue` — sidebar navigation, user menu, responsive
- `Workspace/Overview.vue` — stats cards, recent activity placeholder
- `OverviewController` — `[auth, verified]` middleware
- Route: `GET /overview`

### Rules established
- Naming: "Dashboard" → **Workspace**, "Admin Panel" → **Workspace**, "Admin" → **Overview**

---

## [v0.3.0] 2026-06-18 — Public Marketing Website

### Added
- `PublicLayout.vue` — nav, footer
- `Home.vue` — 9 sections: Hero, Trust Bar, Interactive Demo, Features (6 cards), How It Works, Testimonials, Pricing, FAQ, Final CTA
- `Features.vue`, `Pricing.vue`, `Faq.vue`
- `HomeController`, `FeaturesController`, `PricingController`, `FaqController`
- Routes: `/`, `/features`, `/pricing`, `/faq`

### Rules established
- Marketing homepage shows to **all** visitors — authenticated users are never auto-redirected
- `Home.vue` and all marketing sections are **frozen** — do not modify without explicit instruction

---

## [v0.2.0] 2026-06-17 — Authentication (Laravel Breeze)

### Added
- Laravel Breeze scaffolding (Vue + Inertia)
- Login, Register, Email Verification, Password Reset, Profile edit/delete
- `GuestLayout.vue`, `AuthenticatedLayout.vue`
- Auth routes (`/login`, `/register`, `/forgot-password`, etc.)

---

## [v0.1.0] 2026-06-16 — Project Foundation

### Added
- Laravel 12 project initialised with PHP 8.2
- MySQL database `cubsign` configured
- Inertia.js v2 + Vue 3 + Vite 8 wired up
- Tailwind CSS v3
- Base `Controller.php`
- `app.isLocal` shared prop (available on every Inertia page via `usePage().props.app.isLocal`)
- `DevNav` component — gear icon toggle, visible in local dev only
- Git repository initialised
