# CubSign Development Tracker

Running log of feature implementation status. Update this file when a feature is planned, started, or completed.

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
