<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuestSigningAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_access_sign_upload_page(): void
    {
        $this->get(route('sign.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Sign/Upload'));
    }

    public function test_guest_is_not_redirected_to_login_or_verify_email(): void
    {
        $response = $this->get(route('sign.index'));

        $response->assertOk();
        $this->assertFalse($response->isRedirect(route('login', absolute: false)));
        $this->assertFalse($response->isRedirect(route('verification.notice', absolute: false)));
    }

    public function test_unverified_user_can_access_sign_upload_page(): void
    {
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)
            ->get(route('sign.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Sign/Upload'));
    }

    public function test_unverified_user_still_blocked_from_workspace(): void
    {
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)
            ->get(route('overview'))
            ->assertRedirect(route('verification.notice', absolute: false));
    }

    public function test_public_pages_remain_accessible_without_auth(): void
    {
        $this->get(route('home'))->assertOk();
        $this->get(route('pricing'))->assertOk();
        $this->get(route('faq'))->assertOk();
    }
}
