<?php

namespace App\Http\Controllers\Web\Sign;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadPdfRequest;
use App\Services\SignSessionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class UploadController extends Controller
{
    public function __construct(private readonly SignSessionService $service) {}

    public function show(): Response
    {
        return Inertia::render('Sign/Upload');
    }

    public function store(UploadPdfRequest $request): RedirectResponse
    {
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

        return redirect()->route('sign.editor');
    }
}
