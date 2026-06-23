<?php

namespace App\Http\Controllers\Web\Sign;

use App\Http\Controllers\Controller;
use App\Repositories\SignSessionRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class EditorController extends Controller
{
    public function __construct(private readonly SignSessionRepository $repository) {}

    public function __invoke(Request $request): Response|RedirectResponse
    {
        if (! auth()->check() && $request->session()->get('guest_completed')) {
            return redirect()->route('sign.index');
        }

        $token = $request->session()->get('sign_token');

        if (! $token) {
            Log::channel('cubsign')->warning('Editor: no sign_token in session — redirecting to upload', [
                'ip' => $request->ip(),
            ]);

            return redirect()->route('sign.index');
        }

        $session = $this->repository->findByToken($token);

        if (! $session) {
            Log::channel('cubsign')->warning('Editor: sign_token not found in DB — redirecting to upload', [
                'token' => '…' . substr($token, -8),
                'ip'    => $request->ip(),
            ]);

            return redirect()->route('sign.index');
        }

        Log::channel('cubsign')->info('Editor loaded', [
            'token'    => '…' . substr($token, -8),
            'filename' => $session->original_filename,
            'size'     => $session->file_size,
            'status'   => $session->status,
            'user_id'  => $session->user_id,
        ]);

        return Inertia::render('Sign/Editor', [
            'session' => [
                'token'    => $session->token,
                'filename' => $session->original_filename,
                'fileSize' => $session->file_size,
                'pdfUrl'   => route('sign.pdf'),
            ],
        ]);
    }
}
