<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * 301 trailing-slash URLs to their slashless equivalents for GET/HEAD.
 *
 * Skips real directories under public/ so /images/, /build/, /storage/ are untouched.
 * Complements root .htaccess when requests reach the Laravel front controller
 * (Hostinger document root is the project root, not public/).
 */
class RedirectTrailingSlash
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! in_array($request->method(), ['GET', 'HEAD'], true)) {
            return $next($request);
        }

        $path = $request->getPathInfo();

        if ($path === '/' || ! str_ends_with($path, '/')) {
            return $next($request);
        }

        $relative = trim($path, '/');

        if ($relative !== '' && is_dir(public_path($relative))) {
            return $next($request);
        }

        $target = '/'.$relative;
        $query = $request->getQueryString();

        if ($query !== null && $query !== '') {
            $target .= '?'.$query;
        }

        return redirect()->to($target, 301);
    }
}
