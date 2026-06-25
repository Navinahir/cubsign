<?php

namespace App\Providers;

use App\Models\Document;
use Illuminate\Database\Schema\Builder;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Builder::defaultStringLength(191);
        Vite::prefetch(concurrency: 3);

        Route::bind('document', function (string $value) {
            if (! auth()->check()) {
                abort(404);
            }

            $document = Document::query()
                ->where('id', $value)
                ->where('user_id', auth()->id())
                ->first();

            if (! $document) {
                throw new HttpResponseException(
                    redirect()->route('documents.index')->with('status', 'document-unavailable')
                );
            }

            return $document;
        });
    }
}
