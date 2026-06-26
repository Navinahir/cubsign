<?php

namespace App\Support;

/**
 * Template editor_state must only contain reusable field layout data — never signing session values.
 */
class TemplateEditorState
{
    public const ALLOWED_TYPES = [
        'signature',
        'initials',
        'name',
        'text',
        'date',
        'checkbox',
    ];

    public const MAX_FIELDS = 500;

    public const MAX_LABEL_LENGTH = 255;

    /**
     * Sanitize state for storage on a Template record.
     *
     * @param  array<string, mixed>|null  $state
     * @return array<string, mixed>
     */
    public static function sanitize(?array $state): array
    {
        if (! $state) {
            return ['placedFields' => [], 'scale' => 1.3, 'activePage' => 1];
        }

        $fields = [];
        foreach (array_slice($state['placedFields'] ?? [], 0, self::MAX_FIELDS) as $field) {
            if (! is_array($field) || empty($field['type'])) {
                continue;
            }
            $sanitized = self::sanitizeField($field);
            if ($sanitized !== null) {
                $fields[] = $sanitized;
            }
        }

        $scale = isset($state['scale']) ? (float) $state['scale'] : 1.3;
        $scale = max(0.4, min(3.0, $scale));

        $activePage = isset($state['activePage']) ? (int) $state['activePage'] : 1;
        $activePage = max(1, $activePage);

        return [
            'placedFields' => $fields,
            'scale'        => $scale,
            'activePage'   => $activePage,
        ];
    }

    /** Field types allowed on a simple single-signer self-sign template. */
    private const SIMPLE_SELF_SIGN_TYPES = [
        'signature',
        'initials',
        'date',
        'name',
    ];

    /**
     * Prepare editor_state for a brand-new Document from a template.
     *
     * Copies layout only (fields + zoom). Strips signing session metadata, re-sequences
     * field ids, and resets every field value to an empty placeholder.
     *
     * Simple layouts (signature/initials ± date/name, single signer) receive a
     * signingMode of "self", the document owner as recipient, and signer assignments
     * so the Sign Editor opens ready for Just Me. Complex layouts omit signing
     * defaults and behave like a freshly uploaded document.
     *
     * @param  array<string, mixed>|null  $templateState
     * @param  object{name?: string|null, email?: string|null}|null  $owner
     * @return array<string, mixed>
     */
    public static function forSignDocument(?array $templateState, ?object $owner = null): array
    {
        $sanitized = self::sanitize($templateState);

        $fields = [];
        $nextId = 1;
        foreach ($sanitized['placedFields'] as $field) {
            $fields[] = self::fieldForSignDocument($field, $nextId++);
        }

        $state = [
            'placedFields' => $fields,
            'scale'        => $sanitized['scale'],
        ];

        if ($owner !== null && self::isSimpleSelfSignLayout($fields)) {
            $state = self::applySelfSignDefaults($state, $owner);
        }

        return $state;
    }

    /**
     * Simple templates: only signature/initials (± date/name) for a single signer.
     *
     * @param  list<array<string, mixed>>  $fields
     */
    public static function isSimpleSelfSignLayout(array $fields): bool
    {
        $signatureCount = 0;

        foreach ($fields as $field) {
            $type = (string) ($field['type'] ?? '');

            if (! in_array($type, self::SIMPLE_SELF_SIGN_TYPES, true)) {
                return false;
            }

            if ($type === 'signature') {
                $signatureCount++;
            }
        }

        return $signatureCount <= 1;
    }

    /**
     * @param  array<string, mixed>  $state
     * @param  object{name?: string|null, email?: string|null}  $owner
     * @return array<string, mixed>
     */
    private static function applySelfSignDefaults(array $state, object $owner): array
    {
        $state['signingMode']       = 'self';
        $state['recipients']        = [self::ownerRecipient($owner)];
        $state['activeRecipientId'] = 1;
        $state['placedFields']      = array_map(
            static fn (array $field): array => array_merge($field, [
                'signerId'    => 1,
                'signingMode' => 'self',
            ]),
            $state['placedFields'],
        );

        return $state;
    }

    /**
     * @param  object{name?: string|null, email?: string|null}  $owner
     * @return array<string, mixed>
     */
    private static function ownerRecipient(object $owner): array
    {
        return [
            'id'           => 1,
            'name'         => (string) ($owner->name ?? ''),
            'email'        => (string) ($owner->email ?? ''),
            'color'        => '#3B82F6',
            'role'         => 'signer',
            'signingOrder' => 1,
            'status'       => 'pending',
        ];
    }

    /**
     * Single placed field for a new signing document — layout keys only.
     *
     * @param  array<string, mixed>  $field  output of sanitizeField()
     * @return array<string, mixed>
     */
    private static function fieldForSignDocument(array $field, int $id): array
    {
        $type = (string) $field['type'];

        return [
            'id'       => $id,
            'type'     => $type,
            'pageNum'  => $field['pageNum'],
            'x'        => $field['x'],
            'y'        => $field['y'],
            'w'        => $field['w'],
            'h'        => $field['h'],
            'label'    => $field['label'],
            'required' => $field['required'],
            'value'    => self::placeholderValue($type),
        ];
    }

    /**
     * @param  array<string, mixed>  $field
     * @return array<string, mixed>|null
     */
    public static function sanitizeField(array $field): ?array
    {
        $type = (string) ($field['type'] ?? '');
        if (! in_array($type, self::ALLOWED_TYPES, true)) {
            return null;
        }

        $mins = self::minSize($type);

        return [
            'id'       => (int) ($field['id'] ?? 0),
            'type'     => $type,
            'pageNum'  => max(1, (int) ($field['pageNum'] ?? 1)),
            'x'        => max(0.0, min(10000.0, (float) ($field['x'] ?? 0))),
            'y'        => max(0.0, min(10000.0, (float) ($field['y'] ?? 0))),
            'w'        => max($mins['w'], min(2000.0, (float) ($field['w'] ?? $mins['w']))),
            'h'        => max($mins['h'], min(2000.0, (float) ($field['h'] ?? $mins['h']))),
            'label'    => mb_substr((string) ($field['label'] ?? ''), 0, self::MAX_LABEL_LENGTH),
            'required' => (bool) ($field['required'] ?? false),
            'value'    => self::placeholderValue($type),
        ];
    }

    /**
     * @return array{w: float, h: float}
     */
    public static function minSize(string $type): array
    {
        return match ($type) {
            'signature' => ['w' => 60.0, 'h' => 24.0],
            'initials'  => ['w' => 40.0, 'h' => 24.0],
            'checkbox'  => ['w' => 28.0, 'h' => 28.0],
            default     => ['w' => 40.0, 'h' => 24.0],
        };
    }

    /**
     * @return array<string, mixed>|string|bool
     */
    public static function placeholderValue(string $type): array|string|bool
    {
        return match ($type) {
            'signature' => ['sigType' => 'text', 'src' => 'Signature'],
            'initials'  => ['sigType' => 'text', 'src' => 'Initials'],
            'checkbox'  => false,
            default     => '',
        };
    }
}
