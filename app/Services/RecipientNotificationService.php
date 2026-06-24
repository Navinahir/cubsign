<?php

namespace App\Services;

use App\Mail\RecipientInvitationMail;
use App\Models\DocumentActivity;
use App\Models\Recipient;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class RecipientNotificationService
{
    /**
     * Send invitation email and log recipient_notified only on success.
     */
    public function sendInvitation(Recipient $recipient): bool
    {
        try {
            $recipient->load('document.user');
            Mail::to($recipient->email)->send(new RecipientInvitationMail($recipient));

            DocumentActivity::create([
                'document_id'  => $recipient->document_id,
                'recipient_id' => $recipient->id,
                'event'        => 'recipient_notified',
                'meta'         => [
                    'name'  => $recipient->name,
                    'email' => $recipient->email,
                ],
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::channel('cubsign')->error('RecipientInvitationMail failed', [
                'recipient_id' => $recipient->id,
                'document_id'  => $recipient->document_id,
                'error'        => $e->getMessage(),
            ]);

            return false;
        }
    }
}
