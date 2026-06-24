<?php

namespace App\Services;

use App\Models\Document;

class ReviewDataBuilder
{
    /**
     * Build review summary from persisted editor_state.
     *
     * @return array{pageCount: int, fieldCount: int, recipientCount: int, recipients: list<array<string, mixed>>}
     */
    public function fromDocument(Document $document): array
    {
        $state        = $document->editor_state ?? [];
        $placedFields = $state['placedFields'] ?? [];
        $recipients   = $state['recipients'] ?? [];

        $recipientFieldCounts = [];
        foreach ($placedFields as $field) {
            $signerId = $field['signerId'] ?? null;
            if ($signerId !== null) {
                $recipientFieldCounts[$signerId] = ($recipientFieldCounts[$signerId] ?? 0) + 1;
            }
        }

        $namedRecipients = collect($recipients)
            ->filter(fn ($r) => ! empty($r['name']) || ! empty($r['email']))
            ->map(fn ($r) => [
                'id'           => $r['id'],
                'name'         => $r['name'] ?? '',
                'email'        => $r['email'] ?? '',
                'color'        => $r['color'] ?? '#3B82F6',
                'signingOrder' => $r['signingOrder'] ?? 1,
                'fieldCount'   => $recipientFieldCounts[$r['id']] ?? 0,
            ])
            ->values()
            ->all();

        return [
            'pageCount'      => (int) ($state['pageCount'] ?? 0),
            'fieldCount'     => count($placedFields),
            'recipientCount' => count($namedRecipients),
            'recipients'     => $namedRecipients,
        ];
    }
}
