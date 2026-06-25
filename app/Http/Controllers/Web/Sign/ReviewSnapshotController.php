<?php

namespace App\Http\Controllers\Web\Sign;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewSnapshotController extends Controller
{
    /**
     * Persist review metadata in the PHP session so /sign/review survives hard refresh.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $token = $request->session()->get('sign_token');

        if (! $token) {
            return response()->json(['message' => 'No active signing session.'], 403);
        }

        $validated = $request->validate([
            'reviewData' => ['required', 'array'],
        ]);

        $request->session()->put('sign_review_snapshot', $validated['reviewData']);

        return response()->json(['ok' => true]);
    }
}
