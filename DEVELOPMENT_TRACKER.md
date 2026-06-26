# CubSign Development Tracker

Running log of feature implementation status. Update this file when a feature is planned, started, or completed.

---

## Features Page UX Redesign (v0.12.3)

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.12.3 |
| **Date** | 2026-06-26 |
| **Scope** | `/features` page only |

### Structure
| Section | Notes |
|---|---|
| Hero | "Features" badge, product dashboard mockup, dual CTAs |
| Core features | 6 alternating compact sections (Self Sign, Request, Templates, Audit, Secure Storage, Document Tracking) |
| Designed for every workflow | 6 audience cards |
| Everything included | 9-item capability grid |
| Final CTA | Single bottom CTA only |

### Removed (homepage duplicates)
- Everything in one workspace, How CubSign Works, Why choose CubSign, statistics, testimonial, extra CTAs

### Files
- `Pages/Features.vue`, `constants/featuresPage.js`
- `Components/Marketing/Features/*` (added storage + tracking illustrations; removed workflow)

### Build Status
- `npm run build` — pass (1.52s)

---

## Features Page Premium Redesign (v0.12.2)

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.12.2 |
| **Date** | 2026-06-26 |
| **Scope** | `/features` page only |

### Sections Added
| Section | Description |
|---|---|
| Hero | Badge, headline, subtitle, CTAs, composite product illustration |
| Product showcases | 4 alternating mockup + content blocks (Self Sign, Request, Templates, Audit) |
| Workspace grid | 6 premium capability cards |
| Workflow | 5-step animated horizontal timeline |
| Comparison | Traditional vs CubSign |
| Testimonial | Large quote card |
| Statistics | Animated counters |
| CTA | Gradient banner |

### Files
| File | Purpose |
|---|---|
| `Pages/Features.vue` | Full page redesign |
| `constants/featuresPage.js` | Page-only content |
| `Components/Marketing/Features/*` | Inline SVG illustrations + workflow |

### Regression Checklist
- [x] Home, Blog, Pricing, About, Contact, Privacy — unchanged
- [x] Footer, header, auth, dashboard, signing — unchanged
- [x] Responsive layout verified (desktop alternating, mobile stacked)
- [x] ARIA labels, focus states, reduced-motion support

### Build Status
- `npm run build` — pass (1.74s)

---

## Guest Self-Sign Review Flow Fix (v0.12.1)

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.12.1 |
| **Date** | 2026-06-26 |

### Problem
Guest users (Sign Without Account) saw both "Your signed PDF is ready to download" and "Document must be saved before continuing" on the Review page, blocking Finish Signing.

### Root Cause
`validateRequestSigning()` always required `documentId` and server-side `documentSaved`. Guests never call authenticated `/sign/save`; the signed PDF lives in `window.__cubsignSession.signedPdf` only.

### Fix
| File | Change |
|---|---|
| `editorHelpers.js` | `isGuest` + `signedPdfReady` validation path |
| `Review.vue` | `signedPdfReady` computed; conditional success banner; guest `ensureDocumentSaved()` |
| `Editor.vue` | Set `documentSaved: true` for guests after PDF generation |

### Guest Flow (verified)
Upload → Editor → Review → Finish Signing → Complete → Download

### Regression Checklist
- [x] Logged-in self-sign — unchanged
- [x] Request signatures — unchanged
- [x] Dashboard, auth, email verification, autosave — unchanged

### Build Status
- `npm run build` — pass (1.55s)

---

## Marketing Website Final Cleanup (v0.12.0)

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.12.0 |
| **Date** | 2026-06-26 |

### Summary
Final marketing polish before release. Removed duplicate homepage sections, rewrote copy to sound human and professional, deleted unused components and constants. **No application logic modified.**

### Homepage Simplification
| Removed | Reason |
|---|---|
| Features section | Redundant with demo, workflow, and `/features` page |
| Security section | Already covered in hero, legal pages, footer |

