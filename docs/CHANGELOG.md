# Changelog

All notable changes to CubSign are documented here.

---

## [Unreleased]

### Week 2 — Document Module
- Planned: PDF upload, local disk storage, document list

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
