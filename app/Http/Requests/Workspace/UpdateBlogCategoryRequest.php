<?php

namespace App\Http\Requests\Workspace;

use App\Enums\BlogCategoryStatus;
use App\Models\BlogCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateBlogCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canManageBlogs() ?? false;
    }

    public function rules(): array
    {
        /** @var BlogCategory $category */
        $category = $this->route('blog_category');

        return [
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique(BlogCategory::class, 'slug')->ignore($category->id),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'color'       => ['nullable', 'string', 'max:100'],
            'status'      => ['required', new Enum(BlogCategoryStatus::class)],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('slug') && is_string($this->slug)) {
            $this->merge(['slug' => strtolower(trim($this->slug))]);
        }
    }
}
