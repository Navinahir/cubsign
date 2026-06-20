<?php

namespace App\Enums;

enum SignSessionStatus: string
{
    case Uploaded   = 'uploaded';
    case Editing    = 'editing';
    case Signed     = 'signed';
    case Downloaded = 'downloaded';
}
