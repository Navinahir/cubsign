<?php

namespace App\Models;

use App\Support\TemplateEditorState;
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

    protected static function booted(): void
    {
        static::saving(function (Template $template) {
            if ($template->isDirty('editor_state') && is_array($template->editor_state)) {
                $template->editor_state = TemplateEditorState::sanitize($template->editor_state);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
