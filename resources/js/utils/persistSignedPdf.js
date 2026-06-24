/**
 * Upload owner-signed PDF bytes to POST /sign/save (authenticated only).
 * Sets documents.pdf_path and status = signed on the server.
 */
export async function persistSignedPdf(bytes, filename) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const form = new FormData();
    form.append('pdf', blob, filename ?? 'document.pdf');

    const xsrfToken = decodeURIComponent(
        document.cookie.split('; ')
            .find((r) => r.startsWith('XSRF-TOKEN='))
            ?.split('=')[1] ?? '',
    );

    const res = await fetch(route('sign.save'), {
        method:  'POST',
        headers: { 'X-XSRF-TOKEN': xsrfToken },
        body:    form,
    });

    if (!res.ok) {
        return { ok: false, id: null };
    }

    const data = await res.json().catch(() => ({}));
    return { ok: true, id: data.id ?? null };
}
