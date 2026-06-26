<?php

namespace App\Http\Controllers\Web\Workspace;

use App\Enums\SignSessionStatus;
use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\SignSession;
use App\Models\Template;
use App\Support\TemplateEditorState;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class TemplatesController extends Controller
{
    public function index(Request $request): Response
    {
        $this->forgetSignDocumentSession($request);

        $templates = auth()->user()
            ->templates()
            ->latest()
            ->get()
            ->map(fn($t) => [
                'id'          => $t->id,
                'name'        => $t->name,
                'created_at'  => $t->created_at,
                'updated_at'  => $t->updated_at,
                'field_count' => count(TemplateEditorState::sanitize($t->editor_state)['placedFields'] ?? []),
                'pdf_missing' => !Storage::disk('documents')->exists($t->pdf_path),
            ]);

        return Inertia::render('Workspace/Templates', [
            'templates' => $templates,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->forgetSignDocumentSession($request);

        return Inertia::render('Workspace/TemplateCreate');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'pdf'  => ['required', 'file', 'mimes:pdf', 'max:20480'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $path = $request->file('pdf')->store('templates', 'documents');

        $template = Template::create([
            'user_id'  => auth()->id(),
            'name'     => $request->name,
            'pdf_path' => $path,
        ]);

        return redirect()->route('templates.edit', $template);
    }

    public function show(Template $template, Request $request): Response
    {
        $this->gate($template);
        $this->forgetSignDocumentSession($request);

        return Inertia::render('Workspace/TemplateShow', [
            'template' => [
                'id'          => $template->id,
                'name'        => $template->name,
                'pdf_missing' => !Storage::disk('documents')->exists($template->pdf_path),
                'created_at'  => $template->created_at,
                'updated_at'  => $template->updated_at,
                'field_count' => count(TemplateEditorState::sanitize($template->editor_state)['placedFields'] ?? []),
            ],
        ]);
    }

    public function edit(Template $template, Request $request): Response
    {
        $this->gate($template);

        // Isolate template workflow from any in-progress signing document session.
        $this->forgetSignDocumentSession($request);

        $editorState = TemplateEditorState::sanitize($template->editor_state);
        $pdfExists   = Storage::disk('documents')->exists($template->pdf_path);

        return Inertia::render('Workspace/TemplateEdit', [
            'template' => [
                'id'          => $template->id,
                'name'        => $template->name,
                'pdfUrl'      => route('templates.pdf', $template),
                'fileSize'    => $pdfExists ? Storage::disk('documents')->size($template->pdf_path) : 0,
                'editorState' => $editorState,
            ],
        ]);
    }

    public function preview(Template $template, Request $request): Response|RedirectResponse
    {
        $this->gate($template);

        $this->forgetSignDocumentSession($request);

        if (! Storage::disk('documents')->exists($template->pdf_path)) {
            return redirect()->route('templates.show', $template)
                ->withErrors(['pdf' => 'Template PDF file is missing.']);
        }

        return Inertia::render('Workspace/TemplatePreview', [
            'template' => [
                'id'          => $template->id,
                'name'        => $template->name,
                'pdfUrl'      => route('templates.pdf', $template),
                'editorState' => TemplateEditorState::sanitize($template->editor_state),
            ],
        ]);
    }

    public function pdf(Template $template): BinaryFileResponse
    {
        $this->gate($template);

        if (!Storage::disk('documents')->exists($template->pdf_path)) {
            abort(404, 'Template PDF file is missing.');
        }

        return response()->file(
            Storage::disk('documents')->path($template->pdf_path),
            [
                'Content-Type'        => 'application/pdf',
                'Content-Disposition' => 'inline',
                'Cache-Control'       => 'no-store',
            ]
        );
    }

    public function update(Request $request, Template $template): RedirectResponse
    {
        $this->gate($template);

        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'editor_state' => ['nullable', 'array'],
            'editor_state.placedFields' => ['nullable', 'array', 'max:' . TemplateEditorState::MAX_FIELDS],
            'editor_state.placedFields.*.type' => ['required_with:editor_state.placedFields', 'string', Rule::in(TemplateEditorState::ALLOWED_TYPES)],
            'editor_state.placedFields.*.pageNum' => ['nullable', 'integer', 'min:1', 'max:999'],
            'editor_state.placedFields.*.x' => ['nullable', 'numeric', 'min:0', 'max:10000'],
            'editor_state.placedFields.*.y' => ['nullable', 'numeric', 'min:0', 'max:10000'],
            'editor_state.placedFields.*.w' => ['nullable', 'numeric', 'min:1', 'max:2000'],
            'editor_state.placedFields.*.h' => ['nullable', 'numeric', 'min:1', 'max:2000'],
            'editor_state.placedFields.*.label' => ['nullable', 'string', 'max:' . TemplateEditorState::MAX_LABEL_LENGTH],
            'editor_state.placedFields.*.required' => ['nullable', 'boolean'],
            'editor_state.scale' => ['nullable', 'numeric', 'min:0.4', 'max:3'],
            'editor_state.activePage' => ['nullable', 'integer', 'min:1'],
        ]);

        $validated['editor_state'] = TemplateEditorState::sanitize($validated['editor_state'] ?? null);

        $template->update($validated);

        return redirect()->route('templates.show', $template);
    }

    public function replacePdf(Request $request, Template $template): RedirectResponse
    {
        $this->gate($template);

        $request->validate([
            'pdf' => ['required', 'file', 'mimes:pdf', 'max:20480'],
        ]);

        // Delete old file if it still exists
        if (Storage::disk('documents')->exists($template->pdf_path)) {
            Storage::disk('documents')->delete($template->pdf_path);
        }

        $path = $request->file('pdf')->store('templates', 'documents');
        $template->update([
            'pdf_path'     => $path,
            'editor_state' => null,  // clear field placements — they were for the old PDF
        ]);

        return redirect()->route('templates.edit', $template)
            ->with('success', 'PDF replaced. Please re-place your signature fields.');
    }

    public function duplicate(Template $template): RedirectResponse
    {
        $this->gate($template);

        if (!Storage::disk('documents')->exists($template->pdf_path)) {
            return redirect()->back()->withErrors(['pdf' => 'Template PDF file is missing. Please re-upload this template.']);
        }

        $newPath = 'templates/' . Str::random(40) . '.pdf';
        Storage::disk('documents')->copy($template->pdf_path, $newPath);

        $copy = Template::create([
            'user_id'      => auth()->id(),
            'name'         => $template->name . ' (Copy)',
            'pdf_path'     => $newPath,
            'editor_state' => TemplateEditorState::sanitize($template->editor_state),
        ]);

        return redirect()->route('templates.show', $copy);
    }

    public function destroy(Template $template): RedirectResponse
    {
        $this->gate($template);

        if (Storage::disk('documents')->exists($template->pdf_path)) {
            Storage::disk('documents')->delete($template->pdf_path);
        }
        $template->delete();

        return redirect()->route('templates.index');
    }

    public function useTemplate(Template $template): RedirectResponse
    {
        $this->gate($template);

        if (!Storage::disk('documents')->exists($template->pdf_path)) {
            return redirect()->back()->withErrors(['pdf' => 'Template PDF file is missing. Please delete this template and create a new one.']);
        }

        $user  = auth()->user();
        $token = Str::random(40);

        $diskPath = 'sign/' . $token . '.pdf';

        // Ensure the sign directory exists (may be absent on a fresh install)
        Storage::disk('documents')->makeDirectory('sign');
        Storage::disk('documents')->copy($template->pdf_path, $diskPath);

        $fileSize = Storage::disk('documents')->size($diskPath);
        $cleanState = TemplateEditorState::forSignDocument($template->editor_state);

        $document = DB::transaction(function () use ($user, $token, $diskPath, $fileSize, $template, $cleanState) {
            SignSession::create([
                'token'             => $token,
                'original_filename' => $template->name . '.pdf',
                'disk_path'         => $diskPath,
                'file_size'         => $fileSize,
                'status'            => SignSessionStatus::Uploaded->value,
                'user_id'           => $user->id,
                'ip_address'        => request()->ip(),
            ]);

            return Document::create([
                'user_id'      => $user->id,
                'name'         => $template->name,
                'status'       => 'draft',
                'sign_token'   => $token,
                'editor_state' => $cleanState,
            ]);
        });

        session([
            'sign_token'       => $token,
            'sign_document_id' => $document->id,
        ]);

        return redirect()->route('sign.editor');
    }

    private function gate(Template $template): void
    {
        if ($template->user_id !== auth()->id()) {
            abort(403);
        }
    }

    private function forgetSignDocumentSession(Request $request): void
    {
        $request->session()->forget('sign_document_id');
    }
}
