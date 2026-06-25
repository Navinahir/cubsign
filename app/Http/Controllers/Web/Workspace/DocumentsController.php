<?php

namespace App\Http\Controllers\Web\Workspace;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\DocumentActivity;
use App\Services\PlacedFieldsService;
use App\Services\RecipientNotificationService;
use App\Services\RequestSigningValidator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DocumentsController extends Controller
{
    public function __construct(
        private readonly RecipientNotificationService $notificationService,
        private readonly PlacedFieldsService $placedFieldsService,
        private readonly RequestSigningValidator $signingValidator,
    ) {}

    public function show(Document $document): Response
    {
        $this->gate($document);

        return Inertia::render('Workspace/DocumentShow', [
            'document'   => $document->only(['id', 'name', 'status', 'pdf_path', 'created_at', 'updated_at']),
            'recipients' => $document->recipients()
                ->get(['id', 'name', 'email', 'color', 'status', 'signing_order', 'signed_at']),
            'activities' => $document->activities()
                ->get(['id', 'event', 'meta', 'recipient_id', 'created_at']),
        ]);
    }

    public function index(Request $request): Response
    {
        $query = $request->user()->documents();

        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($status = $request->get('status')) {
            if ($status === 'completed') {
                $query->whereIn('status', ['completed', 'archived']);
            } else {
                $query->where('status', $status);
            }
        }

        match ($request->get('sort', 'newest')) {
            'oldest' => $query->oldest(),
            'az'     => $query->orderBy('name'),
            'za'     => $query->orderByDesc('name'),
            default  => $query->latest(),
        };

        $documents = $query
            ->paginate(10, ['id', 'name', 'status', 'pdf_path', 'created_at'])
            ->withQueryString();

        return Inertia::render('Workspace/Documents', [
            'documents' => $documents,
            'filters'   => [
                'search' => $request->get('search', ''),
                'status' => $request->get('status', ''),
                'sort'   => $request->get('sort', 'newest'),
            ],
        ]);
    }

    public function rename(Request $request, Document $document): RedirectResponse
    {
        $this->gate($document);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[^<>:"\/\\\\|?*\\x00]+$/u',
            ],
        ], [
            'name.required' => 'Filename cannot be empty.',
            'name.regex'    => 'Filename contains invalid characters.',
        ]);
        $document->update(['name' => $validated['name']]);

        return back();
    }

    public function archive(Document $document): RedirectResponse
    {
        $this->gate($document);

        $document->update(['status' => 'archived']);

        return back();
    }

    public function destroy(Document $document): RedirectResponse
    {
        $this->gate($document);

        $document->delete();

        return back();
    }

    public function saveEditorState(Request $request, Document $document): JsonResponse
    {
        $this->gate($document);

        if (! in_array($document->status, ['draft', 'signed'], true)) {
            return response()->json(['error' => 'Document is not editable'], 422);
        }

        $validated = $request->validate(['state' => ['required', 'array']]);
        $document->update(['editor_state' => $validated['state']]);

        $placedFields = $validated['state']['placedFields'] ?? [];
        $recipients   = $validated['state']['recipients'] ?? [];

        Log::channel('cubsign')->info('EDITOR_STATE_SAVED', [
            'document_id'         => $document->id,
            'placed_fields_count' => count($placedFields),
            'recipient_count'     => count($recipients),
            'signing_mode'        => $validated['state']['signingMode'] ?? null,
        ]);

        foreach ($this->placedFieldsService->recipientSummaries($placedFields, $recipients) as $recipient) {
            Log::channel('cubsign')->info('EDITOR_FIELDS', $this->placedFieldsService->logPayload(
                $document->id,
                (int) ($recipient['id'] ?? 0),
                $placedFields,
                $recipient['id'] ?? null,
            ));
        }

        return response()->json(['ok' => true]);
    }

    public function open(Document $document): RedirectResponse
    {
        $this->gate($document);

        if ($document->status !== 'draft') {
            abort(422, 'Only draft documents can be reopened.');
        }

        session(['sign_token' => $document->sign_token]);

        return redirect()->route('sign.editor');
    }

    public function send(Request $request, Document $document): JsonResponse
    {
        $this->gate($document);

        Log::channel('cubsign')->info('SEND_START', [
            'document_id' => $document->id,
            'user_id'     => auth()->id(),
        ]);

        try {
            if (in_array($document->status, ['completed', 'archived'], true)) {
                Log::channel('cubsign')->warning('SEND_FAILED', [
                    'document_id' => $document->id,
                    'reason'      => 'document_not_draft',
                ]);

                return response()->json([
                    'message' => 'Only draft documents can be prepared.',
                ], 409);
            }

            if ($document->recipients()->whereIn('status', ['sent', 'pending', 'signed'])->exists()) {
                Log::channel('cubsign')->warning('SEND_FAILED', [
                    'document_id' => $document->id,
                    'reason'      => 'already_prepared',
                ]);

                return response()->json([
                    'message' => 'Signature requests have already been sent for this document.',
                ], 409);
            }

            if (! $document->pdf_path) {
                Log::channel('cubsign')->warning('SEND_FAILED', [
                    'document_id' => $document->id,
                    'reason'      => 'pdf_not_finalized',
                ]);

                return response()->json([
                    'message' => 'Document must be finalized before requests can be sent.',
                ], 422);
            }

            $validated = $request->validate([
                'recipients'                        => ['required', 'array', 'min:1'],
                'recipients.*.name'                 => ['required', 'string', 'max:255'],
                'recipients.*.email'                => ['required', 'email', 'max:255'],
                'recipients.*.color'                => ['nullable', 'string', 'max:10'],
                'recipients.*.signing_order'        => ['nullable', 'integer', 'min:1'],
                'recipients.*.editor_recipient_id'  => ['required', 'integer'],
            ]);

            $validationErrors = $this->signingValidator->validateSendPayload($document, $validated['recipients']);
            if ($validationErrors !== []) {
                Log::channel('cubsign')->warning('SEND_FAILED', [
                    'document_id' => $document->id,
                    'reason'      => 'validation',
                    'errors'      => $validationErrors,
                ]);

                return response()->json([
                    'message' => $validationErrors[0],
                    'errors'  => $validationErrors,
                ], 422);
            }

            $placedFields = ($document->editor_state ?? [])['placedFields'] ?? [];

            foreach ($validated['recipients'] as $data) {
                $editorRecipientId = $data['editor_recipient_id'];
                Log::channel('cubsign')->info('SEND_FIELDS', $this->placedFieldsService->logPayload(
                    $document->id,
                    $editorRecipientId,
                    $placedFields,
                    $editorRecipientId,
                ));
            }

            Log::channel('cubsign')->info('SEND_FIELDS', array_merge(
                $this->placedFieldsService->logPayload($document->id, null, $placedFields),
                ['scope' => 'document', 'recipient_count' => count($validated['recipients'])],
            ));

            $document->recipients()->delete();

            $sorted = collect($validated['recipients'])
                ->sortBy(fn ($r) => $r['signing_order'] ?? 1)
                ->values();

            $firstRecipient = null;
            foreach ($sorted as $idx => $data) {
                $token = Str::random(40);

                $recipient = $document->recipients()->create([
                    'name'                => $data['name'],
                    'email'               => $data['email'],
                    'color'               => $data['color']         ?? '#3B82F6',
                    'signing_order'       => $data['signing_order'] ?? 1,
                    'editor_recipient_id' => $data['editor_recipient_id'],
                    'status'              => $idx === 0 ? 'sent' : 'pending',
                    'sign_token'          => $token,
                ]);

                Log::channel('cubsign')->info('RECIPIENT_CREATED', [
                    'document_id'         => $document->id,
                    'recipient_id'        => $recipient->id,
                    'editor_recipient_id'   => $recipient->editor_recipient_id,
                    'email'               => $recipient->email,
                    'signing_order'       => $recipient->signing_order,
                    'status'              => $recipient->status,
                ]);

                Log::channel('cubsign')->info('TOKEN_CREATED', [
                    'document_id'  => $document->id,
                    'recipient_id' => $recipient->id,
                    'token_suffix' => '…' . substr($token, -8),
                ]);

                if ($idx === 0) {
                    $firstRecipient = $recipient;
                }
            }

            DocumentActivity::create([
                'document_id'  => $document->id,
                'recipient_id' => null,
                'event'        => 'sent',
                'meta'         => ['recipient_count' => count($validated['recipients'])],
            ]);

            $mailWarning = null;

            if ($firstRecipient) {
                if (! $this->notificationService->sendInvitation($firstRecipient)) {
                    $mailWarning = 'Recipients were prepared, but the invitation email could not be sent. Please notify the recipient manually.';
                }
            }

            Log::channel('cubsign')->info('SEND_COMPLETED', [
                'document_id'      => $document->id,
                'recipient_count'  => count($validated['recipients']),
                'mail_warning'     => $mailWarning !== null,
            ]);

            $request->session()->put('sign_sent_summary', [
                'document_id'   => $document->id,
                'document_name' => $document->name,
                'recipients'    => $sorted->map(fn ($data) => [
                    'name'  => $data['name'],
                    'email' => $data['email'],
                ])->values()->all(),
                'warning' => $mailWarning,
            ]);

            $response = ['ok' => true];
            if ($mailWarning) {
                $response['warning'] = $mailWarning;
            }

            return response()->json($response);
        } catch (\Throwable $e) {
            Log::channel('cubsign')->error('SEND_FAILED', [
                'document_id' => $document->id,
                'error'       => $e->getMessage(),
                'class'       => $e::class,
            ]);

            return response()->json([
                'message' => 'Failed to prepare signing requests. Please try again.',
            ], 500);
        }
    }

    private function gate(Document $document): void
    {
        if ($document->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
