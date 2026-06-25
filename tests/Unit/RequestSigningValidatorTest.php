<?php

namespace Tests\Unit;

use App\Models\Document;
use App\Services\PlacedFieldsService;
use App\Services\RequestSigningValidator;
use PHPUnit\Framework\TestCase;

class RequestSigningValidatorTest extends TestCase
{
    public function test_rejects_recipient_without_fields(): void
    {
        $document = new Document([
            'editor_state' => [
                'placedFields' => [
                    ['id' => 1, 'type' => 'signature', 'signerId' => 1],
                ],
            ],
        ]);

        $validator = new RequestSigningValidator(new PlacedFieldsService());

        $errors = $validator->validateSendPayload($document, [
            [
                'name'                => 'Jane',
                'email'               => 'jane@example.com',
                'editor_recipient_id' => 2,
            ],
        ]);

        $this->assertNotEmpty($errors);
        $this->assertStringContainsString('no assigned fields', $errors[0]);
    }

    public function test_rejects_duplicate_emails(): void
    {
        $document = new Document([
            'editor_state' => [
                'placedFields' => [
                    ['id' => 1, 'type' => 'signature', 'signerId' => 1],
                    ['id' => 2, 'type' => 'name', 'signerId' => 2],
                ],
            ],
        ]);

        $validator = new RequestSigningValidator(new PlacedFieldsService());

        $errors = $validator->validateSendPayload($document, [
            [
                'name'                => 'Alice',
                'email'               => 'same@example.com',
                'editor_recipient_id' => 1,
            ],
            [
                'name'                => 'Bob',
                'email'               => 'same@example.com',
                'editor_recipient_id' => 2,
            ],
        ]);

        $this->assertNotEmpty($errors);
        $this->assertStringContainsString('Duplicate email', $errors[0]);
    }
}
