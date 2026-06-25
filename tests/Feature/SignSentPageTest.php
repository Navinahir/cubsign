<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SignSentPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_sent_page_renders_summary_from_session(): void
    {
        $user = User::factory()->create();
        $document = Document::create([
            'user_id' => $user->id,
            'name'    => 'Contract.pdf',
            'status'  => 'signed',
            'pdf_path' => 'documents/user_1/test.pdf',
        ]);

        $summary = [
            'document_id'   => $document->id,
            'document_name' => $document->name,
            'recipients'    => [
                ['name' => 'Alice', 'email' => 'alice@example.com'],
            ],
        ];

        $response = $this->actingAs($user)
            ->withSession(['sign_sent_summary' => $summary])
            ->get(route('sign.sent'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Sign/Sent')
            ->where('summary.document_id', $document->id)
            ->where('summary.recipients.0.name', 'Alice')
        );

        $this->assertNull(session('sign_sent_summary'));
    }

    public function test_sent_page_redirects_without_session_summary(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('sign.sent'))
            ->assertRedirect(route('overview'));
    }
}
