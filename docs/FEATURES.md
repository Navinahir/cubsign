# CubSign — Feature Inventory

This document tracks what is built and what is planned.

Last updated: 2026-06-24

---

## Public Website

> **Status: v0.8.0** — Homepage fully redesigned. Marketing website is active and frozen.

| Feature | Status |
|---|---|
| Home page — 9-section premium redesign | Done |
| Hero — split layout, left text + right document illustration | Done |
| Trust Bar — 4-column row | Done |
| Interactive Demo — 3-step card, Draw/Type/Upload tabs | Done |
| Features section — 6 cards | Done |
| How It Works — 3 standalone step cards | Done |
| Testimonials — 3 quote cards | Done |
| Pricing — Free / Pro / Founder | Done |
| FAQ accordion | Done |
| Final CTA — gradient card, platform badges | Done |
| Features page | Done |
| Pricing page | Done |
| FAQ page | Done |
| Public layout — sticky navbar, footer | Done |

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
| User dropdown (profile, logout) | Done |
| Document list with status badges | Done |
| Document detail page | Done |
| Activity timeline | Done |
| Download signed PDF | Done |

---

## Owner Signing Flow (Self-Sign)

| Feature | Status |
|---|---|
| `/sign` entry page with step explainer | Done |
| Drag-and-drop PDF upload | Done |
| Client-side validation (type, 25 MB) | Done |
| Server-side validation (`mimes:pdf`, `max:25600`) | Done |
| Guest upload — no auth required | Done |
| Sign session with unique token | Done |
| PDF preview (PDF.js, multi-page) | Done |
| Draw signature on canvas | Done |
| Type signature (3 font styles) | Done |
| Upload signature image | Done |
| Place signature on PDF | Done |
| Signature drag / resize / delete | Done |
| Field detection (keyword confidence scoring) | Done |
| Browser-side PDF embedding (pdf-lib) | Done |
| Download signed PDF | Done |
| Dedicated `cubsign` log channel | Done |

---

## Document Workspace (Authenticated)

| Feature | Status |
|---|---|
| Draft document creation on upload | Done |
| Editor state auto-save | Done |
| Draft restore from saved state | Done |
| Recipient configuration in editor | Done |
| Field placement with per-recipient assignment | Done |
| Prepare Requests workflow | Done |
| Send document to recipients | Done |
| Document list view | Done |
| Document detail / show view | Done |
| Activity timeline on detail view | Done |
| Soft delete documents | Done |
| Download original PDF | Done |
| Download completed signed PDF | Done |

---

## Recipient Signing

| Feature | Status |
|---|---|
| Recipients table and model | Done |
| Sequential signing order | Done |
| Token-based signing links | Done |
| Recipient sign page (`RecipientSign.vue`) | Done |
| Already-signed protection | Done |
| Not-yet-turn protection | Done |
| Invalid token protection | Done |
| Signed fields stored per recipient | Done |
| Recipient status: pending / sent / signed | Done |

---

## Email Delivery

| Feature | Status |
|---|---|
| `RecipientInvitationMail` Mailable class | Done |
| HTML email template with CubSign branding | Done |
| First recipient auto-notified on send | Done |
| Next recipient notified after previous signs | Done |
| `recipient_notified` activity event | Done |
| SMTP / Mailtrap / Gmail configuration via `.env` | Done |
| Error-safe — email failure never aborts signing flow | Done |

---

## Signed PDF Generation

| Feature | Status |
|---|---|
| `SignedPdfService` | Done |
| FPDI / FPDF integration | Done |
| Signature PNG overlay | Done |
| Initials PNG overlay | Done |
| Name / date / text field rendering | Done |
| Checkbox tick rendering | Done |
| `signed_pdf_path` stored on document | Done |
| Completed PDF available for download | Done |

---

## Activity Tracking

| Feature | Status |
|---|---|
| `document_activities` table and model | Done |
| `document_sent` event | Done |
| `recipient_notified` event | Done |
| `recipient_signed` event | Done |
| `document_completed` event | Done |
| Activity timeline on document detail page | Done |

---

## Remaining Planned Features

| Feature | Priority |
|---|---|
| Audit Trail PDF | High |
| Completion Certificate | High |
| Document Expiration | Medium |
| Reminders (follow-up emails) | Medium |
| Template Enhancements | Medium |
| Team Workspaces | Low |
| Branding Customization | Low |
| API Access | Low |
| Webhooks | Low |
| Production Hardening (S3, queues, rate limiting) | High |

---

## Out of Scope for V1

- AI / OCR
- Mobile app
- Bulk signing
- Teams / multi-user workspaces
- Dark mode
- Blog / contact page
