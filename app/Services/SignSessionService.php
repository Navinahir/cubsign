<?php

namespace App\Services;

use App\Enums\SignSessionStatus;
use App\Models\SignSession;
use App\Repositories\SignSessionRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class SignSessionService
{
    public function __construct(private readonly SignSessionRepository $repository) {}

    public function upload(UploadedFile $file, ?int $userId, string $ip): SignSession
    {
        $token    = Str::random(40);
        $diskPath = $file->storeAs('sign', $token . '.pdf');

        return $this->repository->create([
            'token'             => $token,
            'original_filename' => $file->getClientOriginalName(),
            'disk_path'         => $diskPath,
            'file_size'         => $file->getSize(),
            'status'            => SignSessionStatus::Uploaded->value,
            'user_id'           => $userId,
            'ip_address'        => $ip,
        ]);
    }
}