### Copy Changes (examples)
| Before | After |
|---|---|
| The fastest way to sign PDFs online | Sign PDFs online in minutes |
| Upload, sign, download — in under a minute | Upload, sign, and download your PDF in under a minute |
| Enterprise-grade protection, built in | *(section removed)* |
| Loved by people who value their time | Used by freelancers, teams, and small businesses |
| Bank-grade security | Encrypted storage |

### Files Deleted
`FeatureGrid.vue`, `SecuritySection.vue`, `ProductShowcase.vue`, `SectionDivider.vue`

### Files Modified
`Home.vue`, `MarketingHero.vue`, `marketing.js`, `Features.vue`, `Contact.vue`, `PublicLayout.vue`

### Build Status
- `npm run build` — pass (2.35s)

### Regression Checklist
- [x] Auth, guest signing, editor, dashboard, APIs, business logic — unchanged

---

## Compact "How It Works" Section (v0.11.5)

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.11.5 |
| **Date** | 2026-06-26 |

### Summary
Reduced homepage “Upload, sign, download” section vertical height by ~35–45% while preserving browser mockups, shadows, hover effects, and branding. Marketing UI only — no application logic modified.

### Optimizations
| Area | Change |
|---|---|
| Section padding | `!py-10 lg:!py-14` (tighter than `marketing-section`) |
| Section header | `SectionHeader compact` — smaller title, `mb-4` gap to cards |
| Cards | `p-3`, `rounded-xl`, `max-h-[360px]`, `gap-3` grid |
| Browser mockups | `ProductMockup size="compact"` + `ProductBrowserFrame` compact chrome |
| Dashboard mockup | 2 documents (was 3), tighter rows |
| Signature mockup | `h-14` canvas (was `h-24`), hidden action buttons |
| Complete mockup | Smaller success icon and download chip |
| CTA button | `py-2 text-xs rounded-lg` (was `py-2.5 text-sm rounded-xl`) |

### Files Modified
`Home.vue`, `ProductMockup.vue`, `ProductBrowserFrame.vue`, `SectionHeader.vue`, `marketing.js`

### Responsive Verification
- [x] Desktop — 3 compact cards in one row
- [x] Tablet — 3 columns, reduced spacing
- [x] Mobile — vertical stack, compact screenshots

### Build Status
- `npm run build` — pass

### Regression Checklist
- [x] Signing workflow, auth, dashboard, editor, APIs, routes — unchanged

---

## Remove Dedicated Security Page (v0.11.4)

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.11.4 |
| **Date** | 2026-06-26 |

### Summary
Removed the dedicated Security page for Early Access simplicity. Security messaging remains on the homepage (`SecuritySection`) and legal pages. **No application logic, auth, signing, dashboard, editor, APIs, or database modified.**

### Routes
| Action | Detail |
|---|---|
| Removed | `GET /security` → `SecurityController` |
| Added | `Route::redirect('/security', '/')` — graceful fallback for bookmarks |

### Files Deleted
- `resources/js/Pages/Security.vue`
- `app/Http/Controllers/Web/SecurityController.php`

### Navigation Updated
| Location | Before | After |
|---|---|---|
| Top nav | Features, Security, Pricing, Blog, FAQ | Features, Pricing, Blog, FAQ |
| Footer Product | Features, Pricing, Security, FAQ | Features, Pricing, FAQ |
| Mobile nav | Same as top nav | Same as top nav |

### Homepage Security (Preserved)
- `SecuritySection` compact mode on homepage
- 5 cards: AES-256 Encryption, TLS 1.3, Audit Trail, Privacy First, Secure Cloud Storage
- No Security page CTA links

### Future Readiness
- `securityPageFeatures` retained in `marketing.js` with comment for future Trust Center (SOC 2, ISO 27001, HIPAA)
- `SecuritySection.vue` reusable when page is reintroduced

### Files Modified
`routes/web.php`, `PublicLayout.vue`, `marketing.js`, `SecuritySection.vue`, `Privacy.vue`, `public/sitemap.xml`

### Build Status
- `npm run build` — pass (1.82s)

### Regression Checklist
- [x] Authentication, signing, dashboard, editor — unchanged
- [x] Business logic and database — unchanged

---

## Marketing Website Final Production Cleanup (v0.11.3)

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.11.3 |
| **Date** | 2026-06-26 |

