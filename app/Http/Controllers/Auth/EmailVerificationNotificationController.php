<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route($user->homeRouteName(), absolute: false));
        }

        $cooldownKey = "verification-resend-cooldown:{$user->id}";
        $expiresAt   = Cache::get($cooldownKey);

        if ($expiresAt && $expiresAt > now()->timestamp) {
            $remaining = $expiresAt - now()->timestamp;

            return back()->withErrors([
                'resend' => "You can resend another email in {$remaining} seconds.",
            ]);
        }

        $rateLimitKey = "verification-resend:{$user->id}";
        $maxAttempts  = (int) config('auth.verification.resend_limit', 5);
        $decayMinutes = (int) config('auth.verification.resend_decay', 60);

        if (RateLimiter::tooManyAttempts($rateLimitKey, $maxAttempts)) {
            $seconds = RateLimiter::availableIn($rateLimitKey);

            return back()->withErrors([
                'resend' => "You have reached the maximum of {$maxAttempts} verification emails per hour. Try again in {$seconds} seconds.",
            ]);
        }

        try {
            $user->sendEmailVerificationNotification();
        } catch (\Throwable $e) {
            report($e);

            Log::channel('cubsign')->error('VERIFICATION_MAIL_FAILED', [
                'user_id'    => $user->id,
                'exception'  => $e::class,
            ]);

            return back()->withErrors([
                'resend' => "We couldn't send the verification email right now. Please try again later.",
            ]);
        }

        RateLimiter::hit($rateLimitKey, $decayMinutes * 60);

        $cooldownSeconds = (int) config('auth.verification.resend_cooldown', 60);
        Cache::put(
            $cooldownKey,
            now()->addSeconds($cooldownSeconds)->timestamp,
            $cooldownSeconds
        );

        return back()->with('status', 'verification-link-sent');
    }
}
