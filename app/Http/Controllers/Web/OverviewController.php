<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OverviewController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $stats = [
            'total'    => $user->documents()->count(),
            'signed'   => $user->documents()->where('status', 'signed')->count(),
            'drafts'   => $user->documents()->where('status', 'draft')->count(),
        ];

        $recentDocuments = $user->documents()
            ->latest()
            ->limit(5)
            ->get(['id', 'name', 'status', 'created_at']);

        return Inertia::render('Workspace/Overview', [
            'stats'           => $stats,
            'recentDocuments' => $recentDocuments,
        ]);
    }
}
