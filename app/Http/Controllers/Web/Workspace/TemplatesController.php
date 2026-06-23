<?php

namespace App\Http\Controllers\Web\Workspace;

use App\Enums\SignSessionStatus;
use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\SignSession;
use App\Models\Template;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class TemplatesController extends Controller
{
    public function index(): Response
    {
        $templates = auth()->user()
            ->templates()
            ->latest()
            ->get()
            ->map(fn($t) => [
                'id'          => $t->id,
                'name'        => $t->name,
                'created_at'  => $t->created_at,
                'updated_at'  => $t->updated_at,
                'field_count' => count($t->editor_state['placedFields'] ?? []),
            ]);

        return Inertia::render('Workspace/Templates', [
            'templates' => $templates,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Workspace/TemplateCreate');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'pdf'  => ['required', 'file', 'mimes:pdf', 'max:20480'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $path = $request->file('pdf')->store('templates');

        $template = Template::create([
            'user_id'  => auth()->id(),
            'name'     => $request->name,
            'pdf_path' => $path,
        ]);

        return redirect()->route('templates.edit', $template);
    }

    public function show(Template $template): Response
    {
        $this->gate($template);

        return Inertia::render('Workspace/TemplateShow', [
            'template' => [
                'id'          => $template->id,
                'name'        => $template->name,
                'pdf_path'    => $template->pdf_path,
                'created_at'  => $template->created_at,
                'updated_at'  => $template->updated_at,
                'field_count' => count($template->editor_state['placedFields'] ?? []),
            ],
        ]);
    }

    public function edit(Template $template): Response
    {
        $this->gate($template);

        return Inertia::render('Workspace/TemplateEdit', [
            'template' => [
                'id'          => $template->id,
                'name'        => $template->name,
                'pdfUrl'      => route('templates.pdf', $template),
                'editorState' => $template->editor_state,
            ],
        ]);
    }

    public function pdf(Template $template): BinaryFileResponse
    {
        $this->gate($template);

        return response()->file(
            Storage::disk('local')->path($template->pdf_path),
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
        ]);

        $template->update($validated);

        return redirect()->route('templates.show', $template);
    }

    public function duplicate(Template $template): RedirectResponse
    {
        $this->gate($template);

        $newPath = 'templates/' . Str::random(40);
        Storage::disk('local')->copy($template->pdf_path, $newPath);

        $copy = Template::create([
            'user_id'      => auth()->id(),
            'name'         => $template->name . ' (Copy)',
            'pdf_path'     => $newPath,
            'editor_state' => $template->editor_state,
        ]);

        return redirect()->route('templates.show', $copy);
    }

    public function destroy(Template $template): RedirectResponse
    {
        $this->gate($template);

        Storage::disk('local')->delete($template->pdf_path);
        $template->delete();

        return redirect()->route('templates.index');
    }

    public function useTemplate(Template $template): RedirectResponse
    {
        $this->gate($template);

        $user  = auth()->user();
        $token = Str::random(40);

        $diskPath = 'sign/' . $token . '.pdf';
        Storage::disk('local')->copy($template->pdf_path, $diskPath);

        $fileSize = Storage::disk('local')->size($diskPath);

        SignSession::create([
            'token'             => $token,
            'original_filename' => $template->name . '.pdf',
            'disk_path'         => $diskPath,
            'file_size'         => $fileSize,
            'status'            => SignSessionStatus::Uploaded->value,
            'user_id'           => $user->id,
            'ip_address'        => request()->ip(),
        ]);

        Document::create([
            'user_id'      => $user->id,
            'name'         => $template->name,
            'status'       => 'draft',
            'sign_token'   => $token,
            'editor_state' => $template->editor_state,
        ]);

        session(['sign_token' => $token]);

        return redirect()->route('sign.editor');
    }

    private function gate(Template $template): void
    {
        if ($template->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
