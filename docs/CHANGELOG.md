# Changelog

All notable changes to CubSign are documented here.

---

## [Unreleased]

### Week 2 — Document Module
- Planned: PDF upload, local disk storage, document list

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
- `DashboardController` → `OverviewController` (moved to `Controllers/Web/`)
- `Dashboard.vue` removed; replaced by `Overview.vue`
- `AuthenticatedLayout.vue` — internal `route()` calls updated to `overview`
- `Profile/Edit.vue` — switched from `AuthenticatedLayout` to `WorkspaceLayout`
- `AuthenticatedSessionController` — post-login redirect → `overview`
- `RegisteredUserController` — post-register redirect → `overview`
- `EmailVerificationPromptController` — redirect → `overview`
- `VerifyEmailController` — redirect → `overview`
- `README.md` — replaced default Laravel README with CubSign documentation

#### Architecture
- Customer-facing controllers live in `app/Http/Controllers/Web/`
- Naming convention enforced: no "Dashboard", no "Admin Panel"

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
- `.env` configured for local WAMP development
- Resend and Stripe environment variables stubbed
- PHPUnit 11 test configuration (PHP 8.2 compatible)
- Ziggy for named route generation in Vue components
