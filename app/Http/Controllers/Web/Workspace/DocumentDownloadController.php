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

        if (! $document->pdf_path || ! Storage::exists($document->pdf_path)) {
            abort(404);
        }

        $downloadName = pathinfo($document->name, PATHINFO_FILENAME) . '.pdf';

        return Storage::download($document->pdf_path, $downloadName);
    }
}
