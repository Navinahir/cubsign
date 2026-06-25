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
- `verified` middleware allows guests through on sign routes; only blocks authenticated unverified users

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
