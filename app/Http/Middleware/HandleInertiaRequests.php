<?php

namespace App\Http\Middleware;

use App\Support\SeoMeta;
use App\Support\SeoRobots;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'home' => $request->user()?->homeRouteName() ?? 'overview',
                'can'  => [
                    'manageBlogs' => $request->user()?->canManageBlogs() ?? false,
                ],
            ],
            'flash' => [
                'status'  => fn () => $request->session()->get('status'),
                'success' => fn () => $request->session()->get('success'),
            ],
            'app' => [
                'isLocal' => app()->environment('local'),
                'url' => config('app.url'),
                'name' => config('app.name'),
            ],
            'seo' => array_filter([
                'robots' => SeoRobots::forRequest($request),
                ...(SeoMeta::forRequest($request) ?? []),
            ], static fn ($value) => $value !== null),
        ];
    }
}
