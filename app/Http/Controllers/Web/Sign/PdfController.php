<?php

namespace App\Http\Controllers\Web\Sign;

use App\Http\Controllers\Controller;
use App\Repositories\SignSessionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PdfController extends Controller
{
    public function __construct(private readonly SignSessionRepository $repository) {}

    public function __invoke(Request $request): BinaryFileResponse
    {
        $token = $request->session()->get('sign_token');

        abort_if(! $token, 404);

        $session = $this->repository->findByToken($token);

        abort_if(! $session, 404);

        return response()->file(
            Storage::disk('local')->path($session->disk_path),
            [
                'Content-Type'        => 'application/pdf',
                'Content-Disposition' => 'inline',
                'Cache-Control'       => 'no-store',
            ]
        );
    }
}
