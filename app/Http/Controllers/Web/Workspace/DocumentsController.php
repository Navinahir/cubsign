<?php

namespace App\Http\Controllers\Web\Workspace;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\DocumentActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DocumentsController extends Controller
{
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
            $query->where('status', $status);
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

        $validated = $request->validate(['name' => ['required', 'string', 'max:255']]);
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

        if ($document->status !== 'draft') {
            return response()->json(['error' => 'Not a draft'], 422);
        }

        $validated = $request->validate(['state' => ['required', 'array']]);
        $document->update(['editor_state' => $validated['state']]);

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

        $validated = $request->validate([
            'recipients'                        => ['required', 'array', 'min:1'],
            'recipients.*.name'                 => ['required', 'string', 'max:255'],
            'recipients.*.email'                => ['required', 'email', 'max:255'],
            'recipients.*.color'                => ['nullable', 'string', 'max:10'],
            'recipients.*.signing_order'        => ['nullable', 'integer', 'min:1'],
            'recipients.*.editor_recipient_id'  => ['required', 'integer'],
        ]);

        $document->recipients()->delete();

        // Sort by signing_order so the first in sequence gets status='sent'; rest start as 'pending'
        $sorted = collect($validated['recipients'])
            ->sortBy(fn ($r) => $r['signing_order'] ?? 1)
            ->values();

        foreach ($sorted as $idx => $data) {
            $document->recipients()->create([
                'name'                => $data['name'],
                'email'               => $data['email'],
                'color'               => $data['color']         ?? '#3B82F6',
                'signing_order'       => $data['signing_order'] ?? 1,
                'editor_recipient_id' => $data['editor_recipient_id'],
                'status'              => $idx === 0 ? 'sent' : 'pending',
                'sign_token'          => Str::random(40),
            ]);
        }

        DocumentActivity::create([
            'document_id'  => $document->id,
            'recipient_id' => null,
            'event'        => 'sent',
            'meta'         => ['recipient_count' => count($validated['recipients'])],
        ]);

        return response()->json(['ok' => true]);
    }

    private function gate(Document $document): void
    {
        if ($document->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
