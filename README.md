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

> **FROZEN** — Marketing website is complete. No further changes planned.

| Route | Page | Status |
|---|---|---|
| `/` | Home | Live |
| `/features` | Features | Live |
| `/pricing` | Pricing | Live |
| `/faq` | FAQ | Live |
| `/login` | Login | Live |
| `/register` | Register | Live |

Authenticated users are redirected from `/` to `/overview`.

### Advertised MVP Features

| Feature | Scope |
|---|---|
| Self Sign PDFs | Upload + sign yourself |
| Draw or Type Signatures | Signature creation tool |
| Secure Documents | Local disk, no public exposure |
| Works Everywhere | Browser-based, responsive |

---

## Customer Workspace

| Route | Page | Status |
|---|---|---|
| `/overview` | Overview | Live |
| `/documents` | Documents | Week 2 |
| `/signatures` | Signatures | Week 3 |
| `/templates` | Templates | Week 6 |
| `/activities` | Activities | Week 6 |
| `/billing` | Billing | Week 7 |
| `/profile` | Profile | Live |
| `/settings` | Settings | Future |

---

## V1 Roadmap

- [x] Week 1 — Project setup, authentication, workspace layout, Overview
- [x] Week 1 (ext) — Public website: Home, Features, Pricing, FAQ (FROZEN)
- [ ] Week 2 — Document module (upload, list, view)
- [ ] Week 3 — Signature module (sign PDF)
- [ ] Week 4 — Self sign flow
- [ ] Week 5 — Send for signature
- [ ] Week 6 — Templates and audit trail
- [ ] Week 7 — Stripe billing
- [ ] Week 8 — Testing and launch

---

## Product by

**Cubiz Infotech** — [cubizinfotech.com](https://cubizinfotech.com)
