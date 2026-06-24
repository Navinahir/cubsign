<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signature requested</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .wrapper { max-width: 560px; margin: 40px auto; }
        .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .header { background: #1e40af; padding: 28px 36px; }
        .logo { color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.3px; text-decoration: none; }
        .logo span { color: #93c5fd; }
        .body { padding: 36px; }
        .title { font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 8px; }
        .subtitle { font-size: 15px; color: #6b7280; margin: 0 0 28px; line-height: 1.5; }
        .doc-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin-bottom: 28px; }
        .doc-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px; }
        .doc-name { font-size: 15px; font-weight: 600; color: #1f2937; margin: 0; }
        .btn-wrap { text-align: center; margin-bottom: 28px; }
        .btn { display: inline-block; background: #1e40af; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 36px; border-radius: 8px; }
        .fallback { font-size: 13px; color: #9ca3af; margin: 0 0 4px; }
        .fallback-url { font-size: 12px; color: #6b7280; word-break: break-all; }
        .footer { border-top: 1px solid #f3f4f6; padding: 20px 36px; }
        .footer-text { font-size: 12px; color: #9ca3af; margin: 0; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">

            <div class="header">
                <a href="{{ config('app.url') }}" class="logo">Cub<span>Sign</span></a>
            </div>

            <div class="body">
                <p class="title">Your signature is requested</p>
                <p class="subtitle">
                    Hi {{ $recipient->name }}, <strong>{{ $ownerName }}</strong> has asked you to review and sign the following document.
                </p>

                <div class="doc-box">
                    <p class="doc-label">Document</p>
                    <p class="doc-name">{{ $documentName }}</p>
                </div>

                <div class="btn-wrap">
                    <a href="{{ $signUrl }}" class="btn">Review &amp; Sign</a>
                </div>

                <p class="fallback">Or copy this link into your browser:</p>
                <p class="fallback-url">{{ $signUrl }}</p>
            </div>

            <div class="footer">
                <p class="footer-text">
                    You received this email because {{ $ownerName }} sent you a signing request via CubSign.
                    If you did not expect this, you can safely ignore it.
                </p>
            </div>

        </div>
    </div>
</body>
</html>
