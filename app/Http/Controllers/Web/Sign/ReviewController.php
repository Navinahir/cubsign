<?php

namespace App\Http\Controllers\Web\Sign;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Repositories\SignSessionRepository;
use App\Services\PlacedFieldsService;
use App\Services\ReviewDataBuilder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function __construct(
        private readonly SignSessionRepository $repository,
        private readonly ReviewDataBuilder $reviewDataBuilder,
        private readonly PlacedFieldsService $placedFieldsService,
    ) {}

    public function __invoke(Request $request): Response|RedirectResponse
    {
        if (! auth()->check() && $request->session()->get('guest_completed')) {
            return redirect()->route('sign.index');
        }

        $token = $request->session()->get('sign_token');

        if (! $token) {
            Log::channel('cubsign')->warning('Review: no sign_token in session — redirecting to upload', [
                'ip' => $request->ip(),
            ]);

            return redirect()->route('sign.index');
        }

        $session = $this->repository->findByToken($token);

        if (! $session) {
            Log::channel('cubsign')->warning('Review: sign_token not found in DB — redirecting to upload', [
                'token' => '…' . substr($token, -8),
                'ip'    => $request->ip(),
            ]);

            return redirect()->route('sign.index');
        }

        $documentId      = null;
        $reviewData      = null;
        $alreadyPrepared = false;
        $documentFinalized = false;

        if (auth()->check()) {
            $document = $this->resolveDocument($request, $token);

            if ($document) {
                $request->session()->put('sign_document_id', $document->id);
                $documentId        = $document->id;
                $reviewData        = $this->reviewDataBuilder->fromDocument($document);
                $placedFields      = ($document->editor_state ?? [])['placedFields'] ?? [];

                foreach ($reviewData['recipients'] as $recipient) {
                    Log::channel('cubsign')->info('REVIEW_FIELDS', $this->placedFieldsService->logPayload(
                        $document->id,
                        (int) ($recipient['id'] ?? 0),
                        $placedFields,
                        $recipient['id'] ?? null,
                    ));
                }

                Log::channel('cubsign')->info('REVIEW_FIELDS', array_merge(
                    $this->placedFieldsService->logPayload($document->id, null, $placedFields),
                    ['scope' => 'document'],
                ));

                $alreadyPrepared   = $document->recipients()
                    ->whereIn('status', ['sent', 'pending', 'signed'])
                    ->exists();
                $documentFinalized = (bool) $document->pdf_path;
            }
        }

        Log::channel('cubsign')->info('Review loaded', [
            'token'       => '…' . substr($token, -8),
            'filename'    => $session->original_filename,
            'size'        => $session->file_size,
            'status'      => $session->status,
            'user_id'     => $session->user_id,
            'document_id' => $documentId,
        ]);

        return Inertia::render('Sign/Review', [
            'session' => [
                'token'    => $session->token,
                'filename' => $session->original_filename,
                'fileSize' => $session->file_size,
            ],
            'documentId'        => $documentId,
            'reviewData'        => $reviewData,
            'alreadyPrepared'   => $alreadyPrepared,
            'documentFinalized' => $documentFinalized,
        ]);
    }

    private function resolveDocument(Request $request, string $token): ?Document
    {
        $sessionDocumentId = $request->session()->get('sign_document_id');

        if ($sessionDocumentId) {
            $bySession = Document::query()
                ->where('user_id', auth()->id())
                ->where('id', $sessionDocumentId)
                ->whereIn('status', ['draft', 'signed'])
                ->first();

            if ($bySession) {
                return $bySession;
            }
        }

        return Document::query()
            ->where('user_id', auth()->id())
            ->where('sign_token', $token)
            ->whereIn('status', ['draft', 'signed'])
            ->latest('updated_at')
            ->first();
    }
}
