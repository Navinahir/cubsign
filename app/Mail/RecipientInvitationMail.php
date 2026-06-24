<?php

namespace App\Mail;

use App\Models\Recipient;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RecipientInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $signUrl;
    public string $documentName;
    public string $ownerName;

    public function __construct(public readonly Recipient $recipient)
    {
        $document           = $recipient->document;
        $this->documentName = $document?->name ?? 'a document';
        $this->ownerName    = $document?->user?->name ?? 'Someone';
        $this->signUrl      = route('recipient.sign', ['token' => $recipient->sign_token]);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "{$this->ownerName} has requested your signature on \"{$this->documentName}\"",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.recipient-invitation',
        );
    }
}
