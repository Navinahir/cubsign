<?php

namespace App\Http\Controllers\Web\Sign;

use App\Http\Controllers\Controller;
use App\Repositories\DocumentRepository;
use App\Repositories\SignSessionRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SaveDocumentController extends Controller
{
    public function __construct(
        private readonly SignSessionRepository $signRepo,
        private readonly DocumentRepository   $docRepo,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $user  = $request->user();
        $token = $request->session()->get('sign_token');

        if (! $token) {
            return response()->json(['error' => 'No signing session found'], 422);
        }

        $session = $this->signRepo->findByToken($token);

        if (! $session) {
            return response()->json(['error' => 'Signing session not found'], 422);
        }

        $request->validate(['pdf' => ['required', 'file', 'mimes:pdf', 'max:51200']]);

        $dir      = "documents/user_{$user->id}";
        $stem     = pathinfo($session->original_filename, PATHINFO_FILENAME);
        $filename = $stem . '-' . time() . '.pdf';
        $path     = $request->file('pdf')->storeAs($dir, $filename);

        $document = $this->docRepo->createSignedDocument(
            user:     $user,
            filename: $session->original_filename,
            path:     $path,
        );

        Log::channel('cubsign')->info('Document auto-saved', [
            'document_id' => $document->id,
            'user_id'     => $user->id,
            'filename'    => $session->original_filename,
        ]);

        return response()->json(['id' => $document->id]);
    }
}
