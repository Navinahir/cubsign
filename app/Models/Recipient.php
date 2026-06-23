<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Recipient extends Model
{
    protected $fillable = [
        'document_id',
        'name',
        'email',
        'color',
        'signing_order',
        'editor_recipient_id',
        'status',
        'sign_token',
        'signed_at',
        'signed_fields',
    ];

    protected function casts(): array
    {
        return [
            'signed_fields' => 'array',
            'signed_at'     => 'datetime',
        ];
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
