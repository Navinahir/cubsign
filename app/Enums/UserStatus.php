<?php

namespace App\Enums;

enum UserStatus: string
{
    case PendingVerification = 'pending_verification';
    case Active              = 'active';
}
