<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\Recipient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class DocumentsSendTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        Mail::fake();
    }

    private function makeDocument(array $overrides = []): Document
    {
        return Document::create(array_merge([
            'user_id' => $this->user->id,
            'name'    => 'Test Document',
            'status'  => 'draft',
        ], $overrides));
    }

    public function test_send_blocked_when_pdf_path_missing(): void
    {
        $document = $this->makeDocument(['pdf_path' => null]);

        $response = $this->actingAs($this->user)->postJson(route('documents.send', $document), [
            'recipients' => [
                [
                    'name'                => 'Alice',
                    'email'               => 'alice@example.com',
                    'editor_recipient_id' => 1,
                ],
            ],
        ]);

        $response->assertStatus(422)
            ->assertJson(['message' => 'Document must be finalized before requests can be sent.']);

        $this->assertDatabaseCount('recipients', 0);
        $this->assertDatabaseCount('document_activities', 0);
    }

    public function test_send_succeeds_when_pdf_path_exists(): void
    {
        $document = $this->makeDocument([
            'status'   => 'signed',
            'pdf_path' => 'documents/user_1/test.pdf',
        ]);

        $response = $this->actingAs($this->user)->postJson(route('documents.send', $document), [
            'recipients' => [
                [
                    'name'                => 'Alice',
                    'email'               => 'alice@example.com',
                    'editor_recipient_id' => 1,
                ],
            ],
        ]);

        $response->assertOk()->assertJson(['ok' => true]);
        $this->assertDatabaseCount('recipients', 1);
        $this->assertDatabaseHas('document_activities', ['event' => 'sent']);
    }

    public function test_send_rejects_duplicate_prepare(): void
    {
        $document = $this->makeDocument([
            'status'   => 'signed',
            'pdf_path' => 'documents/user_1/test.pdf',
        ]);

        Recipient::create([
            'document_id'         => $document->id,
            'name'                => 'Alice',
            'email'               => 'alice@example.com',
            'editor_recipient_id' => 1,
            'status'              => 'sent',
            'sign_token'          => 'existing-token-40-chars-long-abcdefghij',
        ]);

        $response = $this->actingAs($this->user)->postJson(route('documents.send', $document), [
            'recipients' => [
                [
                    'name'                => 'Bob',
                    'email'               => 'bob@example.com',
                    'editor_recipient_id' => 2,
                ],
            ],
        ]);

        $response->assertStatus(409)
            ->assertJson(['message' => 'Signing requests have already been prepared.']);

        $this->assertDatabaseCount('recipients', 1);
    }

    public function test_send_rejects_completed_document(): void
    {
        $document = $this->makeDocument([
            'status'   => 'completed',
            'pdf_path' => 'documents/user_1/test.pdf',
        ]);

        $response = $this->actingAs($this->user)->postJson(route('documents.send', $document), [
            'recipients' => [
                [
                    'name'                => 'Alice',
                    'email'               => 'alice@example.com',
                    'editor_recipient_id' => 1,
                ],
            ],
        ]);

        $response->assertStatus(409)
            ->assertJson(['message' => 'Only draft documents can be prepared.']);
    }
}
