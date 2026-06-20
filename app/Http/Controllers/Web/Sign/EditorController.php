<?php

namespace App\Http\Controllers\Web\Sign;

use App\Http\Controllers\Controller;
use App\Repositories\SignSessionRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EditorController extends Controller
{
    public function __construct(private readonly SignSessionRepository $repository) {}

    public function __invoke(Request $request): Response|RedirectResponse
    {
        $token = $request->session()->get('sign_token');

        if (! $token) {
            return redirect()->route('sign.index');
        }

        $session = $this->repository->findByToken($token);

        if (! $session) {
            return redirect()->route('sign.index');
        }

        return Inertia::render('Sign/Editor', [
            'session' => [
                'token'    => $session->token,
                'filename' => $session->original_filename,
                'fileSize' => $session->file_size,
            ],
        ]);
    }
}
