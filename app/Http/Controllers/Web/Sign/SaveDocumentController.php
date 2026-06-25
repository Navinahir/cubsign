<?php

namespace App\Http\Controllers\Web\Sign;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Repositories\DocumentRepository;
use App\Repositories\SignSessionRepository;
use App\Services\PdfNormalizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SaveDocumentController extends Controller
{
    public function __construct(
        private readonly SignSessionRepository $signRepo,
        private readonly DocumentRepository   $docRepo,
        private readonly PdfNormalizer        $pdfNormalizer,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        Log::channel('cubsign')->info('SAVE_DOCUMENT_HIT', [
            'user_id'    => $request->user()?->id,
            'has_pdf'    => $request->hasFile('pdf'),
            'sign_token' => $request->session()->get('sign_token') ? '…' . substr((string) $request->session()->get('sign_token'), -8) : null,
        ]);

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

        Log::channel('cubsign')->info('PDF_RECEIVED', [
            'original_name' => $request->file('pdf')?->getClientOriginalName(),
            'size'          => $request->file('pdf')?->getSize(),
            'mime'          => $request->file('pdf')?->getMimeType(),
        ]);

        $dir      = "documents/user_{$user->id}";
        $stem     = pathinfo($session->original_filename, PATHINFO_FILENAME);
        $filename = $stem . '-' . time() . '.pdf';
        $path     = $request->file('pdf')->storeAs($dir, $filename, 'documents');
        $this->ensureFpdiCompatible($path);

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

            $editorStateAfter = $document->fresh()->editor_state ?? [];
            $placedCount      = count($editorStateAfter['placedFields'] ?? []);

            Log::channel('cubsign')->info('EDITOR_STATE_SAVED', [
                'document_id'         => $document->id,
                'placed_fields_count' => $placedCount,
                'recipient_count'     => count($editorStateAfter['recipients'] ?? []),
                'context'             => 'save_document',
            ]);

            Log::channel('cubsign')->info('DOCUMENT_CREATED', [
                'document_id' => $document->id,
                'action'      => 'updated',
            ]);
        } else {
            $document = $this->docRepo->createSignedDocument(
                user:     $user,
                filename: $session->original_filename,
                path:     $path,
            );

            Log::channel('cubsign')->info('DOCUMENT_CREATED', [
                'document_id' => $document->id,
                'action'      => 'inserted',
            ]);
        }

        Log::channel('cubsign')->info('PDF_PATH_SET', [
            'document_id' => $document->id,
            'pdf_path'    => $path,
            'status'      => $document->fresh()->status,
        ]);

        Log::channel('cubsign')->info('Document auto-saved', [
            'document_id' => $document->id,
            'user_id'     => $user->id,
            'filename'    => $session->original_filename,
        ]);

        $request->session()->put('sign_document_id', $document->id);

        return response()->json(['id' => $document->id]);
    }

    /**
     * pdf-lib may emit object streams (PDF 1.5+) that FPDI's free parser cannot read.
     */
    private function ensureFpdiCompatible(string $relPath): void
    {
        $absPath = \Illuminate\Support\Facades\Storage::disk('documents')->path($relPath);

        if ($this->fpdiCanOpen($absPath)) {
            return;
        }

        $normalized = $this->pdfNormalizer->normalize($absPath);
        if ($normalized === null) {
            Log::channel('cubsign')->warning('SaveDocumentController: PDF normalization failed', [
                'pdf_path' => $relPath,
            ]);

            return;
        }

        if (! @copy($normalized['path'], $absPath)) {
            Log::channel('cubsign')->warning('SaveDocumentController: failed to replace PDF with normalized copy', [
                'pdf_path' => $relPath,
            ]);
        }

        @unlink($normalized['path']);

        Log::channel('cubsign')->info('SaveDocumentController: PDF normalized for FPDI', [
            'pdf_path' => $relPath,
            'method'   => $normalized['method'],
        ]);
    }

    private function fpdiCanOpen(string $absPath): bool
    {
        try {
            $probe = new \setasign\Fpdi\Fpdi('P', 'pt');
            $probe->setSourceFile($absPath);

            return true;
        } catch (\Throwable) {
            return false;
        }
    }
}
