<?php

namespace App\Http\Controllers\Web\Sign;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadPdfRequest;
use App\Models\Document;
use App\Services\SignSessionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class UploadController extends Controller
{
    public function __construct(private readonly SignSessionService $service) {}

    public function show(Request $request): Response
    {
        $guestCompleted = ! auth()->check() && $request->session()->get('guest_completed', false);

        return Inertia::render('Sign/Upload', [
            'guestCompleted' => $guestCompleted,
        ]);
    }

    public function store(UploadPdfRequest $request): RedirectResponse
    {
        if (! auth()->check() && $request->session()->get('guest_completed')) {
            return redirect()->route('sign.index');
        }

        $file = $request->file('pdf');

        Log::channel('cubsign')->info('PDF upload received', [
            'ip'       => $request->ip(),
            'user_id'  => auth()->id(),
            'filename' => $file->getClientOriginalName(),
            'size'     => $file->getSize(),
            'mime'     => $file->getMimeType(),
        ]);

        $session = $this->service->upload($file, auth()->id(), $request->ip());

        Log::channel('cubsign')->info('PDF upload complete — session created', [
            'token'    => '…' . substr($session->token, -8),
            'filename' => $session->original_filename,
            'status'   => $session->status,
        ]);

        $request->session()->put('sign_token', $session->token);

        if (auth()->check()) {
            $document = Document::create([
                'user_id'    => $session->user_id,
                'name'       => $session->original_filename,
                'status'     => 'draft',
                'sign_token' => $session->token,
            ]);
            $request->session()->put('sign_document_id', $document->id);
        }

        return redirect()->route('sign.editor');
    }
}