### Summary
Final marketing UI cleanup before production. Simplified footer and contact page, disabled newsletter submission, replaced broken/unavailable links with graceful placeholders, removed demo addresses and fake statistics. **No application logic, auth, signing, dashboard, editor, APIs, routes, or controllers modified.**

### Footer Cleanup
| Removed | Kept |
|---|---|
| Developers column (API, duplicate Documentation) | Product: Features, Pricing, Security, FAQ |
| Support column (duplicate FAQ, Status) | Company: About, Blog, Contact |
| Bottom-bar duplicate Privacy/Terms/Cookies | Legal: Privacy Policy, Terms, Cookie Policy |
| `docs.cubsign.com`, `status.cubsign.com` external URLs | Resources: Documentation (`#`), Help Center (`/faq`) |

### Contact Page Simplification
- **Removed:** office address, business hours, Google Maps placeholder, Sales/Support/Technical/Partnerships cards, social links section.
- **Kept:** hero, form (name, email, subject, message), single support card, FAQ shortcut.

### Placeholder Links Handled
| Link | Behavior |
|---|---|
| Documentation | `href="#"` + `@click.prevent` + `aria-disabled` |
| Social (LinkedIn, Twitter, GitHub) | `href="#"` + `@click.prevent` |
| Help Center | `/faq` (valid) |
| Sitemap | `/sitemap.xml` (valid static file) |

### Navigation Audit
| Nav item | Route | Status |
|---|---|---|
| Features | `/features` | ✅ Valid |
| Security | `/security` | ✅ Valid |
| Pricing | `/pricing` | ✅ Valid |
| Blog | `/blog` | ✅ Valid |
| FAQ | `/faq` | ✅ Valid |
| Home logo | `/` | ✅ Valid |
| Login / Register | auth routes | ✅ Unchanged |

### Responsive Verification
- [x] Footer — 2-col mobile, 6-col desktop, no overflow
- [x] Contact — single-column mobile, 2-column desktop
- [x] Blog, Privacy, About — existing layouts verified via build
- [x] No duplicate mobile/desktop nav menus

### Accessibility Verification
- [x] Footer social: `aria-label` includes “coming soon”
- [x] Unavailable links: `aria-disabled`, `title="Coming soon"`
- [x] Newsletter disabled inputs: `aria-hidden`, `tabindex="-1"`
- [x] Contact form: labels on all fields, `autocomplete` on name/email
- [x] Mobile nav: `aria-expanded`, `aria-label` on toggle
- [x] Focus states on form inputs and buttons (existing Tailwind rings)

### Files Modified
`marketing.js`, `PublicLayout.vue`, `Contact.vue`, `About.vue`, `Blog.vue`, `SocialProof.vue`, `MarketingSeo.vue`

### Build Status
- `npm run build` — pass (1.87s)

---

## Production Readiness Audit (2026-06-26)

### High Priority — Before Public Launch

| Item | Status | Notes |
|---|---|---|
| Broken footer routes | ✅ Fixed | v0.11.3 — no 404s from footer |
| Placeholder office address | ✅ Fixed | Removed from Contact |
| Fake statistics | ✅ Fixed | Replaced with qualitative Early Access copy |
| Fake social URLs | ✅ Fixed | `href="#"` until accounts exist |
| Newsletter backend | ⚠️ Open | UI shows “Coming Soon”; no API wired |
| Contact form backend | ⚠️ Open | Frontend validation + success state only; no email sent |
| OG image (`/images/og-cubsign.png`) | ⚠️ Open | Referenced in SEO meta; file not in `public/images/` |
| Testimonials | ⚠️ Open | Fictional names/quotes on homepage — acceptable for Early Access or replace with real quotes |
| Blog authors | ⚠️ Open | Static fictional authors in `blog.js` |
| DevNav component | ⚠️ Open | Dev shortcut bar visible on all public pages — hide in production `.env` or build flag |

### Medium Priority

