# CubSign

CubSign is a workspace-first SaaS PDF signing platform. Simple, polished, reliable.

**Core flow:** Upload PDF → Sign → Send to others → Receive completed docs → Download.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12 (PHP 8.2) |
| Frontend | Vue 3 + Inertia.js |
| Styling | TailwindCSS v3 |
| Build | Vite |
| Database | MySQL |
| Queue | Redis |
| Cache | Redis |
| Session | Redis |
| Storage | Local disk |
| Email | Resend |
| Payments | Stripe (Week 7) |
| PDF Viewer | PDF.js (Week 2+) |
| Signature Canvas | signature_pad.js (Week 3+) |

---

## Architecture

```
Controllers → Services → Repositories → Models
```

- Business logic lives in **Services** only.
- Controllers stay thin — they delegate to Services and return responses.
- Designed for future API and mobile support.

### Directory Structure

```
app/
  Http/
    Controllers/
      Web/          ← Customer-facing Inertia controllers
      Api/          ← Future API controllers
    Middleware/
    Requests/
    Resources/
  Models/
  Services/         ← All business logic
  Repositories/     ← Data access layer
  Actions/          ← Single-purpose action classes
  Enums/            ← PHP enums
  Jobs/
  Notifications/
```

---

## Local Development Setup

### Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL (WAMP)
- Redis

### Steps

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run build
```

### Environment

Configure `.env`:

```
DB_DATABASE=cubsign
DB_USERNAME=root
DB_PASSWORD=

RESEND_API_KEY=your-key-here

STRIPE_KEY=your-key-here
STRIPE_SECRET=your-secret-here
```

---

## Public Website

> **v0.8.0** — Homepage fully redesigned (9 sections). Marketing website is live and active.

| Route | Page | Status |
|---|---|---|
| `/` | Home | Live (v0.8.0) |
| `/features` | Features | Live |
| `/pricing` | Pricing | Live |
| `/faq` | FAQ | Live |
| `/login` | Login | Live |
| `/register` | Register | Live |

All visitors see the marketing homepage. Authenticated users are never auto-redirected.

### Homepage Sections (v0.8.0)

| Section | Description |
|---|---|
| Hero | Split layout — left text + right document illustration |
| Trust Bar | 4-column row: Secure / Audit Trails / Fast / Everywhere |
| Interactive Demo | 3-step card — Draw/Type/Upload tabs, PDF preview, download CTA |
| Features | 6 cards — Quick Sign (live) + 5 Coming Soon |
| How It Works | 3 step cards: Upload / Sign / Download |
| Testimonials | 3 customer quote cards |
| Pricing | Free / Pro / Founder cards |
| FAQ | Accordion (4 questions) |
| Final CTA | Blue gradient card — "Ready to sign real documents?" |

---

## Signing Flow (Guest + Authenticated)

Token is stored in PHP session after upload — never exposed in the URL.

| Route | Page | Status |
|---|---|---|
| `GET /sign` | PDF upload | Live |
| `POST /sign` | Handle upload | Live |
| `GET /sign/editor` | PDF editor | Placeholder |
| `GET /sign/complete` | Download | Placeholder |

---

## Customer Workspace

| Route | Page | Status |
|---|---|---|
| `/overview` | Overview | Live |
| `/documents` | Documents | Planned |
| `/signatures` | Signatures | Planned |
| `/templates` | Templates | Planned |
| `/activities` | Activities | Planned |
| `/billing` | Billing | Planned |
| `/profile` | Profile | Live |
| `/settings` | Settings | Future |

---

## Developer Experience

| Feature | Detail |
|---|---|
| `app.isLocal` shared prop | Available on every Inertia page via `usePage().props.app.isLocal` |
| `DevNav` component | Gear icon (⚙) toggles compact white panel — never shown in production |
| Final CTA section | Premium gradient card (`rounded-[32px]`, blue gradient, flow strip) |
| Dev shortcuts | Upload, Editor, Complete, Workspace — one click in local dev |
| Continue Signing banner | Shown on homepage when `session()->has('sign_token')` is true |

---

## V1 Roadmap

- [x] Week 1 — Project setup, authentication, workspace layout, Overview
- [x] Week 1 (ext) — Public website: Home, Features, Pricing, FAQ (FROZEN)
- [x] Week 2 (partial) — Signing flow: upload module, sign session, SignLayout
- [ ] Week 2 (cont.) — PDF preview (PDF.js), signature canvas, placement, download
- [ ] Week 3 — Signature management (save/reuse signatures)
- [ ] Week 4 — Workspace document list (authenticated users)
- [ ] Week 5 — Send for signature (future)
- [ ] Week 6 — Templates and audit trail (future)
- [ ] Week 7 — Stripe billing
- [ ] Week 8 — Testing and launch

---

## Product by

**Cubiz Infotech** — [cubizinfotech.com](https://cubizinfotech.com)
