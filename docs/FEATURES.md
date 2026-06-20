# CubSign — Feature Inventory

This document tracks what is built, in-progress, and planned for V1.

---

## Public Website

> **Status: v0.8.0** — Homepage fully redesigned. Marketing website is active and evolving.

| Feature | Status |
|---|---|
| Home page — 9-section premium redesign (v0.8.0) | Done |
| Hero — split layout, left text + right document illustration | Done |
| Trust Bar — 4-column row (Secure / Audit / Fast / Everywhere) | Done |
| Interactive Demo — 3-step card, Draw/Type/Upload tabs | Done |
| Features section — 6 cards (Quick Sign + 5 Coming Soon) | Done |
| How It Works — 3 standalone step cards | Done |
| Testimonials — 3 quote cards | Done |
| Pricing section — Free / Pro / Founder | Done |
| FAQ — accordion, updated copy | Done |
| Final CTA — gradient card, platform badges | Done |
| Features page | Done |
| Pricing page | Done |
| FAQ page | Done |
| Public layout — sticky navbar, backdrop-blur, 3-column footer | Done |
| Mobile-responsive navbar | Done |
| "Built by Cubiz Infotech" in footer | Done |

### Features advertised on landing page

| Marketed Feature | V1 Scope | Status |
|---|---|---|
| Quick Sign (Self Sign PDFs) | Upload PDF and sign it yourself | In progress (Week 2–3) |
| Request Signatures | Send to others, track status | Coming Soon |
| Bulk Sign | Sign multiple docs at once | Coming Soon |
| Templates | Reusable document templates | Coming Soon |
| Audit Trails | Timestamped signing logs | Coming Soon |
| Team Access | Team document sharing | Coming Soon |

---

## Authentication

| Feature | Status |
|---|---|
| User registration | Done |
| Login / logout | Done |
| Forgot password | Done |
| Password reset | Done |
| Email verification | Done |
| Profile — update name/email | Done |
| Profile — change password | Done |
| Profile — delete account | Done |

---

## Workspace

| Feature | Status |
|---|---|
| Workspace layout (sidebar + topbar) | Done |
| Overview page with stat cards | Done |
| Mobile-responsive sidebar | Done |
| User initials avatar | Done |
| User dropdown (profile, logout) | Done |

---

## Signing Flow

| Feature | Status |
|---|---|
| `/sign` entry page with step explainer | Done |
| Drag-and-drop PDF upload | Done |
| Client-side validation (type, 25 MB) | Done |
| Server-side validation (`mimes:pdf`, `max:25600`) | Done |
| Guest upload — no auth required | Done |
| Sign session created with unique token | Done |
| PDF stored on local disk (`storage/app/sign/`) | Done |
| Upload progress bar | Done |
| `SignLayout.vue` with 4-step indicator | Done |
| Redirect to editor after upload | Done |
| PDF preview (PDF.js) | Planned (Week 2) |
| Draw signature on canvas | Planned (Week 2) |
| Type signature | Planned (Week 2) |
| Place signature on PDF | Planned (Week 2) |
| Download signed PDF | Planned (Week 2) |

---

## Documents (Workspace)

| Feature | Status |
|---|---|
| Upload PDF | Done (via signing flow) |
| List documents | Planned |
| View document details | Planned |
| Download original | Planned |
| Delete document | Planned |

---

## Signatures

| Feature | Status |
|---|---|
| Draw signature on canvas | Planned (Week 3) |
| Upload signature image | Planned (Week 3) |
| Type signature | Planned (Week 3) |
| Save signature | Planned (Week 3) |

---

## Self Sign

| Feature | Status |
|---|---|
| Place signature fields on PDF | Planned (Week 4) |
| Sign document (self) | Planned (Week 4) |
| Download signed PDF | Planned (Week 4) |

---

## Send for Signature

> Deferred — not advertised in V1 marketing.

| Feature | Status |
|---|---|
| Add recipients | Future |
| Send signature request by email | Future |
| Recipient signs via link | Future |
| Track signing status | Future |
| Completed document download | Future |

---

## Templates

> Deferred — not advertised in V1 marketing.

| Feature | Status |
|---|---|
| Create template from PDF | Future |
| List templates | Future |
| Send from template | Future |

---

## Audit Trail / Activities

> Deferred — not advertised in V1 marketing.

| Feature | Status |
|---|---|
| Document activity log | Future |
| User activity feed | Future |

---

## Billing

| Feature | Status |
|---|---|
| Stripe subscription plans | Planned (Week 7) |
| Upgrade / downgrade plan | Planned (Week 7) |
| Invoice history | Planned (Week 7) |

---

## Out of Scope for V1

- AI / OCR
- Mobile App
- Public API
- Teams / multi-user workspaces
- Workflow Engine
- White Label
- S3 / cloud storage
- Webhooks
- Blog
- Contact page
- Dark mode
