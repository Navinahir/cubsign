<?php

namespace Tests\Feature\Auth;

use App\Enums\UserStatus;
use App\Models\User;
use App\Notifications\VerifyEmailNotification;
use Illuminate\Auth\Events\Verified;
use Illuminate\Contracts\Notifications\Dispatcher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Symfony\Component\Mailer\Exception\TransportException;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_email_verification_screen_can_be_rendered(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user)->get('/verify-email');

        $response->assertStatus(200);
    }

    public function test_email_can_be_verified_without_prior_login(): void
    {
        $user = User::factory()->unverified()->create();

        Event::fake();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $response = $this->get($verificationUrl);

        Event::assertDispatched(Verified::class);
        $this->assertAuthenticatedAs($user);
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
        $this->assertSame(UserStatus::Active, $user->fresh()->status);
        $response->assertRedirect(route('overview', absolute: false));
        $response->assertSessionHas('status', 'email-verified');
    }

    public function test_email_is_not_verified_with_invalid_hash(): void
    {
        $user = User::factory()->unverified()->create();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1('wrong-email')]
        );

        $this->get($verificationUrl)->assertForbidden();

        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_expired_verification_link_redirects_to_expired_page(): void
    {
        $user = User::factory()->unverified()->create();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->subMinute(),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $this->get($verificationUrl)
            ->assertRedirect(route('verification.expired', absolute: false));
    }

    public function test_unverified_users_cannot_access_workspace(): void
    {
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)
            ->get('/overview')
            ->assertRedirect(route('verification.notice', absolute: false));
    }

    public function test_verification_email_can_be_resent(): void
    {
        Notification::fake();

        $user = User::factory()->unverified()->create();

        $this->actingAs($user)
            ->from(route('verification.notice'))
            ->post('/email/verification-notification')
            ->assertRedirect(route('verification.notice'))
            ->assertSessionHas('status', 'verification-link-sent');

        Notification::assertSentTo($user, VerifyEmailNotification::class, function ($notification) use ($user) {
            $mail = $notification->toMail($user);

            return $mail->subject === 'Verify your CubSign account'
                && str_contains($mail->render(), 'Verify Email');
        });
    }

    public function test_resend_is_throttled_by_cooldown(): void
    {
        Notification::fake();

        $user = User::factory()->unverified()->create();

        $this->actingAs($user)->from(route('verification.notice'))->post('/email/verification-notification');
        $this->actingAs($user)
            ->from(route('verification.notice'))
            ->post('/email/verification-notification')
            ->assertStatus(302)
            ->assertSessionHasErrors('resend');

        Notification::assertSentTimes(VerifyEmailNotification::class, 1);
    }

    public function test_resend_hourly_limit_does_not_return_http_500(): void
    {
        Notification::fake();

        $user = User::factory()->unverified()->create();
        $key = "verification-resend:{$user->id}";
        $maxAttempts = (int) config('auth.verification.resend_limit', 5);

        for ($i = 0; $i < $maxAttempts; $i++) {
            RateLimiter::hit($key, 3600);
        }

        $this->actingAs($user)
            ->from(route('verification.notice'))
            ->post('/email/verification-notification')
            ->assertStatus(302)
            ->assertRedirect(route('verification.notice'))
            ->assertSessionHasErrors('resend');

        Notification::assertNothingSent();
    }

    public function test_mail_transport_failure_returns_safe_error_and_is_logged(): void
    {
        $user = User::factory()->unverified()->create();

        $this->mock(Dispatcher::class, function ($mock) {
            $mock->shouldReceive('send')
                ->once()
                ->andThrow(new TransportException(
                    'Failed to authenticate on SMTP server with username "prod@gmail.com" using 3 possible authenticators. Authenticator LOGIN returned Expected response code 235 but got code "535".',
                ));
        });

        $logged = null;
        Log::listen(function ($event) use (&$logged) {
            if ($event->message === 'VERIFICATION_MAIL_FAILED') {
                $logged = $event;
            }
        });

        $response = $this->actingAs($user)
            ->from(route('verification.notice'))
            ->post('/email/verification-notification');

        $response->assertStatus(302)
            ->assertRedirect(route('verification.notice'))
            ->assertSessionHasErrors('resend');

        $message = session('errors')->first('resend');
        $this->assertSame(
            "We couldn't send the verification email right now. Please try again later.",
            $message,
        );
        $this->assertStringNotContainsStringIgnoringCase('smtp', $message);
        $this->assertStringNotContainsString('535', $message);
        $this->assertStringNotContainsString('gmail.com', $message);
        $this->assertStringNotContainsString('authenticate', $message);
        $this->assertStringNotContainsString('prod@', $message);

        $this->assertNotNull($logged);
        $this->assertSame('error', $logged->level);
        $this->assertSame($user->id, $logged->context['user_id'] ?? null);
        $this->assertSame(TransportException::class, $logged->context['exception'] ?? null);
        $this->assertStringNotContainsString('prod@gmail.com', json_encode($logged->context));
    }

    public function test_verified_users_are_redirected_away_from_resend(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/email/verification-notification')
            ->assertRedirect(route('overview', absolute: false));

        Notification::assertNothingSent();
    }

    public function test_guests_cannot_trigger_verification_resend(): void
    {
        Notification::fake();

        $this->post('/email/verification-notification')
            ->assertRedirect(route('login'));

        Notification::assertNothingSent();
    }
}
