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
            'activePage'  => 3,
        ]);

        $this->assertArrayHasKey('placedFields', $docState);
        $this->assertArrayHasKey('scale', $docState);
        $this->assertArrayNotHasKey('signingMode', $docState);
        $this->assertArrayNotHasKey('savedSignature', $docState);
        $this->assertArrayNotHasKey('activePage', $docState);
        $this->assertArrayNotHasKey('recipients', $docState);
    }

    public function test_for_sign_document_resets_placeholders_and_resequences_ids(): void
    {
        $docState = TemplateEditorState::forSignDocument([
            'placedFields' => [
                [
                    'id' => 99, 'type' => 'signature', 'pageNum' => 1,
                    'x' => 10, 'y' => 20, 'w' => 180, 'h' => 60,
                    'signerId' => 2, 'signingMode' => 'request',
                    'value' => ['sigType' => 'image', 'src' => 'data:image/png;base64,x'],
                ],
                [
                    'id' => 50, 'type' => 'initials', 'pageNum' => 1,
                    'x' => 0, 'y' => 0, 'w' => 90, 'h' => 40,
                    'signerId' => 2,
                ],
                [
                    'id' => 7, 'type' => 'name', 'pageNum' => 1,
                    'x' => 0, 'y' => 40, 'w' => 160, 'h' => 32,
                    'value' => 'Jane Doe',
                ],
                [
                    'id' => 8, 'type' => 'text', 'pageNum' => 1,
                    'x' => 0, 'y' => 80, 'w' => 160, 'h' => 32,
                    'value' => 'Filled in',
                ],
                [
                    'id' => 9, 'type' => 'date', 'pageNum' => 1,
                    'x' => 0, 'y' => 120, 'w' => 140, 'h' => 32,
                    'value' => '6/26/2026',
                ],
                [
                    'id' => 10, 'type' => 'checkbox', 'pageNum' => 2,
                    'x' => 12, 'y' => 34, 'w' => 28, 'h' => 28,
                    'label' => 'I agree', 'required' => true,
                    'value' => true,
                ],
            ],
        ]);

        $this->assertCount(6, $docState['placedFields']);

        $expectedIds = [1, 2, 3, 4, 5, 6];
        $this->assertSame($expectedIds, array_column($docState['placedFields'], 'id'));

        $byType = collect($docState['placedFields'])->keyBy('type');

        $this->assertSame(['sigType' => 'text', 'src' => 'Signature'], $byType['signature']['value']);
        $this->assertSame(['sigType' => 'text', 'src' => 'Initials'], $byType['initials']['value']);
        $this->assertSame('', $byType['name']['value']);
        $this->assertSame('', $byType['text']['value']);
        $this->assertSame('', $byType['date']['value']);
        $this->assertFalse($byType['checkbox']['value']);
        $this->assertSame('I agree', $byType['checkbox']['label']);
        $this->assertTrue($byType['checkbox']['required']);

        foreach ($docState['placedFields'] as $field) {
            $this->assertArrayNotHasKey('signerId', $field);
            $this->assertArrayNotHasKey('signingMode', $field);
            $this->assertSame(
                ['id', 'type', 'pageNum', 'x', 'y', 'w', 'h', 'label', 'required', 'value'],
                array_keys($field),
            );
        }
    }

    public function test_is_simple_self_sign_layout(): void
    {
        $this->assertTrue(TemplateEditorState::isSimpleSelfSignLayout([]));

        $this->assertTrue(TemplateEditorState::isSimpleSelfSignLayout([
            ['type' => 'signature'],
            ['type' => 'initials'],
            ['type' => 'date'],
            ['type' => 'name'],
        ]));

        $this->assertFalse(TemplateEditorState::isSimpleSelfSignLayout([
            ['type' => 'signature'],
            ['type' => 'signature'],
        ]));

        $this->assertFalse(TemplateEditorState::isSimpleSelfSignLayout([
            ['type' => 'signature'],
            ['type' => 'text'],
        ]));

        $this->assertFalse(TemplateEditorState::isSimpleSelfSignLayout([
            ['type' => 'checkbox'],
        ]));
    }

    public function test_for_sign_document_applies_self_sign_defaults_for_simple_layout(): void
    {
        $owner = (object) ['name' => 'Alex Owner', 'email' => 'alex@example.com'];

        $docState = TemplateEditorState::forSignDocument([
            'placedFields' => [
                [
                    'id' => 1, 'type' => 'signature', 'pageNum' => 1,
                    'x' => 10, 'y' => 20, 'w' => 180, 'h' => 60,
                ],
                [
                    'id' => 2, 'type' => 'date', 'pageNum' => 1,
                    'x' => 0, 'y' => 0, 'w' => 140, 'h' => 32,
                ],
            ],
        ], $owner);

        $this->assertSame('self', $docState['signingMode']);
        $this->assertSame(1, $docState['activeRecipientId']);
        $this->assertCount(1, $docState['recipients']);
        $this->assertSame('Alex Owner', $docState['recipients'][0]['name']);
        $this->assertSame('alex@example.com', $docState['recipients'][0]['email']);

        foreach ($docState['placedFields'] as $field) {
            $this->assertSame(1, $field['signerId']);
            $this->assertSame('self', $field['signingMode']);
        }
    }

    public function test_for_sign_document_omits_signing_defaults_for_complex_layout(): void
    {
        $owner = (object) ['name' => 'Alex Owner', 'email' => 'alex@example.com'];

        $docState = TemplateEditorState::forSignDocument([
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
        ], $owner);

        $this->assertArrayNotHasKey('signingMode', $docState);
        $this->assertArrayNotHasKey('recipients', $docState);
        $this->assertArrayNotHasKey('signerId', $docState['placedFields'][0]);
        $this->assertArrayNotHasKey('signingMode', $docState['placedFields'][0]);
    }
}
