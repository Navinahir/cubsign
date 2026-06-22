<?php

namespace App\Http\Controllers\Web\Workspace;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DocumentsController extends Controller
{
    public function index(Request $request): Response
    {
        $documents = $request->user()
            ->documents()
            ->latest()
            ->get(['id', 'name', 'status', 'pdf_path', 'created_at']);

        return Inertia::render('Workspace/Documents', [
            'documents' => $documents,
        ]);
    }
}
