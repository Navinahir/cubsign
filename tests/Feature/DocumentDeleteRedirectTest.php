<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocumentDeleteRedirectTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    private function makeDocument(array $overrides = []): Document
    {
        return Document::create(array_merge([
            'user_id' => $this->user->id,
            'name'    => 'Test Document',
            'status'  => 'draft',
        ], $overrides));
    }

    public function test_destroy_redirects_to_documents_index_with_flash(): void
    {
        $document = $this->makeDocument();

        $response = $this->actingAs($this->user)->delete(route('documents.destroy', $document));

        $response->assertRedirect(route('documents.index'));
        $response->assertSessionHas('status', 'document-deleted');
        $this->assertSoftDeleted('documents', ['id' => $document->id]);
    }

    public function test_show_deleted_document_redirects_to_documents_index(): void
    {
        $document = $this->makeDocument();
        $document->delete();

        $response = $this->actingAs($this->user)->get(route('documents.show', $document->id));

        $response->assertRedirect(route('documents.index'));
        $response->assertSessionHas('status', 'document-unavailable');
    }

    public function test_open_deleted_document_redirects_to_documents_index(): void
    {
        $document = $this->makeDocument(['sign_token' => 'test-token-abc']);
        $document->delete();

        $response = $this->actingAs($this->user)->post(route('documents.open', $document->id));

        $response->assertRedirect(route('documents.index'));
        $response->assertSessionHas('status', 'document-unavailable');
    }

    public function test_destroy_clears_sign_document_id_from_session(): void
    {
        $document = $this->makeDocument();

        $response = $this->actingAs($this->user)
            ->withSession(['sign_document_id' => $document->id])
            ->delete(route('documents.destroy', $document));

        $response->assertRedirect(route('documents.index'));
        $response->assertSessionMissing('sign_document_id');
    }
}
