<?php

namespace Tests\Feature;

use Tests\TestCase;

class SecurityTest extends TestCase
{
    public function test_security_center_loads(): void
    {
        $this->get('/security')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Security'));
    }

    public function test_security_does_not_require_authentication(): void
    {
        $this->get('/security')->assertOk();
    }
}
