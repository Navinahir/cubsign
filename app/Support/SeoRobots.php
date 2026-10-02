<?php

namespace App\Support;

use Illuminate\Http\Request;

/**
 * Central SEO robots directive for public vs private/auth/workflow pages.
 */
class SeoRobots
{
    public const INDEX = 'index, follow';

    public const NOINDEX = 'noindex, nofollow';

    /**
     * Route name patterns that must not be indexed.
     *
     * @var list<string>
     */
    private const NOINDEX_ROUTE_PATTERNS = [
        'login',
        'register',
        'password.*',
        'verification.*',
        'auth.google',
        'auth.google.callback',
        'overview',
        'admin.dashboard',
        'blogs.*',
        'blog-categories.*',
        'documents.*',
        'templates.*',
        'profile.*',
        'recipient.*',
        'sign.editor',
        'sign.pdf',
        'sign.review',
        'sign.review.snapshot',
        'sign.complete',
        'sign.sent',
        'sign.save',
    ];

    /**
     * Resolve robots for the Inertia root Blade view (initial HTML).
     *
     * @param  array<string, mixed>  $page
     */
    public static function forBlade(array $page, Request $request): string
    {
        if (($page['component'] ?? null) === 'Error') {
            return self::NOINDEX;
        }

        return self::forRequest($request);
    }

    /**
     * Resolve robots from the current route (shared to Inertia + Blade).
     */
    public static function forRequest(Request $request): string
    {
        if ($request->is('up')) {
            return self::NOINDEX;
        }

        if ($request->route() && $request->routeIs(...self::NOINDEX_ROUTE_PATTERNS)) {
            return self::NOINDEX;
        }

        return self::INDEX;
    }
}
