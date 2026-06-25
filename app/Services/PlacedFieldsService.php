<?php

namespace App\Services;

class PlacedFieldsService
{
    public const FIELD_TYPES = [
        'signature',
        'initials',
        'name',
        'date',
        'text',
        'checkbox',
    ];

    /**
     * Normalize editor recipient / signer id for reliable comparison.
     */
    public function normalizeSignerId(mixed $id): ?int
    {
        if ($id === null || $id === '') {
            return null;
        }

        if (is_int($id)) {
            return $id;
        }

        if (is_string($id) && ctype_digit($id)) {
            return (int) $id;
        }

        if (is_float($id) && (int) $id == $id) {
            return (int) $id;
        }

        return null;
    }

    /**
     * @param  list<array<string, mixed>>  $placedFields
     * @return list<array<string, mixed>>
     */
    public function fieldsForSigner(array $placedFields, mixed $signerId): array
    {
        $target = $this->normalizeSignerId($signerId);

        if ($target === null) {
            return [];
        }

        return array_values(array_filter(
            $placedFields,
            fn (array $field) => $this->normalizeSignerId($field['signerId'] ?? null) === $target
        ));
    }

    /**
     * @param  list<array<string, mixed>>  $placedFields
     * @return array<string, int>
     */
    public function fieldTypesForSigner(array $placedFields, mixed $signerId): array
    {
        $counts = array_fill_keys(self::FIELD_TYPES, 0);

        foreach ($this->fieldsForSigner($placedFields, $signerId) as $field) {
            $type = (string) ($field['type'] ?? '');
            if (isset($counts[$type])) {
                $counts[$type]++;
            }
        }

        return $counts;
    }

    /**
     * @param  list<array<string, mixed>>  $placedFields
     * @param  list<array<string, mixed>>  $recipients
     * @return list<array<string, mixed>>
     */
    public function recipientSummaries(array $placedFields, array $recipients): array
    {
        return collect($recipients)
            ->filter(fn (array $r) => ! empty($r['name']) || ! empty($r['email']))
            ->map(function (array $r) use ($placedFields) {
                $assignedFields = $this->fieldsForSigner($placedFields, $r['id'] ?? null);
                $fieldTypes      = $this->fieldTypesForSigner($placedFields, $r['id'] ?? null);

                return [
                    'id'                    => $r['id'],
                    'name'                  => $r['name'] ?? '',
                    'email'                 => $r['email'] ?? '',
                    'color'                 => $r['color'] ?? '#3B82F6',
                    'signingOrder'          => $r['signingOrder'] ?? 1,
                    'assignedFields'        => $assignedFields,
                    'assigned_fields_count' => count($assignedFields),
                    'assigned_field_types'  => $fieldTypes,
                    'fieldCount'            => count($assignedFields),
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @param  list<array<string, mixed>>  $placedFields
     * @return array{document_id: int|null, recipient_id: int|null, field_count: int, field_types: array<string, int>, field_ids: list<int>}
     */
    public function logPayload(?int $documentId, ?int $recipientId, array $placedFields, mixed $signerId = null): array
    {
        $fields = $signerId !== null
            ? $this->fieldsForSigner($placedFields, $signerId)
            : $placedFields;

        $typeCounts = [];
        foreach ($fields as $field) {
            $type = (string) ($field['type'] ?? 'unknown');
            $typeCounts[$type] = ($typeCounts[$type] ?? 0) + 1;
        }

        return [
            'document_id'  => $documentId,
            'recipient_id' => $recipientId,
            'field_count'  => count($fields),
            'field_types'  => $typeCounts,
            'field_ids'    => array_values(array_map(
                fn (array $f) => (int) ($f['id'] ?? 0),
                $fields
            )),
        ];
    }
}
