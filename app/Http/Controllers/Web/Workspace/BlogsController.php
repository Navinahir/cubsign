<?php

namespace App\Http\Controllers\Web\Workspace;

use App\Http\Controllers\Controller;
use App\Http\Requests\Workspace\StoreBlogRequest;
use App\Http\Requests\Workspace\UpdateBlogRequest;
use App\Models\Blog;
use App\Models\User;
use App\Services\BlogsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogsController extends Controller
{
    public function __construct(private readonly BlogsService $blogsService) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Workspace/Blogs', $this->blogsService->index(
            $request->string('status')->toString(),
        ));
    }

    public function create(): Response
    {
        /** @var User $user */
        $user = auth()->user();

        return Inertia::render('Workspace/BlogCreate', $this->blogsService->createForm($user));
    }

    public function store(StoreBlogRequest $request): RedirectResponse
    {
        $blog = $this->blogsService->create($request->validated(), (int) $request->user()->id);

        return redirect()->route('blogs.show', $blog)
            ->with('success', 'Blog created.');
    }

    public function show(Blog $blog): Response
    {
        return Inertia::render('Workspace/BlogShow', [
            'blog' => $this->blogsService->payload($blog),
        ]);
    }

    public function edit(Blog $blog): Response
    {
        return Inertia::render('Workspace/BlogEdit', [
            'blog' => $this->blogsService->payload($blog),
            ...$this->blogsService->editForm($blog),
        ]);
    }

    public function update(UpdateBlogRequest $request, Blog $blog): RedirectResponse
    {
        $this->blogsService->update($blog, $request->validated(), (int) $request->user()->id);

        return redirect()->route('blogs.show', $blog)
            ->with('success', 'Blog updated.');
    }

    public function destroy(Blog $blog): RedirectResponse
    {
        $this->blogsService->delete($blog);

        return redirect()->route('blogs.index')
            ->with('success', 'Blog deleted.');
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'distinct', 'exists:blogs,id'],
        ]);

        $count = $this->blogsService->deleteMany($validated['ids']);

        return redirect()->route('blogs.index')
            ->with('success', $count === 1 ? 'Blog deleted.' : "{$count} blogs deleted.");
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        return response()->json(
            $this->blogsService->storeContentImage($request->file('image')),
        );
    }
}
