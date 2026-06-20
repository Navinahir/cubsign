<?php

namespace App\Repositories;

use App\Models\SignSession;

class SignSessionRepository
{
    public function create(array $data): SignSession
    {
        return SignSession::create($data);
    }

    public function findByToken(string $token): ?SignSession
    {
        return SignSession::where('token', $token)->first();
    }
}
