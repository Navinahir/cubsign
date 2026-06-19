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
| Payments | Stripe |
| PDF Viewer | PDF.js |
| Signature Canvas | signature_pad.js |

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
# Install PHP dependencies
composer install

# Install JS dependencies
npm install

# Copy environment file and generate key
cp .env.example .env
php artisan key:generate

# Run database migrations
php artisan migrate

# Build frontend assets
npm run build
```

### Environment

Copy `.env.example` to `.env` and configure:

```
DB_DATABASE=cubsign
DB_USERNAME=root
DB_PASSWORD=

RESEND_API_KEY=your-key-here

STRIPE_KEY=your-key-here
STRIPE_SECRET=your-secret-here
```

---

## Customer Workspace Navigation

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
