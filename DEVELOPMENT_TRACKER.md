# CubSign Development Tracker

Running log of feature implementation status. Update this file when a feature is planned, started, or completed.

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
