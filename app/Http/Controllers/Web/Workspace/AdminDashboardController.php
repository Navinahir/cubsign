<?php

namespace App\Http\Controllers\Web\Workspace;

use App\Enums\BlogStatus;
use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\BlogCategory;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(): Response
    {
        $recentBlogs = Blog::query()
            ->with('category:id,name')
            ->latest('updated_at')
            ->limit(5)
            ->get()
            ->map(fn (Blog $blog) => [
                'id'         => $blog->id,
                'title'      => $blog->title,
                'status'     => $blog->status->value,
                'category'   => $blog->category?->name,
                'updated_at' => $blog->updated_at,
            ]);

        return Inertia::render('Workspace/AdminDashboard', [
            'stats' => [
                'blogs'      => Blog::query()->count(),
                'published'  => Blog::query()->where('status', BlogStatus::Published)->count(),
                'drafts'     => Blog::query()->where('status', BlogStatus::Draft)->count(),
                'categories' => BlogCategory::query()->count(),
            ],
            'recentBlogs' => $recentBlogs,
        ]);
    }
}
