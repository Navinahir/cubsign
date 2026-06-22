<?php

namespace App\Http\Controllers\Web\Workspace;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class TemplatesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Workspace/Templates');
    }
}
