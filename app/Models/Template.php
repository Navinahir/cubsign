<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Template extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'pdf_path',
        'editor_state',
    ];

    protected function casts(): array
    {
        return [
            'editor_state' => 'array',
            'created_at'   => 'datetime',
            'updated_at'   => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