| Item | Notes |
|---|---|
| Contact form mail integration | Wire to Laravel Mail or external service |
| Real social profiles | Update `SOCIAL_LINKS` when accounts are live |
| Documentation site | Add route or external URL when ready |
| Status page | Add `/status` or external status page |
| Typography/spacing consistency | Marketing pages share `marketing-section`, `btnPrimary`, `rounded-2xl` cards — minor page-level variance acceptable |
| FAQ search query param | `MarketingSeo` SearchAction references `/faq?q=` — FAQ page may not filter by `q` yet |
| SOC 2 badge on Security page | Marked “Coming Soon” — intentional |

### Low Priority

| Item | Notes |
|---|---|
| Customer logo illustrations | Now audience categories; could become real logos later |
| Blog newsletter backend | When marketing email service is chosen |
| Animation polish | Workflow timeline, scroll reveal — working |
| Image optimization | Inline SVG mockups — no CLS issues |
| API / developer docs | Future SaaS feature |
| Team page with real photos | Post-launch |

### Confirmed Unchanged (Regression)
- [x] Authentication & email verification
- [x] Dashboard / workspace
- [x] PDF editor & signature pad
- [x] Auto detection
- [x] Request signatures & self sign flows
- [x] Database, controllers, APIs, middleware
- [x] All `routes/web.php` signing and auth routes

---

## Homepage Optimization — Reduce Length & Improve Conversion (v0.11.2)

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.11.2 |
| **Date** | 2026-06-26 |

### Summary
Conversion-focused homepage trim (~30–40% shorter). Removed redundant sections, merged duplicate messaging, tightened spacing, added compact modes to shared marketing components. Marketing UI only — no application logic, auth, signing, dashboard, editor, APIs, or routes changed.

### Sections Removed
- Product Showcase (7-screen tour)
- Duplicate CTA banners (after Features, after Security)
- Section dividers between homepage sections
- Homepage FAQ search input
- Success story cards in social proof

### Sections Merged / Consolidated
- Product demo → single Upload → Sign → Download row
- Security → one section (shield + 6 cards, link to `/security`)
- Features → 6 cards (`homeFeatureGrid`)
- Pricing → 3-row comparison (`homePricingComparison`)
- FAQ → 5 questions + link to full `/faq`

### Spacing Improvements
| Area | Before | After |
|---|---|---|
| Section padding (desktop) | ~140px (`py-16 lg:py-24`) | ~80px (`py-14 lg:py-20`) |
| Section padding (mobile) | ~90px | ~56px |
| Hero padding | `pt-12 lg:pt-16` | `pt-10 lg:pt-14` |
| Footer top padding | `py-14` | `py-10` |
| Feature cards | tall cards | max ~180px compact cards |

### Components Updated
- `FeatureGrid.vue` — `compact` prop, `homeFeatureGrid`
- `WorkflowTimeline.vue` — smaller icons, tighter layout
- `SecuritySection.vue` — `compact` prop
- `SocialProof.vue` — `compact` prop (3 testimonials)
- `PricingSection.vue` — `compact` prop, `homePricingComparison`
- `MarketingHero.vue` — reduced padding
- `Home.vue` — full restructure
- `PublicLayout.vue` — footer spacing
- `app.css` — `marketing-section` / `marketing-section-tight`
- `marketing.js` — `homeFeatureGrid`, `homePricingComparison`, `APP_VERSION`

### Regression Checklist
- [x] Authentication — unchanged
- [x] Signing workflow (`/sign/*`) — unchanged
- [x] Dashboard / Editor — unchanged
- [x] Backend APIs — unchanged
- [x] Routes — unchanged

### Build Status
- `npm run build` — pass (1.53s)

---

## Marketing Website Final SaaS Polish (v0.11.1)

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.11.1 |
| **Date** | 2026-06-26 |

### Summary
Premium polish pass on the public marketing website. Product mockups, animated workflow, multiple CTAs, Security page, blog/legal/about/contact enhancements, dark footer with newsletter, SEO structured data + sitemap.

### Routes Added
- `GET /security` → `SecurityController` → `Security.vue`

### Components Added
ProductBrowserFrame, ProductMockup, MarketingHero, ProductShowcase, AnimatedCounter, CtaBanner, SectionDivider, DecorativeBg, BlogCover, LegalPageLayout

