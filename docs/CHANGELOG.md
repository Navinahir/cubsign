# Changelog

All notable changes to CubSign are documented here.

---

## [Unreleased]

### Week 2 — Document Module
- Planned: PDF upload, local disk storage, document list

---

## [0.3.0] — 2026-06-19

### Public Website Foundation

#### Added
- `PublicLayout.vue` — sticky navbar with logo, nav links, CTA buttons, mobile hamburger, footer
- `Home.vue` — hero, features grid, pricing preview, FAQ accordion, CTA banner
- `Features.vue` — detailed feature cards with alternating layout
- `Pricing.vue` — pricing cards (Free, Pro, Founder) + comparison table
- `Faq.vue` — categorised FAQ accordion (Getting Started, Signing, Security, Billing)
- `HomeController` — renders Home, redirects authenticated users to `/overview`
- `FeaturesController`, `PricingController`, `FaqController` — thin Inertia controllers
- Routes: `GET /` (home), `GET /features`, `GET /pricing`, `GET /faq`
- All public routes named: `home`, `features`, `pricing`, `faq`

#### Changed
- `routes/web.php` — replaced closure at `/` with `HomeController`; removed Laravel/PHP version props
- `Welcome.vue` removed; replaced by `Home.vue`

#### Behaviour
- Guests visiting `/` see the marketing home page
- Authenticated users visiting `/` are redirected to `/overview`
- Navbar active links highlight based on current route (via Ziggy)

---

## [0.2.0] — 2026-06-19

### Week 1 — Workspace Foundation

#### Added
- `WorkspaceLayout.vue` — sidebar layout used across all workspace pages
- `Overview.vue` — workspace landing page with stat cards and activity placeholder
- `OverviewController` — thin controller at `app/Http/Controllers/Web/`
- Sidebar navigation: Overview, Documents, Signatures, Templates, Activities, Billing, Profile, Settings
- User avatar initials in sidebar footer and top bar user dropdown
- Mobile-responsive sidebar with backdrop overlay

#### Changed
- Renamed `/dashboard` route → `/overview` (route name: `overview`)
- `Dashboard.vue` removed; replaced by `Overview.vue`
- `Profile/Edit.vue` — switched from `AuthenticatedLayout` to `WorkspaceLayout`
- All auth controllers updated: post-login/register/verify redirect → `overview`
- `README.md` — replaced default Laravel README with CubSign documentation

---

## [0.1.0] — 2026-06-18

### Week 1 — Project Setup & Authentication

#### Added
- Laravel 12 (v12.62.0) + PHP 8.2 project scaffold
- Laravel Breeze (Vue + Inertia.js stack)
- TailwindCSS v3 + Vite build pipeline
- MySQL database with `defaultStringLength(191)` for WAMP compatibility
- Redis for session, cache, and queue
- Authentication: Login, Register, Forgot Password, Email Verification, Profile
- Custom directory structure: Services, Repositories, Actions, Enums, Controllers/Web, Controllers/Api
- `.env` and `.env.example` configured for WAMP local development
- Resend and Stripe environment variables stubbed
- PHPUnit 11 test configuration (PHP 8.2 compatible)
- Ziggy for named route generation in Vue components
