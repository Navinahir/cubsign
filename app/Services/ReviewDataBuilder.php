<?php

namespace App\Services;

use App\Models\Document;

class ReviewDataBuilder
{
    public function __construct(
        private readonly PlacedFieldsService $placedFieldsService,
    ) {}

    /**
     * Build review summary from persisted editor_state.placedFields (single source of truth).
     *
     * @return array{pageCount: int, fieldCount: int, recipientCount: int, recipients: list<array<string, mixed>>}
     */
    public function fromDocument(Document $document): array
    {
        $state        = $document->editor_state ?? [];
        $placedFields = $state['placedFields'] ?? [];
        $recipients   = $state['recipients'] ?? [];

        $namedRecipients = $this->placedFieldsService->recipientSummaries($placedFields, $recipients);

        return [
            'pageCount'      => (int) ($state['pageCount'] ?? 0),
            'fieldCount'     => count($placedFields),
            'recipientCount' => count($namedRecipients),
            'recipients'     => $namedRecipients,
        ];
    }
}
