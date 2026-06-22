<?php

namespace App\Repositories;

use App\Models\Document;
use App\Models\User;

class DocumentRepository
{
    public function createSignedDocument(User $user, string $filename, string $path): Document
    {
        return Document::create([
            'user_id'  => $user->id,
            'name'     => $filename,
            'status'   => 'signed',
            'pdf_path' => $path,
        ]);
    }
}
