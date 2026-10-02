<?php

namespace App\Http\Requests\Workspace;

use App\Enums\BlogStatus;
use App\Models\Blog;
use App\Support\BlogContent;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateBlogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canManageBlogs() ?? false;
    }

    public function rules(): array
    {
        /** @var Blog $blog */
        $blog = $this->route('blog');

        return [
            'title'            => ['required', 'string', 'max:255'],
            'slug'             => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique(Blog::class, 'slug')->ignore($blog->id),
            ],
            'excerpt'          => ['required', 'string', 'max:2000'],
            'content'          => ['required', 'string'],
            'blog_category_id' => ['required', 'integer', 'exists:blog_categories,id'],
            'status'           => ['required', new Enum(BlogStatus::class)],
            'published_at'     => ['nullable', 'date'],
            'reading_time'     => ['nullable', 'integer', 'min:1', 'max:120'],
            'featured'         => ['sometimes', 'boolean'],
            'popular'          => ['sometimes', 'boolean'],
            'tags'             => ['nullable', 'array'],
            'tags.*'           => ['string', 'max:100'],
            'keywords'         => ['nullable', 'array'],
            'keywords.*'       => ['string', 'max:100'],
            'faq'              => ['nullable', 'array'],
            'faq.*.question'   => ['required', 'string', 'max:500'],
            'faq.*.answer'     => ['required', 'string', 'max:5000'],
            'related_ids'      => ['nullable', 'array', 'max:3'],
            'related_ids.*'    => ['integer', 'distinct', Rule::exists(Blog::class, 'id')->where(fn ($q) => $q->where('id', '!=', $blog->id))],
            'cover_image'      => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'remove_cover'     => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'            => 'Title is required.',
            'slug.required'             => 'Slug is required.',
            'slug.unique'               => 'This slug is already in use.',
            'excerpt.required'          => 'Excerpt is required.',
            'blog_category_id.required' => 'Category is required.',
            'blog_category_id.exists'   => 'Selected category is invalid.',
            'content.required'          => 'Content is required.',
            'faq.*.question.required'   => 'Each FAQ question is required.',
            'faq.*.answer.required'     => 'Each FAQ answer is required.',
            'cover_image.image'         => 'Featured image must be a valid image file.',
            'cover_image.mimes'         => 'Featured image must be JPG, PNG, or WebP.',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $html = BlogContent::sanitize((string) $this->input('content', ''));

            if (! BlogContent::hasVisibleBody($html)) {
                $validator->errors()->add('content', 'Content is required.');

                return;
            }

            $this->merge(['content' => $html]);
        });
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('slug') && is_string($this->slug)) {
            $this->merge(['slug' => strtolower(trim($this->slug))]);
        }

        foreach (['tags', 'keywords', 'faq', 'related_ids'] as $jsonField) {
            if ($this->has($jsonField) && is_string($this->input($jsonField))) {
                $decoded = json_decode($this->input($jsonField), true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $this->merge([$jsonField => $decoded]);
                }
            }
        }

        foreach (['featured', 'popular', 'remove_cover'] as $flag) {
            if ($this->has($flag)) {
                $this->merge([$flag => filter_var($this->input($flag), FILTER_VALIDATE_BOOLEAN)]);
            }
        }

        if ($this->has('faq') && is_array($this->input('faq'))) {
            $this->merge([
                'faq' => collect($this->input('faq'))
                    ->map(fn ($item) => [
                        'question' => trim((string) ($item['question'] ?? '')),
                        'answer'   => trim((string) ($item['answer'] ?? '')),
                    ])
                    ->filter(fn ($item) => $item['question'] !== '' || $item['answer'] !== '')
                    ->values()
                    ->all(),
            ]);
        }

        if ($this->status === BlogStatus::Published->value && ! $this->filled('published_at')) {
            $this->merge(['published_at' => now()->toDateString()]);
        }
    }
}
