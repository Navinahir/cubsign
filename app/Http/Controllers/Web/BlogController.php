<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Blog');
    }

    public function show(string $slug): Response
    {
        return Inertia::render('BlogPost', [
            'slug' => $slug,
        ]);
    }
}
