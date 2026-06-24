/**
 * POST owner-signed PDF bytes to /sign/save (authenticated users only).
 */
export async function persistSignedPdf(bytes, filename) {
    console.log('PERSIST_SIGNED_PDF_INVOKED', { byteLength: bytes?.byteLength ?? bytes?.length ?? 0, filename });
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
        credentials: 'same-origin',
        headers: { 'X-XSRF-TOKEN': xsrfToken },
        body:    form,
    });

    const data = await res.json().catch(() => ({}));

    return {
        ok:     res.ok,
        status: res.status,
        data,
    };
}
