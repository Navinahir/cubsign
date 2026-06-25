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
        Log::channel('cubsign')->info('MAIL_DISPATCHED', [
            'document_id'  => $recipient->document_id,
            'recipient_id' => $recipient->id,
            'email'        => $recipient->email,
        ]);

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

            Log::channel('cubsign')->info('MAIL_SUCCESS', [
                'document_id'  => $recipient->document_id,
                'recipient_id' => $recipient->id,
                'email'        => $recipient->email,
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::channel('cubsign')->error('MAIL_FAILED', [
                'document_id'  => $recipient->document_id,
                'recipient_id' => $recipient->id,
                'email'        => $recipient->email,
                'error'        => $e->getMessage(),
            ]);

            return false;
        }
    }
}
