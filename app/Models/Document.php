<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'user_id',
        'name',
        'status',
        'pdf_path',
        'signed_pdf_path',
        'sign_token',
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

    public function recipients(): HasMany
    {
        return $this->hasMany(Recipient::class)->orderBy('signing_order');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(DocumentActivity::class)->latest();
    }
}