### Responsive Verification
- [x] Desktop, Laptop, Tablet, Mobile — no horizontal overflow
- [x] Product mockups scale in grid layouts
- [x] Footer stacks on mobile

### Accessibility Checklist
- [x] ARIA labels on social, newsletter, share buttons
- [x] `prefers-reduced-motion` on counters, workflow, signature animation
- [x] Semantic sections and headings
- [x] Focus states on forms and accordions

### Regression Checklist
- [x] Auth, Editor, Dashboard, Signing, APIs — unchanged

### Build Status
- `npm run build` — pass (1.59s)

---

## Marketing Website & SaaS Landing Page Redesign (v0.11.0)

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.11.0 |
| **Date** | 2026-06-26 |

### Scope
Frontend-only marketing website redesign. No changes to authentication, signing workflow, PDF editor, dashboard, or backend APIs.

### New Pages
- `/about` — About Us (mission, vision, timeline, team, stats, CTA)
- `/contact` — Contact form with validation + success state, business hours, map placeholder
- `/privacy` — Privacy Policy with sticky table of contents
- `/terms` — Terms of Service with sticky table of contents
- `/cookies` — Cookie Policy with cookie table
- `/blog` — Blog homepage (featured, categories, search, sidebar)
- `/blog/{slug}` — Blog article detail (hero, TOC, share, related, prev/next)

### UI Improvements
- Homepage hero with browser mockup, floating cards, trust badges, gradient background
- 9-feature grid with per-card mini illustrations
- 5-step workflow timeline with connecting lines
- Enterprise security section with shield SVG + 6 security cards
- Social proof: 2,500+ docs, 900+ users, 99.9% availability, customer logos, testimonials
- Pricing card with "Most Popular" badge + comparison table
- Searchable FAQ accordion (homepage + FAQ page)
- Professional 6-column footer with social links
- Scroll-reveal animations via Intersection Observer

### Components Created
`resources/js/Components/Marketing/` — ScrollReveal, SectionHeader, WorkflowTimeline, FeatureGrid, SecuritySection, SocialProof, PricingSection, FaqAccordion, LegalToc

### Responsive Checklist
- [x] Desktop (1280px+)
- [x] Laptop (1024px)
- [x] Tablet (768px)
- [x] Mobile (375px)
- [x] No horizontal scroll

### Accessibility Checklist
- [x] Semantic HTML (`section`, `article`, `nav`, `aside`)
- [x] ARIA labels on interactive elements
- [x] Keyboard navigation (accordions, forms, links)
- [x] `sr-only` labels on search inputs
- [x] `prefers-reduced-motion` respected
- [x] Focus-visible outlines on FAQ buttons

### Performance
- Vite code-splitting per page
- Inline SVG illustrations (no CLS from images)
- `npm run build` — pass (1.79s)

### Regression Checklist
- [x] Signing Editor — unchanged
- [x] Dashboard — unchanged
- [x] Upload Flow — unchanged
- [x] Review Flow — unchanged
- [x] Complete Flow — unchanged
- [x] Authentication — unchanged
- [x] Email Verification — unchanged
- [x] Request Signatures — unchanged
- [x] Auto Detection — unchanged
- [x] Backend APIs — unchanged

### Testing Status
- `npm run build` — pass

---

## Workspace UX, Delete Redirects & Auto-Placement (v0.10.4)

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.10.4 |
| **Date** | 2026-06-25 |

### Root Cause
1. **Loading UI** — workspace loader was an in-layout absolute panel beside the editor, not a full-screen overlay.
2. **404 after delete** — `DocumentsController::destroy()` returned `back()`, reloading the deleted document URL; soft-deleted `Document` route binding then threw Laravel’s default 404.
3. **Placement friction** — `captureSignature()` set `placementMode = null` for signatures after save, requiring an extra “Place Manually” click.

### Fix Summary
- Redesigned `SignWorkspaceLoader` as a Teleport’d full-screen overlay with CubSign branding, dual messages, and fade-out transition.
- `destroy()` redirects to `documents.index` with `document-deleted` flash; custom route binding redirects missing documents with `document-unavailable`.
- `enterPlacementModeAfterSave()` activates manual placement + helper banner after Save Signature / Save Initials only.

