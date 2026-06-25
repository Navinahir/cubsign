<?php

namespace App\Services;

use App\Models\Document;

class RequestSigningValidator
{
    public function __construct(
        private readonly PlacedFieldsService $placedFieldsService,
    ) {}

    /**
     * @param  list<array<string, mixed>>  $recipients
     * @return list<string>
     */
    public function validateSendPayload(Document $document, array $recipients): array
    {
        $errors = [];

        if ($recipients === []) {
            $errors[] = 'At least one recipient is required.';

            return $errors;
        }

        $placedFields = ($document->editor_state ?? [])['placedFields'] ?? [];
        $seenEmails   = [];

        foreach ($recipients as $data) {
            $name  = trim((string) ($data['name'] ?? ''));
            $email = strtolower(trim((string) ($data['email'] ?? '')));
            $editorId = $data['editor_recipient_id'] ?? null;

            if ($name === '') {
                $errors[] = 'Every recipient must have a name.';
            }

            if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $label = $name !== '' ? $name : 'A recipient';
                $errors[] = "{$label} must have a valid email address.";
            }

            if ($email !== '') {
                if (isset($seenEmails[$email])) {
                    $errors[] = "Duplicate email address: {$data['email']}.";
                }
                $seenEmails[$email] = true;
            }

            $fieldCount = count($this->placedFieldsService->fieldsForSigner($placedFields, $editorId));
            if ($fieldCount === 0) {
                $label = $name !== '' ? $name : 'A recipient';
                $errors[] = "Recipient {$label} has no assigned fields.";
            }
        }

        return $errors;
    }
}
