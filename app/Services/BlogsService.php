<?php

namespace App\Services;

use App\Enums\BlogCategoryStatus;
use App\Enums\BlogStatus;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\User;
use App\Support\BlogPresenter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class BlogsService
{
    private const IMAGE_DISK = 'public';

    private const COVER_DIR = 'blogs/covers';

    private const CONTENT_DIR = 'blogs/content';

    public function __construct(private readonly SitemapService $sitemap) {}

    /**
     * @return array{blogs: LengthAwarePaginator, filters: array{status: string}, statuses: list<array{value: string, label: string}>}
     */
    public function index(string $status): array
    {
        $blogs = Blog::query()
            ->with(['category:id,name,slug', 'user'])
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(12)
            ->through(fn (Blog $blog) => [
                'id'           => $blog->id,
                'title'        => $blog->title,
                'slug'         => $blog->slug,
                'status'       => $blog->status->value,
                'published_at' => optional($blog->published_at)?->toDateString(),
                'updated_at'   => $blog->updated_at,
                'category'     => $blog->category ? [
                    'id'   => $blog->category->id,
                    'name' => $blog->category->name,
                    'slug' => $blog->category->slug,
                ] : null,
                'cover_image'  => BlogPresenter::coverImageUrl($blog),
            ]);

        return [
            'blogs'    => $blogs,
            'filters'  => [
                'status' => $status,
            ],
            'statuses' => $this->statusOptions(),
        ];
    }

    /**
     * @return array{
     *     categories: \Illuminate\Support\Collection<int, array{id: int, name: string, slug: string, status: string}>,
     *     statuses: list<array{value: string, label: string}>,
     *     relatedOptions: \Illuminate\Support\Collection<int, array{id: int, title: string, slug: string, status: string}>,
     *     defaults: array{status: string, author: array{name: string, role: string, initials: string, avatarBg: string, bio: string}}
     * }
     */
    public function createForm(User $user): array
    {
        return [
            'categories'     => $this->categoryOptions(),
            'statuses'       => $this->statusOptions(),
            'relatedOptions' => $this->relatedOptions(),
            'defaults'       => [
                'status' => BlogStatus::Draft->value,
                'author' => BlogPresenter::toPublicAuthorArray($user),
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    public function create(array $validated, int $userId): Blog
    {
        $cover = $validated['cover_image'] ?? null;
        $data = $this->attributes($validated);
        $data['user_id'] = $userId;

        if ($cover instanceof UploadedFile) {
            $data['cover_image'] = $this->storeImage($cover, self::COVER_DIR);
        }

        $blog = Blog::create($data);

        $this->sitemap->clearCache();

        return $blog;
    }

    /**
     * @return array<string, mixed>
     */
    public function payload(Blog $blog): array
    {
        $blog->load(['category:id,name,slug,color', 'user']);

        return [
            'id'               => $blog->id,
            'title'            => $blog->title,
            'slug'             => $blog->slug,
            'excerpt'          => $blog->excerpt,
            'content'          => BlogPresenter::htmlContent($blog),
            'blog_category_id' => $blog->blog_category_id,
            'category'         => $blog->category ? [
                'id'   => $blog->category->id,
                'name' => $blog->category->name,
                'slug' => $blog->category->slug,
            ] : null,
            'status'           => $blog->status->value,
            'published_at'     => optional($blog->published_at)?->toDateString(),
            'reading_time'     => $blog->reading_time,
            'featured'         => $blog->featured,
            'popular'          => $blog->popular,
            'tags'             => $blog->tags ?? [],
            'keywords'         => $blog->keywords ?? [],
            'faq'              => $blog->faq ?? [],
            'related_ids'      => collect($blog->related_ids ?? [])->map(fn ($id) => (int) $id)->values()->all(),
            'cover_image'      => BlogPresenter::coverImageUrl($blog),
            'author'           => BlogPresenter::author($blog),
            'created_at'       => $blog->created_at,
            'updated_at'       => $blog->updated_at,
        ];
    }

    /**
     * @return array{
     *     categories: \Illuminate\Support\Collection<int, array{id: int, name: string, slug: string, status: string}>,
     *     statuses: list<array{value: string, label: string}>,
     *     relatedOptions: \Illuminate\Support\Collection<int, array{id: int, title: string, slug: string, status: string}>
     * }
     */
    public function editForm(Blog $blog): array
    {
        return [
            'categories'     => $this->categoryOptions(),
            'statuses'       => $this->statusOptions(),
            'relatedOptions' => $this->relatedOptions($blog),
        ];
    }

    /**
     * Ownership stays with the creating admin. A missing owner is filled from the current admin.
     *
     * @param  array<string, mixed>  $validated
     */
    public function update(Blog $blog, array $validated, int $userId): Blog
    {
        $removeCover = (bool) ($validated['remove_cover'] ?? false);
        $cover = $validated['cover_image'] ?? null;
        $data = $this->attributes($validated);

        unset($data['user_id'], $data['author']);

        if (! $blog->user_id) {
            $data['user_id'] = $userId;
        }

        if ($removeCover && ! $cover instanceof UploadedFile) {
            $this->deleteManagedImage($blog->cover_image);
            $data['cover_image'] = null;
        }

        if ($cover instanceof UploadedFile) {
            $path = $this->storeImage($cover, self::COVER_DIR);
            $this->deleteManagedImage($blog->cover_image);
            $data['cover_image'] = $path;
        }

        $blog->update($data);

        $this->sitemap->clearCache();

        return $blog;
    }

    public function delete(Blog $blog): void
    {
        $this->deleteManagedImage($blog->cover_image);
        $blog->delete();

        $this->sitemap->clearCache();
    }

    /**
     * @param  list<int>  $ids
     */
    public function deleteMany(array $ids): int
    {
        $blogs = Blog::query()->whereIn('id', $ids)->get();

        foreach ($blogs as $blog) {
            $this->deleteManagedImage($blog->cover_image);
            $blog->delete();
        }

        if ($blogs->isNotEmpty()) {
            $this->sitemap->clearCache();
        }

        return $blogs->count();
    }

    /**
     * @return array{path: string, url: string}
     */
    public function storeContentImage(UploadedFile $image): array
    {
        $path = $this->storeImage($image, self::CONTENT_DIR);

        return [
            'path' => $path,
            'url'  => Storage::disk(self::IMAGE_DISK)->url($path),
        ];
    }

    /**
     * @return \Illuminate\Support\Collection<int, array{id: int, name: string, slug: string, status: string}>
     */
    private function categoryOptions()
    {
        return BlogCategory::query()
            ->where('status', BlogCategoryStatus::Active)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'status'])
            ->map(fn (BlogCategory $category) => [
                'id'     => $category->id,
                'name'   => $category->name,
                'slug'   => $category->slug,
                'status' => $category->status->value,
            ]);
    }

    /**
     * @return \Illuminate\Support\Collection<int, array{id: int, title: string, slug: string, status: string}>
     */
    private function relatedOptions(?Blog $except = null)
    {
        return Blog::query()
            ->when($except, fn ($query) => $query->where('id', '!=', $except->id))
            ->orderBy('title')
            ->get(['id', 'title', 'slug', 'status', 'blog_category_id'])
            ->map(fn (Blog $blog) => [
                'id'     => $blog->id,
                'title'  => $blog->title,
                'slug'   => $blog->slug,
                'status' => $blog->status->value,
            ])
            ->values();
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function statusOptions(): array
    {
        return collect(BlogStatus::cases())->map(fn (BlogStatus $status) => [
            'value' => $status->value,
            'label' => ucfirst($status->value),
        ])->all();
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function attributes(array $validated): array
    {
        unset($validated['cover_image'], $validated['remove_cover']);

        $validated['featured'] = (bool) ($validated['featured'] ?? false);
        $validated['popular'] = (bool) ($validated['popular'] ?? false);

        if (array_key_exists('related_ids', $validated)) {
            $validated['related_ids'] = collect($validated['related_ids'] ?? [])
                ->map(fn ($id) => (int) $id)
                ->filter(fn (int $id) => $id > 0)
                ->unique()
                ->take(3)
                ->values()
                ->all();
        }

        return $validated;
    }

    private function storeImage(UploadedFile $file, string $directory): string
    {
        return $file->store($directory, self::IMAGE_DISK);
    }

    private function deleteManagedImage(?string $path): void
    {
        if (! $path) {
            return;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/')) {
            return;
        }

        if (Storage::disk(self::IMAGE_DISK)->exists($path)) {
            Storage::disk(self::IMAGE_DISK)->delete($path);
        }
    }
}
