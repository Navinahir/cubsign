<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback(): RedirectResponse
    {
        try {
            $socialUser = Socialite::driver('google')->user();
        } catch (\Throwable $e) {
            Log::channel('cubsign')->warning('Google OAuth callback failed', [
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('login')->withErrors([
                'email' => 'Google sign-in failed. Please try again.',
            ]);
        }

        // Find by google_id first, then fall back to email match
        $user = User::where('google_id', $socialUser->getId())->first()
            ?? User::where('email', $socialUser->getEmail())->first();

        if ($user) {
            if (! $user->google_id) {
                $user->update(['google_id' => $socialUser->getId()]);
            }

            if (! $user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
            }
        } else {
            $user = User::create([
                'name'              => $socialUser->getName(),
                'email'             => $socialUser->getEmail(),
                'google_id'         => $socialUser->getId(),
                'email_verified_at' => now(),
                'status'            => UserStatus::Active,
                'password'          => bcrypt(Str::random(32)),
            ]);

            Log::channel('cubsign')->info('New user created via Google OAuth', [
                'user_id' => $user->id,
                'email'   => $user->email,
            ]);
        }

        Auth::login($user, remember: true);
        session()->forget('guest_completed');

        return redirect()->intended(route('overview'));
    }
}
