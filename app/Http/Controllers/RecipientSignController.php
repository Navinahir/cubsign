<?php

namespace App\Http\Controllers;

use App\Mail\RecipientInvitationMail;
use App\Models\DocumentActivity;
use App\Models\Recipient;
use App\Services\SignedPdfService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class RecipientSignController extends Controller
{
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

            DocumentActivity::create([
                'document_id'  => $document->id,
                'recipient_id' => $next->id,
                'event'        => 'recipient_notified',
                'meta'         => ['name' => $next->name, 'email' => $next->email],
            ]);

            try {
                $next->load('document.user');
                Mail::to($next->email)->send(new RecipientInvitationMail($next));
            } catch (\Throwable $e) {
                Log::error('RecipientInvitationMail failed (next recipient)', [
                    'recipient_id' => $next->id,
                    'error'        => $e->getMessage(),
                ]);
            }
        } else {
            $document->update(['status' => 'completed']);

            DocumentActivity::create([
                'document_id'  => $document->id,
                'recipient_id' => null,
                'event'        => 'document_completed',
                'meta'         => [],
            ]);

            // Generate the final signed PDF with all recipient signatures overlaid
            try {
                $document->load('recipients');
                $signedPath = (new SignedPdfService())->generate($document);
                if ($signedPath) {
                    $document->update(['signed_pdf_path' => $signedPath]);
                }
            } catch (\Throwable $e) {
                Log::error('SignedPdfService failed', [
                    'document_id' => $document->id,
                    'error'       => $e->getMessage(),
                ]);
            }
        }

        return response()->json(['ok' => true]);
    }
}
