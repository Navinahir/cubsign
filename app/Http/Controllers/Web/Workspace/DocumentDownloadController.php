<?php

namespace App\Http\Controllers\Web\Workspace;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentDownloadController extends Controller
{
    public function __invoke(Document $document): StreamedResponse
    {
        if ($document->user_id !== auth()->id()) {
            abort(403);
        }

        // For completed documents, serve the final signed PDF when available
        $path = ($document->status === 'completed' && $document->signed_pdf_path)
            ? $document->signed_pdf_path
            : $document->pdf_path;

        if (! $path || ! Storage::disk('documents')->exists($path)) {
            abort(404);
        }

        $downloadName = pathinfo($document->name, PATHINFO_FILENAME) . '.pdf';

        return Storage::disk('documents')->download($path, $downloadName);
    }
}
