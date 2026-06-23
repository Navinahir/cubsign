<?php

namespace App\Http\Controllers\Web\Workspace;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DocumentsController extends Controller
{
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

    private function gate(Document $document): void
    {
        if ($document->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
