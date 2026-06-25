<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailIsVerified
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ?string $redirectToRoute = null): Response
    {
        if (! $request->user()
            || ($request->user() instanceof MustVerifyEmail
                && $request->user()->hasVerifiedEmail())) {
            return $next($request);
        }

        return $request->expectsJson()
            ? abort(403, 'Email Verification Required')
            : Redirect::guest(URL::route($redirectToRoute ?: 'verification.notice'));
    }
}
