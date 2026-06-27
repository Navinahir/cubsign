<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your CubArrow Sign account</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .wrapper { max-width: 560px; margin: 40px auto; }
        .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .header { background: #ffffff; padding: 28px 36px; border-bottom: 1px solid #f3f4f6; }
        .body { padding: 36px; }
        .title { font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 8px; }
        .subtitle { font-size: 15px; color: #6b7280; margin: 0 0 28px; line-height: 1.6; }
        .btn-wrap { text-align: center; margin-bottom: 28px; }
        .btn { display: inline-block; background: #1e40af; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 36px; border-radius: 8px; }
        .expiry { font-size: 13px; color: #9ca3af; margin: 0 0 16px; text-align: center; }
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
                @include('emails.partials.logo')
            </div>

            <div class="body">
                <p class="title">Welcome to CubArrow Sign</p>
                <p class="subtitle">
                    Hi {{ $user->name }},<br><br>
                    Please verify your email to activate your account and securely sign documents.
                </p>

                <div class="btn-wrap">
                    <a href="{{ $verificationUrl }}" class="btn">Verify Email</a>
                </div>

                <p class="expiry">This link expires in {{ $expiresHours }} hours.</p>

                <p class="fallback">Or copy this link into your browser:</p>
                <p class="fallback-url">{{ $verificationUrl }}</p>
            </div>

            <div class="footer">
                <p class="footer-text">
                    You received this email because someone created a CubArrow Sign account with this address.
                    If you did not create an account, you can safely ignore this email.
                </p>
            </div>

        </div>
    </div>
</body>
</html>
