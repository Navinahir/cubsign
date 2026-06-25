<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentActivity;
use App\Models\Recipient;
use App\Services\PlacedFieldsService;
use App\Services\RecipientNotificationService;
use App\Services\RecipientSignatureStorage;
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
        private readonly RecipientSignatureStorage $signatureStorage,
        private readonly PlacedFieldsService $placedFieldsService,
    ) {}

    public function show(string $token): Response
    {
        $recipient = Recipient::with('document')
            ->where('sign_token', $token)
            ->firstOrFail();

        $document = $recipient->document;

        if (! $document) {
            abort(404);
        }

        $editorState = $document->editor_state ?? [];
        $allFields   = $editorState['placedFields'] ?? [];

        $myFields = $this->placedFieldsService->fieldsForSigner(
            $allFields,
            $recipient->editor_recipient_id,
        );

        Log::channel('cubsign')->info('RECIPIENT_FIELDS', $this->placedFieldsService->logPayload(
            $document->id,
            $recipient->id,
            $allFields,
            $recipient->editor_recipient_id,
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

        // LOG A
        Log::channel('cubsign')->info('LOG A: RecipientSignController complete started', [
            'recipient_id'     => $recipient->id,
            'recipient_status' => $recipient->status,
            'document_id'      => $recipient->document_id,
            'token_suffix'     => '…' . substr($token, -8),
        ]);

        if ($recipient->status === 'signed') {
            Log::channel('cubsign')->warning('LOG A: complete aborted — recipient already signed', [
                'recipient_id' => $recipient->id,
            ]);

            return response()->json(['error' => 'Already signed'], 422);
        }

        if ($recipient->status === 'pending') {
            Log::channel('cubsign')->warning('LOG A: complete aborted — not recipient turn', [
                'recipient_id' => $recipient->id,
            ]);

            return response()->json(['error' => 'Not your turn to sign yet'], 422);
        }

        $document = $recipient->document;

        if (! $document) {
            Log::channel('cubsign')->error('LOG A: complete aborted — document not found', [
                'recipient_id' => $recipient->id,
            ]);

            return response()->json(['error' => 'Document not found'], 404);
        }

        $validated = $request->validate([
            'signed_fields'         => ['nullable', 'array'],
            'signed_fields.*.id'    => ['sometimes', 'integer'],
            'signed_fields.*.type'  => ['sometimes', 'string'],
            'signed_fields.*.value' => ['sometimes', 'nullable'],
        ]);

        // LOG B
        Log::channel('cubsign')->info('LOG B: signed_fields count', [
            'document_id'        => $document->id,
            'recipient_id'       => $recipient->id,
            'signed_fields_count'=> count($validated['signed_fields'] ?? []),
            'field_types'        => collect($validated['signed_fields'] ?? [])->pluck('type')->all(),
        ]);

        foreach ($validated['signed_fields'] ?? [] as $idx => $field) {
            $val = $field['value'] ?? '';
            Log::channel('cubsign')->debug('RecipientSignController::complete field', [
                'index'         => $idx,
                'id'            => $field['id'] ?? null,
                'type'          => $field['type'] ?? null,
                'value_length'  => is_string($val) ? strlen($val) : null,
                'value_preview' => is_string($val) ? substr($val, 0, 40) : gettype($val),
            ]);
        }

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

        $persistedFields = $this->signatureStorage->persistImages(
            $recipient,
            $validated['signed_fields'] ?? [],
        );

        $recipient->update([
            'status'        => 'signed',
            'signed_at'     => now(),
            'signed_fields' => $persistedFields,
        ]);

        Log::channel('cubsign')->info('RecipientSignController::complete recipient saved', [
            'recipient_id'  => $recipient->id,
            'document_id'   => $document->id,
            'fields_stored' => count($persistedFields),
            'signed_at'     => $recipient->signed_at?->toIso8601String(),
        ]);

        DocumentActivity::create([
            'document_id'  => $recipient->document_id,
            'recipient_id' => $recipient->id,
            'event'        => 'recipient_signed',
            'meta'         => ['name' => $recipient->name, 'email' => $recipient->email],
        ]);

        $next = $document->recipients()
            ->where('status', 'pending')
            ->orderBy('signing_order')
            ->orderBy('id')
            ->first();

        if ($next) {
            $next->update(['status' => 'sent']);
            $this->notificationService->sendInvitation($next);

            Log::channel('cubsign')->info('RecipientSignController::complete — SignedPdfService NOT called (more recipients pending)', [
                'document_id'       => $document->id,
                'document_status'   => $document->fresh()->status,
                'next_recipient_id' => $next->id,
                'pending_count'     => $document->recipients()->where('status', 'pending')->count(),
            ]);
        } else {
            $document->refresh();
            $document->load('recipients');

            // LOG E (before PDF generation / document update)
            Log::channel('cubsign')->info('LOG E: document status before update', [
                'document_id'     => $document->id,
                'status'          => $document->status,
                'pdf_path'        => $document->pdf_path,
                'signed_pdf_path' => $document->signed_pdf_path,
                'recipients_signed'=> $document->recipients->where('status', 'signed')->count(),
                'recipients_total' => $document->recipients->count(),
            ]);

            $signedPath = null;

            // LOG C
            Log::channel('cubsign')->info('LOG C: calling SignedPdfService', [
                'document_id' => $document->id,
            ]);

            try {
                $signedPath = (new SignedPdfService())->generate($document);
            } catch (\Throwable $e) {
                Log::channel('cubsign')->error('SignedPdfService threw exception', [
                    'document_id' => $document->id,
                    'error'       => $e->getMessage(),
                    'class'       => $e::class,
                    'file'        => $e->getFile(),
                    'line'        => $e->getLine(),
                    'trace'       => $e->getTraceAsString(),
                ]);
            }

            // LOG D
            Log::channel('cubsign')->info('LOG D: SignedPdfService returned', [
                'document_id' => $document->id,
                'signedPath'  => $signedPath,
                'is_null'     => $signedPath === null,
            ]);

            if ($signedPath) {
                $document->update([
                    'status'          => 'completed',
                    'signed_pdf_path' => $signedPath,
                ]);

                $document->refresh();

                // LOG F + LOG G
                Log::channel('cubsign')->info('LOG F: document status after update', [
                    'document_id' => $document->id,
                    'status'      => $document->status,
                ]);
                Log::channel('cubsign')->info('LOG G: signed_pdf_path after update', [
                    'document_id'     => $document->id,
                    'signed_pdf_path'=> $document->signed_pdf_path,
                    'file_exists'   => Storage::disk('documents')->exists($document->signed_pdf_path ?? ''),
                    'absolute_path' => $document->signed_pdf_path
                        ? Storage::disk('documents')->path($document->signed_pdf_path)
                        : null,
                ]);

                DocumentActivity::create([
                    'document_id'  => $document->id,
                    'recipient_id' => null,
                    'event'        => 'document_completed',
                    'meta'         => ['signed_pdf_path' => $signedPath],
                ]);
            } else {
                $document->refresh();

                Log::channel('cubsign')->error('LOG D: signedPath is null — document NOT marked completed', [
                    'document_id'     => $document->id,
                    'status'          => $document->status,
                    'pdf_path'        => $document->pdf_path,
                    'signed_pdf_path' => $document->signed_pdf_path,
                ]);

                Log::channel('cubsign')->info('LOG F: document status after update (unchanged)', [
                    'document_id' => $document->id,
                    'status'      => $document->status,
                ]);
                Log::channel('cubsign')->info('LOG G: signed_pdf_path after update (unchanged)', [
                    'document_id'      => $document->id,
                    'signed_pdf_path'  => $document->signed_pdf_path,
                    'signed_dir_exists'=> Storage::disk('documents')->exists("signed/user_{$document->user_id}"),
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

        $final = $document->fresh();

        Log::channel('cubsign')->info('RecipientSignController::complete finished', [
            'document_id'     => $final->id,
            'status'          => $final->status,
            'pdf_path'        => $final->pdf_path,
            'signed_pdf_path' => $final->signed_pdf_path,
        ]);

        return response()->json(['ok' => true]);
    }

    /**
     * @return list<int>
     */
    private function allowedFieldIdsForRecipient(Document $document, Recipient $recipient): array
    {
        $placedFields = ($document->editor_state ?? [])['placedFields'] ?? [];

        return collect($this->placedFieldsService->fieldsForSigner($placedFields, $recipient->editor_recipient_id))
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->values()
            ->all();
    }
}
