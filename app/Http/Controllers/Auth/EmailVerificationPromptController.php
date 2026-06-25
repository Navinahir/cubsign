<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('overview', absolute: false));
        }

        return Inertia::render('Auth/VerifyEmail', [
            'status'            => session('status'),
            'email'             => $request->user()->email,
            'resendAvailableAt' => $this->resendAvailableAt($request->user()->id),
            'resendLimit'       => config('auth.verification.resend_limit', 5),
        ]);
    }

    private function resendAvailableAt(int $userId): ?int
    {
        $cooldownKey = "verification-resend-cooldown:{$userId}";
        $expiresAt   = Cache::get($cooldownKey);

        if (! $expiresAt) {
            return null;
        }

        return max(0, $expiresAt - now()->timestamp);
    }
}