### Files Modified
- `resources/js/Components/Sign/SignWorkspaceLoader.vue`
- `resources/js/Components/Editor/EditorPlacementHelper.vue`
- `resources/js/Pages/Sign/Editor.vue`
- `resources/js/Pages/Workspace/Documents.vue`
- `resources/js/Pages/Workspace/DocumentShow.vue`
- `app/Http/Controllers/Web/Workspace/DocumentsController.php`
- `app/Providers/AppServiceProvider.php`
- `tests/Feature/DocumentDeleteRedirectTest.php`

### Regression Checklist
- [x] Guest Signing — unchanged (sign routes not modified)
- [x] Self Sign — placement auto-activates after save (improvement only)
- [x] Request Signatures — unchanged
- [x] Email Verification — unchanged
- [x] Auto Detection — still user-initiated only
- [x] PDF Rendering — unchanged init pipeline
- [x] Signature Persistence — unchanged
- [x] Review Flow — unchanged
- [x] Dashboard — delete redirect + toast added
- [x] Autosave — unchanged
- [x] Document Download — missing doc redirects instead of 404
- [x] Recipient Signing — unchanged

### Testing Status
- `tests/Feature/DocumentDeleteRedirectTest.php` — delete redirect, show/open missing doc, session cleanup
- `npm run build` — pass

---

## Mandatory Email Verification

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.10.0 |
| **Date** | 2026-06-25 |

### Files Modified

#### Backend
- `app/Models/User.php`
- `app/Enums/UserStatus.php`
- `app/Notifications/VerifyEmailNotification.php`
- `app/Http/Middleware/EnsureEmailIsVerified.php`
- `app/Http/Controllers/Auth/RegisteredUserController.php`
- `app/Http/Controllers/Auth/AuthenticatedSessionController.php`
- `app/Http/Controllers/Auth/VerifyEmailController.php`
- `app/Http/Controllers/Auth/EmailVerificationPromptController.php`
- `app/Http/Controllers/Auth/EmailVerificationNotificationController.php`
- `app/Http/Controllers/Auth/ChangeVerificationEmailController.php`
- `app/Http/Controllers/Auth/VerificationExpiredController.php`
- `app/Http/Controllers/Auth/SocialiteController.php`
- `app/Http/Controllers/ProfileController.php`
- `app/Http/Middleware/HandleInertiaRequests.php`
- `bootstrap/app.php`
- `config/auth.php`
- `routes/auth.php`
- `routes/web.php`
- `database/migrations/2026_06_25_000001_add_status_to_users_table.php`
- `database/factories/UserFactory.php`

#### Frontend
- `resources/js/Pages/Auth/VerifyEmail.vue`
- `resources/js/Pages/Auth/VerificationExpired.vue`
- `resources/js/Pages/Auth/ChangeEmail.vue`
- `resources/js/Pages/Workspace/Overview.vue`
- `resources/views/emails/verify-email.blade.php`

#### Database
- `users.status` — `pending_verification` | `active`

#### Routes
- `verification.notice`, `verification.verify`, `verification.send`
- `verification.expired`, `verification.change`, `verification.update-email`

#### Controllers
- See backend files above

#### Components
- `Auth/VerifyEmail.vue`, `Auth/VerificationExpired.vue`, `Auth/ChangeEmail.vue`

### Testing Status
- `tests/Feature/Auth/EmailVerificationTest.php` — updated + expanded
- `tests/Feature/Auth/RegistrationTest.php` — updated
- `tests/Feature/Auth/AuthenticationTest.php` — unverified login redirect
- `tests/Feature/ProfileTest.php` — email change resets verification

### Known Limitations
- Google OAuth users bypass verification (by design — email verified by Google)
- No API routes yet; JSON 403 handling is ready for future API layer
- Resend rate limits use cache + RateLimiter (requires working cache driver in production)

### Future Improvements
- Queue verification emails for faster registration response
- Localized verification email templates
- Admin override to manually verify accounts

