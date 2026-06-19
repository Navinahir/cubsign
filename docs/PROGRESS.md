# CubSign — Development Progress

Last updated: 2026-06-19

---

## Week 1 — Project Setup + Auth + Workspace Foundation

**Status: Complete**

- [x] Laravel 12 + PHP 8.2 project scaffold
- [x] Vue 3 + Inertia.js + TailwindCSS v3 frontend
- [x] MySQL migrations (users, cache, jobs tables)
- [x] Redis for session, cache, queue
- [x] Laravel Breeze authentication (Login, Register, Forgot Password, Email Verification, Profile)
- [x] Custom directory structure (Services, Repositories, Actions, Enums, Controllers/Web, Controllers/Api)
- [x] `.env` and `.env.example` configured for WAMP local development
- [x] Resend + Stripe env stubs
- [x] PHPUnit 11 test config
- [x] Ziggy named routes in Vue

### Workspace Foundation (done alongside Week 1)

- [x] `WorkspaceLayout.vue` — sidebar + topbar layout
- [x] `Overview.vue` — workspace landing page (stat cards, activity placeholder)
- [x] `OverviewController` in `Controllers/Web/`
- [x] Renamed `/dashboard` → `/overview` across routes, controllers, and Vue files
- [x] `Profile/Edit.vue` migrated to `WorkspaceLayout`
- [x] `Dashboard.vue` removed

---

## Public Website Foundation

**Status: Complete**

- [x] `PublicLayout.vue` — sticky navbar, footer, mobile hamburger menu
- [x] `HomeController` — auth guard redirect: logged-in users go to `/overview`
- [x] `Home.vue` — hero, 4 feature cards, 3 pricing cards, FAQ accordion, CTA banner
- [x] `FeaturesController` + `Features.vue` — full features page
- [x] `PricingController` + `Pricing.vue` — pricing cards + comparison table
- [x] `FaqController` + `Faq.vue` — 16 FAQ items across 4 categories
- [x] Routes: `GET /`, `GET /features`, `GET /pricing`, `GET /faq` (all named)
- [x] `Welcome.vue` removed; replaced by `Home.vue`
- [x] `README.md`, `docs/CHANGELOG.md`, `docs/FEATURES.md`, `docs/PROGRESS.md` updated

---

## Week 2 — Document Module

**Status: Not started**

Planned scope:
- [ ] `documents` migration
- [ ] `Document` model
- [ ] `DocumentRepository`
- [ ] `DocumentService` (upload, list, delete)
- [ ] `DocumentController` in `Controllers/Web/`
- [ ] PDF upload to local disk (`storage/app/documents/`)
- [ ] `Documents.vue` page (list view, upload button)
- [ ] Route `/documents` wired into workspace sidebar

---

## Week 3 — Signature Module

**Status: Not started**

---

## Week 4 — Self Sign

**Status: Not started**

---

## Week 5 — Send for Signature

**Status: Not started**

---

## Week 6 — Templates and Audit Trail

**Status: Not started**

---

## Week 7 — Stripe Billing

**Status: Not started**

---

## Week 8 — Testing and Launch

**Status: Not started**
