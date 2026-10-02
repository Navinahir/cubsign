<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VerificationExpiredController extends Controller
{
    /**
     * Display the expired verification link page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if ($request->user()?->hasVerifiedEmail()) {
            return redirect()->route($request->user()->homeRouteName());
        }

        return Inertia::render('Auth/VerificationExpired', [
            'isAuthenticated' => $request->user() !== null,
        ]);
    }
}
