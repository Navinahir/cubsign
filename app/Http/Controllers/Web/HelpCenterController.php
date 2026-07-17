<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class HelpCenterController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('HelpCenter');
    }

    public function show(string $slug): Response
    {
        return Inertia::render('HelpArticle', [
            'slug' => $slug,
        ]);
    }
}
