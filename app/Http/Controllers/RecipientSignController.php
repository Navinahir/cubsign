<?php

namespace App\Http\Controllers;

use App\Models\DocumentActivity;
use App\Models\Recipient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

        $editorState = $document->editor_state ?? [];
        $allFields   = $editorState['placedFields'] ?? [];
        $myFields    = array_values(array_filter(
            $allFields,
            fn ($f) => ($f['recipientId'] ?? null) === $recipient->editor_recipient_id
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
        ]);
    }

    public function pdf(string $token): BinaryFileResponse
    {
        $recipient = Recipient::with('document')
            ->where('sign_token', $token)
            ->firstOrFail();

        $document = $recipient->document;

        if (! $document->pdf_path || ! Storage::disk('documents')->exists($document->pdf_path)) {
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

        $document = $recipient->document;

        // Sequential signing: find the next unsigned recipient by signing_order
        $next = $document->recipients()
            ->where('signing_order', '>', $recipient->signing_order)
            ->where('status', '!=', 'signed')
            ->orderBy('signing_order')
            ->first();

        if ($next) {
            $next->update(['status' => 'sent']);

            DocumentActivity::create([
                'document_id'  => $document->id,
                'recipient_id' => $next->id,
                'event'        => 'recipient_notified',
                'meta'         => ['name' => $next->name, 'email' => $next->email],
            ]);
        } else {
            $document->update(['status' => 'completed']);

            DocumentActivity::create([
                'document_id'  => $document->id,
                'recipient_id' => null,
                'event'        => 'document_completed',
                'meta'         => [],
            ]);
        }

        return response()->json(['ok' => true]);
    }
}