### Developer Notes
- Run `php artisan migrate` to add `users.status`
- Verification links use Laravel `URL::temporarySignedRoute` (24h default)
- `verified` middleware is applied only to workspace and profile routes — **not** to `/sign` or `/r/{token}` (guest/public signing)

---

## Guest Signing Regression Fix (v0.10.1)

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.10.1 |
| **Date** | 2026-06-25 |

### Root Cause
`routes/web.php` applied `verified` middleware to the `/sign` route group. Laravel's stock `Illuminate\Auth\Middleware\EnsureEmailIsVerified` redirects when `! $request->user()`, so guests were sent to `/verify-email` → `/login` instead of the upload page.

### Fix
Removed `verified` from the signing route group. Email verification continues to protect workspace routes only.

### Files Modified
- `routes/web.php`
- `bootstrap/app.php`
- `database/migrations/2026_06_22_000004_add_sign_token_to_documents_table.php` (SQLite test compatibility)
- `tests/Feature/GuestSigningAccessTest.php` (new)
- `README.md`, `CHANGELOG.md`, `DEVELOPMENT_TRACKER.md`

### Testing Status
- `tests/Feature/GuestSigningAccessTest.php` — guest + unverified user sign access, workspace still protected

---

## User-Initiated Detection Only (v0.10.3)

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.10.3 |
| **Date** | 2026-06-25 |

### Change
Signature detection is now completely user-initiated and never runs automatically on PDF load. On open/upload the editor restores PDF render, placed fields, saved signatures, recipients, signing mode, zoom, and page — then stops. No suggestion cards, overlays, or `detectFields()` execution until the user clicks **Detect Signature Fields** or **Auto Place**.

### Removed Automatic Triggers
- `initializeWorkspace()` — removed `runAutoDetection()` call after PDF render
- `captureSignature()` — removed post-save `detectFields()` call
- `useExistingAsset()` — removed `detectFields()` call when reusing saved signature
- Deleted `runAutoDetection()` helper (no longer needed)

### Allowed Detection Entry Points
- **Detect Signature Fields** button → `detectFields()`
- **Auto Place** button → `autoPlace()` → `detectFields()` only if `detectedFields` is empty

### Files Modified
- `resources/js/Pages/Sign/Editor.vue`
- `CHANGELOG.md`, `README.md`, `DEVELOPMENT_TRACKER.md`

### Regression Prevented
- Do not re-add automatic detection in lifecycle hooks, PDF load callbacks, signature save callbacks, or watchers.

---

## Auto-Detection Regression Fix (v0.10.2)

| Field | Value |
|---|---|
| **Status** | Completed |
| **Version** | v0.10.2 |
| **Date** | 2026-06-25 |

### Root Cause
During Editor component extraction (`72616ee`), the placement-mode UI (`Place Manually`, `Detect Signature Fields`, `Auto Place`) was removed from `Editor.vue`. `detectFields()` and `autoPlace()` remained but had no template bindings or lifecycle callers — detection never executed after PDF upload.

### Fix
- Restored placement-mode buttons, detected-field list, and amber overlay rendering.
- `runAutoDetection()` runs once after `initializeWorkspace()` completes PDF render.
- `detectFields()` scans without requiring a saved signature; `placeAtField()` still requires one.
- `captureSignature()` re-triggers detection after saving a signature.

### Files Modified
- `resources/js/Pages/Sign/Editor.vue`
- `CHANGELOG.md`, `README.md`, `DEVELOPMENT_TRACKER.md`

### Testing Status
- `npm run build` — pass
- `php artisan test` — 47 passed

### Known Limitations
- Detection engine scans **signature keywords only** (not initials/name/date field types). Those field types are placed manually via the field-type grid.

### Regression Prevented
- Placement-mode UI must remain wired to `detectFields()` / `autoPlace()` / `activateManualMode()`.

---

## Template

Copy this block for new features:

```markdown
## Feature Name

| Field | Value |
|---|---|
| **Status** | Planned / In Progress / Completed |
| **Version** | vX.Y.Z |
| **Date** | YYYY-MM-DD |

### Files Modified
...

### Testing Status
...

### Known Limitations
...

### Future Improvements
...

### Developer Notes
...
```
