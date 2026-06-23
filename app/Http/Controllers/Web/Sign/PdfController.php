<?php

namespace App\Http\Controllers\Web\Sign;

use App\Http\Controllers\Controller;
use App\Repositories\SignSessionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PdfController extends Controller
{
    public function __construct(private readonly SignSessionRepository $repository) {}

    public function __invoke(Request $request): BinaryFileResponse
    {
        $token = $request->session()->get('sign_token');

        if (! $token) {
            Log::channel('cubsign')->warning('PDF serve: no sign_token in session — 404', [
                'ip' => $request->ip(),
            ]);

            abort(404);
        }

        $session = $this->repository->findByToken($token);

        if (! $session) {
            Log::channel('cubsign')->warning('PDF serve: sign_token not found in DB — 404', [
                'token' => '…' . substr($token, -8),
                'ip'    => $request->ip(),
            ]);

            abort(404);
        }

        Log::channel('cubsign')->info('PDF served', [
            'token'    => '…' . substr($token, -8),
            'filename' => $session->original_filename,
            'size'     => $session->file_size,
        ]);

        return response()->file(
            Storage::disk('documents')->path($session->disk_path),
            [
                'Content-Type'        => 'application/pdf',
                'Content-Disposition' => 'inline',
                'Cache-Control'       => 'no-store',
            ]
        );
    }
}
