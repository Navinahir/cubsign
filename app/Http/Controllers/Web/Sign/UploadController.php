<?php

namespace App\Http\Controllers\Web\Sign;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadPdfRequest;
use App\Services\SignSessionService;
use Illuminate\Http\RedirectResponse;
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
        $session = $this->service->upload(
            $request->file('pdf'),
            auth()->id(),
            $request->ip(),
        );

        $request->session()->put('sign_token', $session->token);

        return redirect()->route('sign.editor');
    }
}
