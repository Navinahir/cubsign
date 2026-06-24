<?php

namespace App\Services;

use App\Models\Recipient;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class RecipientSignatureStorage
{
    /**
     * Persist signature/initials images to the documents disk; keep text values inline.
     *
     * @param  list<array{id: int, type: string, value: mixed}>  $signedFields
     * @return list<array{id: int, type: string, value: mixed}>
     */
    public function persistImages(Recipient $recipient, array $signedFields): array
    {
        $normalized = [];

        foreach ($signedFields as $field) {
            $type  = (string) ($field['type'] ?? '');
            $value = $field['value'] ?? '';
            $id    = (int) ($field['id'] ?? 0);

            if ($id === 0) {
                continue;
            }

            if (in_array($type, ['signature', 'initials'], true) && is_string($value) && $value !== '') {
                if (str_starts_with($value, 'signatures/')) {
                    $normalized[] = ['id' => $id, 'type' => $type, 'value' => $value];
                    continue;
                }

                if (str_starts_with($value, 'data:image/')) {
                    $path = $this->storeDataUri($recipient, $id, $value);
                    if ($path) {
                        Log::channel('cubsign')->info('RecipientSignatureStorage: image saved', [
                            'recipient_id' => $recipient->id,
                            'field_id'     => $id,
                            'path'         => $path,
                            'bytes'        => Storage::disk('documents')->size($path),
                        ]);
                        $normalized[] = ['id' => $id, 'type' => $type, 'value' => $path];
                        continue;
                    }

                    Log::channel('cubsign')->warning('RecipientSignatureStorage: failed to decode image', [
                        'recipient_id' => $recipient->id,
                        'field_id'     => $id,
                    ]);
                }
            }

            $normalized[] = ['id' => $id, 'type' => $type, 'value' => $value];
        }

        return $normalized;
    }

    private function storeDataUri(Recipient $recipient, int $fieldId, string $dataUri): ?string
    {
        if (! preg_match('#^data:image/(png|jpeg|jpg);base64,(.+)$#s', $dataUri, $matches)) {
            return null;
        }

        $ext  = $matches[1] === 'jpeg' || $matches[1] === 'jpg' ? 'jpg' : 'png';
        $data = base64_decode($matches[2], true);

        if ($data === false || $data === '') {
            return null;
        }

        $relPath = "signatures/recipient_{$recipient->id}/field_{$fieldId}.{$ext}";

        Storage::disk('documents')->makeDirectory("signatures/recipient_{$recipient->id}");
        Storage::disk('documents')->put($relPath, $data);

        return $relPath;
    }
}
