<?php

namespace Tests\Unit;

use App\Services\PlacedFieldsService;
use PHPUnit\Framework\TestCase;

class PlacedFieldsServiceTest extends TestCase
{
    private PlacedFieldsService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PlacedFieldsService();
    }

    public function test_fields_for_signer_matches_int_and_string_ids(): void
    {
        $placedFields = [
            ['id' => 1, 'type' => 'signature', 'signerId' => 1],
            ['id' => 2, 'type' => 'initials', 'signerId' => '1'],
            ['id' => 3, 'type' => 'name', 'signerId' => 1],
            ['id' => 4, 'type' => 'date', 'signerId' => 2],
        ];

        $assigned = $this->service->fieldsForSigner($placedFields, 1);

        $this->assertCount(3, $assigned);
        $this->assertSame([1, 2, 3], array_column($assigned, 'id'));
    }

    public function test_recipient_summaries_require_name_and_email(): void
    {
        $placedFields = [
            ['id' => 1, 'type' => 'signature', 'signerId' => 1],
        ];

        $recipients = [
            ['id' => 1, 'name' => 'John', 'email' => '', 'signingOrder' => 1],
            ['id' => 2, 'name' => 'Jane', 'email' => 'jane@example.com', 'signingOrder' => 2],
        ];

        $summaries = $this->service->recipientSummaries($placedFields, $recipients);

        $this->assertCount(1, $summaries);
        $this->assertSame('Jane', $summaries[0]['name']);
    }

    public function test_recipient_summaries_include_all_field_types(): void
    {
        $placedFields = [
            ['id' => 1, 'type' => 'signature', 'signerId' => 1],
            ['id' => 2, 'type' => 'initials', 'signerId' => 1],
            ['id' => 3, 'type' => 'name', 'signerId' => 1],
            ['id' => 4, 'type' => 'date', 'signerId' => 1],
            ['id' => 5, 'type' => 'text', 'signerId' => 1],
            ['id' => 6, 'type' => 'checkbox', 'signerId' => 1],
        ];

        $recipients = [
            ['id' => 1, 'name' => 'John', 'email' => 'john@example.com', 'color' => '#3B82F6', 'signingOrder' => 1],
        ];

        $summaries = $this->service->recipientSummaries($placedFields, $recipients);

        $this->assertCount(1, $summaries);
        $this->assertSame(6, $summaries[0]['assigned_fields_count']);
    }
}
