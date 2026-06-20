<?php

namespace App\Models;

use App\Enums\SignSessionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SignSession extends Model
{
    protected $fillable = [
        'token',
        'original_filename',
        'disk_path',
        'file_size',
        'status',
        'user_id',
        'ip_address',
    ];

    protected $casts = [
        'status' => SignSessionStatus::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
