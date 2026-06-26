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

    /**
     * Editor state for a new Document created from a template — fields only, no signing metadata.
     *
     * @param  array<string, mixed>|null  $templateState
     * @return array<string, mixed>
     */
    public static function forSignDocument(?array $templateState): array
    {
        return self::sanitize($templateState);
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
