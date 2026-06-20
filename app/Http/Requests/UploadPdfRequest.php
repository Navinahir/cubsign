<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadPdfRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pdf' => ['required', 'file', 'mimes:pdf', 'max:25600'],
        ];
    }

    public function messages(): array
    {
        return [
            'pdf.required' => 'Please select a PDF file to upload.',
            'pdf.file'     => 'The upload must be a valid file.',
            'pdf.mimes'    => 'Only PDF files are accepted.',
            'pdf.max'      => 'The file must not exceed 25 MB.',
        ];
    }
}
