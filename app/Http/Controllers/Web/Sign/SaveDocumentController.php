<?php

namespace App\Http\Controllers\Web\Sign;

use App\Http\Controllers\Controller;
use App\Models\Document;
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
        $path     = $request->file('pdf')->storeAs($dir, $filename, 'documents');

        $sessionDocumentId = $request->session()->get('sign_document_id');

        $document = null;
        if ($sessionDocumentId) {
            $document = Document::where('user_id', $user->id)
                ->where('id', $sessionDocumentId)
                ->whereIn('status', ['draft', 'signed'])
                ->first();
        }

        if (! $document) {
            $document = Document::where('sign_token', $token)
                ->where('user_id', $user->id)
                ->where('status', 'draft')
                ->first();
        }

        if ($document) {
            $editorState = $document->editor_state ?? [];
            $hasPlacedFields = ! empty($editorState['placedFields']);
            $hasRecipientConfig = ! empty($editorState['recipients']);
            $hasUnsignedRecipients = $document->recipients()
                ->where('status', '!=', 'signed')
                ->exists();
            $allRecipientsSigned = $document->recipients()->exists()
                && ! $hasUnsignedRecipients;

            if ($hasPlacedFields || $hasRecipientConfig) {
                $editorStateValue = $document->editor_state;
            } elseif ($document->recipients()->exists() && $allRecipientsSigned) {
                $editorStateValue = null;
            } else {
                $editorStateValue = $document->editor_state;
            }

            $update = [
                'status'       => 'signed',
                'pdf_path'     => $path,
                'editor_state' => $editorStateValue,
            ];

            if ($document->status === 'draft') {
                $update['sign_token'] = null;
            }

            $document->update($update);
        } else {
            $document = $this->docRepo->createSignedDocument(
                user:     $user,
                filename: $session->original_filename,
                path:     $path,
            );
        }

        Log::channel('cubsign')->info('Document auto-saved', [
            'document_id' => $document->id,
            'user_id'     => $user->id,
            'filename'    => $session->original_filename,
        ]);

        $request->session()->put('sign_document_id', $document->id);

        return response()->json(['id' => $document->id]);
    }
}
