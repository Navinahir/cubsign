<?php

namespace App\Http\Controllers\Web\Sign;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SentController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if (! auth()->check()) {
            return redirect()->route('sign.index');
        }

        $summary = $request->session()->pull('sign_sent_summary');

        if (! is_array($summary) || empty($summary['document_id'])) {
            return redirect()->route('overview');
        }

        $document = Document::query()
            ->where('id', $summary['document_id'])
            ->where('user_id', auth()->id())
            ->first();

        if (! $document) {
            return redirect()->route('overview');
        }

        return Inertia::render('Sign/Sent', [
            'summary' => $summary,
        ]);
    }
}
