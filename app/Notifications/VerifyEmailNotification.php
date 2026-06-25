<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class VerifyEmailNotification extends VerifyEmail
{
  /**
   * Get the mail representation of the notification.
   */
    public function toMail($notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verify your CubSign account')
            ->view('emails.verify-email', [
                'user'            => $notifiable,
                'verificationUrl' => $verificationUrl,
                'expiresHours'    => (int) (Config::get('auth.verification.expire', 1440) / 60) ?: 24,
            ]);
    }

  /**
   * Get the verification URL for the given notifiable.
   */
    protected function verificationUrl($notifiable): string
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 1440)),
            [
                'id'   => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }
}
