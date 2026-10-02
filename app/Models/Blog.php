<?php

namespace App\Models;

use App\Enums\BlogStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Blog extends Model
{
    protected $fillable = [
        'user_id',
        'blog_category_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image',
        'tags',
        'keywords',
        'faq',
        'related_ids',
        'reading_time',
        'featured',
        'popular',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'tags'             => 'array',
            'keywords'         => 'array',
            'faq'              => 'array',
            'related_ids'      => 'array',
            'featured'         => 'boolean',
            'popular'          => 'boolean',
            'reading_time'     => 'integer',
            'status'           => BlogStatus::class,
            'published_at'     => 'date',
            'created_at'       => 'datetime',
            'updated_at'       => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('status', BlogStatus::Published)
            ->whereNotNull('published_at')
            ->whereDate('published_at', '<=', now()->toDateString());
    }
}
