<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ChangeVerificationEmailController extends Controller
{
    /**
     * Show the change-email form for unverified users.
     */
    public function edit(Request $request): Response|RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('overview');
        }

        return Inertia::render('Auth/ChangeEmail', [
            'email' => $request->user()->email,
        ]);
    }

    /**
     * Update the email address and resend verification.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('overview');
        }

        $validated = $request->validate([
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],
        ]);

        $user->forceFill([
            'email'             => $validated['email'],
            'email_verified_at' => null,
            'status'            => UserStatus::PendingVerification,
        ])->save();

        $user->sendEmailVerificationNotification();

        return redirect()
            ->route('verification.notice')
            ->with('status', 'verification-link-sent');
    }
}
