<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\BlogService;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function __construct(private readonly BlogService $blogService) {}

    public function index(): Response
    {
        return Inertia::render('Blog', $this->blogService->listing());
    }

    public function show(string $slug): Response
    {
        $article = $this->blogService->article($slug);

        if ($article === null) {
            abort(404);
        }

        return Inertia::render('BlogPost', [
            'slug' => $slug,
            ...$article,
        ]);
    }
}
