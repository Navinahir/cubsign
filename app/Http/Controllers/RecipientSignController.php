<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentActivity;
use App\Models\Recipient;
use App\Services\RecipientNotificationService;
use App\Services\SignedPdfService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class RecipientSignController extends Controller
{
    public function __construct(
        private readonly RecipientNotificationService $notificationService,
    ) {}

    public function show(string $token): Response
    {
        $recipient = Recipient::with('document')
            ->where('sign_token', $token)
            ->firstOrFail();

        $document = $recipient->document;

        // Guard against soft-deleted documents
        if (! $document) {
            abort(404);
        }

        $editorState = $document->editor_state ?? [];
        $allFields   = $editorState['placedFields'] ?? [];

        // Fields are stored with 'signerId' key (local editor recipient id)
        $myFields = array_values(array_filter(
            $allFields,
            fn ($f) => ($f['signerId'] ?? null) === $recipient->editor_recipient_id
        ));

        return Inertia::render('RecipientSign', [
            'token'        => $token,
            'recipient'    => $recipient->only([
                'id', 'name', 'email', 'color',
                'signing_order', 'editor_recipient_id', 'status', 'signed_at',
            ]),
            'document'     => $document->only(['id', 'name']),
            'fields'       => $myFields,
            'alreadySigned' => $recipient->status === 'signed',
            'notYetTurn'   => $recipient->status === 'pending',
        ]);
    }

    public function pdf(string $token): BinaryFileResponse
    {
        $recipient = Recipient::with('document')
            ->where('sign_token', $token)
            ->firstOrFail();

        if ($recipient->status === 'pending') {
            abort(403, 'Not your turn to sign yet');
        }

        $document = $recipient->document;

        if (! $document || ! $document->pdf_path || ! Storage::disk('documents')->exists($document->pdf_path)) {
            abort(404);
        }

        return response()->file(
            Storage::disk('documents')->path($document->pdf_path),
            [
                'Content-Type'        => 'application/pdf',
                'Content-Disposition' => 'inline',
                'Cache-Control'       => 'no-store',
            ]
        );
    }

    public function complete(Request $request, string $token): JsonResponse
    {
        $recipient = Recipient::with('document')
            ->where('sign_token', $token)
            ->firstOrFail();

        if ($recipient->status === 'signed') {
            return response()->json(['error' => 'Already signed'], 422);
        }

        if ($recipient->status === 'pending') {
            return response()->json(['error' => 'Not your turn to sign yet'], 422);
        }

        $document = $recipient->document;

        if (! $document) {
            return response()->json(['error' => 'Document not found'], 404);
        }

        $validated = $request->validate([
            'signed_fields'         => ['nullable', 'array'],
            'signed_fields.*.id'    => ['sometimes', 'integer'],
            'signed_fields.*.type'  => ['sometimes', 'string'],
            'signed_fields.*.value' => ['sometimes', 'nullable'],
        ]);

        $allowedFieldIds = $this->allowedFieldIdsForRecipient($document, $recipient);

        $submittedIds = collect($validated['signed_fields'] ?? [])
            ->pluck('id')
            ->filter(fn ($id) => $id !== null)
            ->map(fn ($id) => (int) $id)
            ->values()
            ->all();

        $invalidIds = array_diff($submittedIds, $allowedFieldIds);

        if ($invalidIds !== []) {
            Log::channel('cubsign')->warning('Recipient submitted fields not assigned to them', [
                'recipient_id' => $recipient->id,
                'document_id'  => $document->id,
                'invalid_ids'  => array_values($invalidIds),
            ]);

            return response()->json([
                'message' => 'One or more fields are not assigned to you.',
                'errors'  => ['signed_fields' => ['Invalid field submission.']],
            ], 422);
        }

        $recipient->update([
            'status'        => 'signed',
            'signed_at'     => now(),
            'signed_fields' => $validated['signed_fields'] ?? [],
        ]);

        DocumentActivity::create([
            'document_id'  => $recipient->document_id,
            'recipient_id' => $recipient->id,
            'event'        => 'recipient_signed',
            'meta'         => ['name' => $recipient->name, 'email' => $recipient->email],
        ]);

        // Sequential signing: activate the next pending recipient, or complete the document
        $next = $document->recipients()
            ->where('status', 'pending')
            ->orderBy('signing_order')
            ->orderBy('id')
            ->first();

        if ($next) {
            $next->update(['status' => 'sent']);
            $this->notificationService->sendInvitation($next);
        } else {
            $signedPath = null;

            try {
                $document->load('recipients');
                $signedPath = (new SignedPdfService())->generate($document);
            } catch (\Throwable $e) {
                Log::channel('cubsign')->error('SignedPdfService failed', [
                    'document_id' => $document->id,
                    'error'       => $e->getMessage(),
                ]);
            }

            if ($signedPath) {
                $document->update([
                    'status'          => 'completed',
                    'signed_pdf_path' => $signedPath,
                ]);

                DocumentActivity::create([
                    'document_id'  => $document->id,
                    'recipient_id' => null,
                    'event'        => 'document_completed',
                    'meta'         => [],
                ]);
            } else {
                Log::channel('cubsign')->error('Document not marked completed — final signed PDF generation failed', [
                    'document_id' => $document->id,
                ]);

                DocumentActivity::create([
                    'document_id'  => $document->id,
                    'recipient_id' => null,
                    'event'        => 'signed_pdf_failed',
                    'meta'         => [
                        'message' => 'Final signed PDF could not be generated. All recipients have signed.',
                    ],
                ]);
            }
        }

        return response()->json(['ok' => true]);
    }

    /**
     * Field IDs from editor_state that belong to this recipient.
     *
     * @return list<int>
     */
    private function allowedFieldIdsForRecipient(Document $document, Recipient $recipient): array
    {
        $placedFields = ($document->editor_state ?? [])['placedFields'] ?? [];

        return collect($placedFields)
            ->filter(fn ($f) => ($f['signerId'] ?? null) === $recipient->editor_recipient_id)
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->values()
            ->all();
    }
}
