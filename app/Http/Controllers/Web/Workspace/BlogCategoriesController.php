<?php

namespace App\Http\Controllers\Web\Workspace;

use App\Enums\BlogCategoryStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Workspace\StoreBlogCategoryRequest;
use App\Http\Requests\Workspace\UpdateBlogCategoryRequest;
use App\Models\BlogCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BlogCategoriesController extends Controller
{
    public function index(): Response
    {
        $categories = BlogCategory::query()
            ->withCount('blogs')
            ->orderBy('name')
            ->get()
            ->map(fn (BlogCategory $category) => [
                'id'          => $category->id,
                'name'        => $category->name,
                'slug'        => $category->slug,
                'description' => $category->description,
                'color'       => $category->color,
                'status'      => $category->status->value,
                'blogs_count' => $category->blogs_count,
                'updated_at'  => $category->updated_at,
            ]);

        return Inertia::render('Workspace/BlogCategories', [
            'categories' => $categories,
            'statuses'   => $this->statusOptions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Workspace/BlogCategoryCreate', [
            'statuses' => $this->statusOptions(),
            'defaults' => [
                'status' => BlogCategoryStatus::Active->value,
            ],
        ]);
    }

    public function store(StoreBlogCategoryRequest $request): RedirectResponse
    {
        BlogCategory::create($request->validated());

        return redirect()->route('blog-categories.index')
            ->with('success', 'Category created.');
    }

    /**
     * Quick-create from the Blog form modal (JSON, no full page reload).
     */
    public function quickStore(\Illuminate\Http\Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $baseSlug = \Illuminate\Support\Str::slug($validated['name']);
        $slug = $baseSlug !== '' ? $baseSlug : 'category';
        $original = $slug;
        $i = 1;
        while (BlogCategory::query()->where('slug', $slug)->exists()) {
            $slug = $original.'-'.$i;
            $i++;
        }

        if (BlogCategory::query()->whereRaw('LOWER(name) = ?', [mb_strtolower($validated['name'])])->exists()) {
            return response()->json([
                'message' => 'A category with this name already exists.',
                'errors'  => ['name' => ['A category with this name already exists.']],
            ], 422);
        }

        $category = BlogCategory::create([
            'name'        => $validated['name'],
            'slug'        => $slug,
            'description' => null,
            'color'       => null,
            'status'      => BlogCategoryStatus::Active,
        ]);

        return response()->json([
            'category' => [
                'id'     => $category->id,
                'name'   => $category->name,
                'slug'   => $category->slug,
                'status' => $category->status->value,
            ],
        ], 201);
    }

    public function edit(BlogCategory $blogCategory): Response
    {
        return Inertia::render('Workspace/BlogCategoryEdit', [
            'category' => [
                'id'          => $blogCategory->id,
                'name'        => $blogCategory->name,
                'slug'        => $blogCategory->slug,
                'description' => $blogCategory->description,
                'color'       => $blogCategory->color,
                'status'      => $blogCategory->status->value,
            ],
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function update(UpdateBlogCategoryRequest $request, BlogCategory $blogCategory): RedirectResponse
    {
        $blogCategory->update($request->validated());

        return redirect()->route('blog-categories.index')
            ->with('success', 'Category updated.');
    }

    public function destroy(BlogCategory $blogCategory): RedirectResponse
    {
        if ($blogCategory->blogs()->exists()) {
            return redirect()->back()->withErrors([
                'category' => 'This category cannot be deleted while blogs are assigned to it.',
            ]);
        }

        $blogCategory->delete();

        return redirect()->route('blog-categories.index')
            ->with('success', 'Category deleted.');
    }

    private function statusOptions(): array
    {
        return collect(BlogCategoryStatus::cases())->map(fn (BlogCategoryStatus $s) => [
            'value' => $s->value,
            'label' => ucfirst($s->value),
        ])->all();
    }
}
