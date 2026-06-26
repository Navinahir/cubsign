<?php

namespace Tests\Unit;

use App\Support\TemplateEditorState;
use PHPUnit\Framework\TestCase;

class TemplateEditorStateTest extends TestCase
{
    public function test_sanitize_strips_signing_metadata_and_user_values(): void
    {
        $state = [
            'placedFields' => [
                [
                    'id'          => 1,
                    'type'        => 'signature',
                    'pageNum'     => 1,
                    'x'           => 10,
                    'y'           => 20,
                    'w'           => 180,
                    'h'           => 60,
                    'signerId'    => 2,
                    'signingMode' => 'request',
                    'value'       => ['sigType' => 'image', 'src' => 'data:image/png;base64,abc'],
                ],
                [
                    'id'      => 2,
                    'type'    => 'date',
                    'pageNum' => 1,
                    'x'       => 0,
                    'y'       => 0,
                    'w'       => 140,
                    'h'       => 32,
                    'value'   => '6/26/2026',
                ],
            ],
            'signingMode'    => 'request',
            'recipients'     => [['id' => 1, 'name' => 'Alex']],
            'savedSignature' => ['type' => 'image', 'src' => 'x'],
            'scale'          => 1.25,
        ];

        $sanitized = TemplateEditorState::sanitize($state);

        $this->assertArrayNotHasKey('signingMode', $sanitized);
        $this->assertArrayNotHasKey('recipients', $sanitized);
        $this->assertCount(2, $sanitized['placedFields']);
        $this->assertArrayNotHasKey('signerId', $sanitized['placedFields'][0]);
        $this->assertSame(['sigType' => 'text', 'src' => 'Signature'], $sanitized['placedFields'][0]['value']);
        $this->assertSame('', $sanitized['placedFields'][1]['value']);
        $this->assertSame(1.25, $sanitized['scale']);
    }

    public function test_sanitize_rejects_invalid_field_types(): void
    {
        $sanitized = TemplateEditorState::sanitize([
            'placedFields' => [
                ['id' => 1, 'type' => 'not_a_field', 'pageNum' => 1, 'x' => 0, 'y' => 0, 'w' => 10, 'h' => 10],
                ['id' => 2, 'type' => 'text', 'pageNum' => 1, 'x' => 0, 'y' => 0, 'w' => 160, 'h' => 32],
            ],
        ]);

        $this->assertCount(1, $sanitized['placedFields']);
        $this->assertSame('text', $sanitized['placedFields'][0]['type']);
    }

    public function test_sanitize_preserves_layout_metadata(): void
    {
        $sanitized = TemplateEditorState::sanitize([
            'placedFields' => [
                [
                    'id' => 3, 'type' => 'checkbox', 'pageNum' => 2,
                    'x' => 12, 'y' => 34, 'w' => 28, 'h' => 28,
                    'label' => 'I agree', 'required' => true,
                ],
            ],
            'scale'      => 4.5,
            'activePage' => 2,
        ]);

        $field = $sanitized['placedFields'][0];
        $this->assertSame(3, $field['id']);
        $this->assertSame(2, $field['pageNum']);
        $this->assertSame('I agree', $field['label']);
        $this->assertTrue($field['required']);
        $this->assertFalse($field['value']);
        $this->assertSame(3.0, $sanitized['scale']);
        $this->assertSame(2, $sanitized['activePage']);
    }

    public function test_for_sign_document_excludes_signing_session_keys(): void
    {
        $docState = TemplateEditorState::forSignDocument([
            'placedFields' => [
                [
                    'id' => 1, 'type' => 'initials', 'pageNum' => 1,
                    'x' => 0, 'y' => 0, 'w' => 90, 'h' => 40,
                    'value' => ['sigType' => 'text', 'src' => 'Initials'],
                ],
            ],
            'signingMode' => 'self',
        ]);

        $this->assertArrayHasKey('placedFields', $docState);
        $this->assertArrayNotHasKey('signingMode', $docState);
        $this->assertArrayNotHasKey('savedSignature', $docState);
    }
}
