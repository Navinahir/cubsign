<?php

namespace App\Services;

use App\Enums\SignSessionStatus;
use App\Models\SignSession;
use App\Repositories\SignSessionRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SignSessionService
{
    public function __construct(private readonly SignSessionRepository $repository) {}

    public function upload(UploadedFile $file, ?int $userId, string $ip): SignSession
    {
        $token    = Str::random(40);
        $diskPath = $file->storeAs('sign', $token . '.pdf');

        Log::channel('cubsign')->debug('PDF stored on disk', [
            'token'     => '…' . substr($token, -8),
            'disk_path' => $diskPath,
            'filename'  => $file->getClientOriginalName(),
            'size'      => $file->getSize(),
        ]);

        $session = $this->repository->create([
            'token'             => $token,
            'original_filename' => $file->getClientOriginalName(),
            'disk_path'         => $diskPath,
            'file_size'         => $file->getSize(),
            'status'            => SignSessionStatus::Uploaded->value,
            'user_id'           => $userId,
            'ip_address'        => $ip,
        ]);

        Log::channel('cubsign')->debug('SignSession record persisted', [
            'id'       => $session->id,
            'token'    => '…' . substr($token, -8),
            'status'   => $session->status,
            'user_id'  => $userId,
        ]);

        return $session;
    }
}
