<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\Template;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TemplatesControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('documents');
        $this->user = User::factory()->create();
    }

    private function makeTemplate(array $overrides = []): Template
    {
        $path = 'templates/test.pdf';
        Storage::disk('documents')->put($path, '%PDF-1.4 fake');

        return Template::create(array_merge([
            'user_id'      => $this->user->id,
            'name'         => 'Test Template',
            'pdf_path'     => $path,
            'editor_state' => null,
        ], $overrides));
    }

    public function test_edit_clears_sign_document_id_session(): void
    {
        $template = $this->makeTemplate();

        $response = $this->actingAs($this->user)
            ->withSession(['sign_document_id' => 99])
            ->get(route('templates.edit', $template));

        $response->assertOk();
        $response->assertSessionMissing('sign_document_id');
    }

    public function test_update_strips_signing_metadata_from_editor_state(): void
    {
        $template = $this->makeTemplate();

        $response = $this->actingAs($this->user)->put(route('templates.update', $template), [
            'name'         => 'Updated',
            'editor_state' => [
                'placedFields' => [
                    [
                        'id' => 1, 'type' => 'signature', 'pageNum' => 1,
                        'x' => 10, 'y' => 20, 'w' => 180, 'h' => 60,
                        'signerId' => 5,
                        'value' => ['sigType' => 'image', 'src' => 'data:image/png;base64,x'],
                    ],
                    [
                        'id' => 2, 'type' => 'invalid_type', 'pageNum' => 1,
                        'x' => 0, 'y' => 0, 'w' => 100, 'h' => 40,
                    ],
                ],
                'signingMode' => 'request',
                'recipients'    => [['id' => 1]],
            ],
        ]);

        $response->assertSessionHasErrors('editor_state.placedFields.1.type');

        $response = $this->actingAs($this->user)->put(route('templates.update', $template), [
            'name'         => 'Updated',
            'editor_state' => [
                'placedFields' => [
                    [
                        'id' => 1, 'type' => 'signature', 'pageNum' => 1,
                        'x' => 10, 'y' => 20, 'w' => 180, 'h' => 60,
                        'label' => 'Signer', 'required' => true,
                        'signerId' => 5,
                        'value' => ['sigType' => 'image', 'src' => 'data:image/png;base64,x'],
                    ],
                    [
                        'id' => 2, 'type' => 'checkbox', 'pageNum' => 2,
                        'x' => 50, 'y' => 50, 'w' => 28, 'h' => 28,
                        'label' => 'Agree', 'required' => false,
                    ],
                ],
            ],
        ]);

        $response->assertRedirect(route('templates.show', $template));
        $template->refresh();

        $this->assertArrayNotHasKey('signingMode', $template->editor_state);
        $this->assertCount(2, $template->editor_state['placedFields']);
        $this->assertSame(['sigType' => 'text', 'src' => 'Signature'], $template->editor_state['placedFields'][0]['value']);
        $this->assertTrue($template->editor_state['placedFields'][0]['required']);
        $this->assertSame('Signer', $template->editor_state['placedFields'][0]['label']);
        $this->assertSame('checkbox', $template->editor_state['placedFields'][1]['type']);
    }

    public function test_use_template_creates_fresh_sign_session(): void
    {
        $template = $this->makeTemplate([
            'editor_state' => [
                'placedFields' => [
                    [
                        'id' => 1, 'type' => 'signature', 'pageNum' => 1,
                        'x' => 10, 'y' => 20, 'w' => 180, 'h' => 60,
                        'signerId' => 1, 'signingMode' => 'request',
                        'value' => ['sigType' => 'image', 'src' => 'data:image/png;base64,x'],
                    ],
                    ['id' => 2, 'type' => 'date', 'pageNum' => 1, 'x' => 0, 'y' => 0, 'w' => 140, 'h' => 32, 'value' => '6/26/2026'],
                ],
                'signingMode'    => 'request',
                'recipients'     => [['id' => 1, 'name' => 'Alex', 'email' => 'alex@example.com']],
                'savedSignature' => ['type' => 'image', 'src' => 'x'],
                'activePage'     => 2,
            ],
        ]);

        $response = $this->actingAs($this->user)
            ->withSession(['sign_document_id' => 1, 'sign_token' => 'old-token'])
            ->post(route('templates.use', $template));

        $response->assertRedirect(route('sign.editor'));
        $response->assertSessionHas('sign_token');
        $response->assertSessionHas('sign_document_id');
        $this->assertNotSame('old-token', session('sign_token'));

        $document = Document::where('user_id', $this->user->id)->latest()->first();
        $this->assertNotNull($document);
        $this->assertSame('draft', $document->status);
        $this->assertSame(session('sign_document_id'), $document->id);
        $this->assertSame(session('sign_token'), $document->sign_token);

        $state = $document->editor_state;
        $this->assertArrayHasKey('placedFields', $state);
        $this->assertArrayHasKey('scale', $state);
        $this->assertSame('self', $state['signingMode']);
        $this->assertCount(1, $state['recipients']);
        $this->assertSame($this->user->name, $state['recipients'][0]['name']);
        $this->assertSame($this->user->email, $state['recipients'][0]['email']);
        $this->assertArrayNotHasKey('savedSignature', $state);
        $this->assertArrayNotHasKey('activePage', $state);

        $this->assertSame(['sigType' => 'text', 'src' => 'Signature'], $state['placedFields'][0]['value']);
        $this->assertSame('', $state['placedFields'][1]['value']);
        $this->assertSame(1, $state['placedFields'][0]['signerId']);
        $this->assertSame('self', $state['placedFields'][0]['signingMode']);

        $this->assertDatabaseCount('sign_sessions', 1);
        $this->assertTrue(Storage::disk('documents')->exists('sign/' . $document->sign_token . '.pdf'));
    }

    public function test_use_complex_template_omits_signing_defaults(): void
    {
        $template = $this->makeTemplate([
            'editor_state' => [
                'placedFields' => [
                    [
                        'id' => 1, 'type' => 'signature', 'pageNum' => 1,
                        'x' => 10, 'y' => 20, 'w' => 180, 'h' => 60,
                    ],
                    [
                        'id' => 2, 'type' => 'signature', 'pageNum' => 2,
                        'x' => 10, 'y' => 20, 'w' => 180, 'h' => 60,
                    ],
                ],
            ],
        ]);

        $response = $this->actingAs($this->user)->post(route('templates.use', $template));

        $response->assertRedirect(route('sign.editor'));

        $document = Document::where('user_id', $this->user->id)->latest()->first();
        $state    = $document->editor_state;

        $this->assertArrayNotHasKey('signingMode', $state);
        $this->assertArrayNotHasKey('recipients', $state);
        $this->assertArrayNotHasKey('signerId', $state['placedFields'][0]);
    }

    public function test_other_user_cannot_edit_template(): void
    {
        $template = $this->makeTemplate();
        $other    = User::factory()->create();

        $this->actingAs($other)->get(route('templates.edit', $template))->assertForbidden();
    }

    public function test_duplicate_sanitizes_editor_state(): void
    {
        $template = $this->makeTemplate([
            'editor_state' => [
                'placedFields' => [
                    [
                        'id' => 1, 'type' => 'name', 'pageNum' => 1,
                        'x' => 0, 'y' => 0, 'w' => 160, 'h' => 32,
                        'value' => 'John Doe',
                    ],
                ],
                'savedSignature' => ['type' => 'image'],
            ],
        ]);

        $response = $this->actingAs($this->user)->post(route('templates.duplicate', $template));
        $response->assertRedirect();

        $copy = Template::where('id', '!=', $template->id)->first();
        $this->assertNotNull($copy);
        $this->assertSame('', $copy->editor_state['placedFields'][0]['value']);
        $this->assertArrayNotHasKey('savedSignature', $copy->editor_state);
    }
}
