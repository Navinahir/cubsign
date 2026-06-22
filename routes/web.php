<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\FaqController;
use App\Http\Controllers\Web\FeaturesController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\OverviewController;
use App\Http\Controllers\Web\PricingController;
use App\Http\Controllers\Web\Sign\UploadController as SignUploadController;
use App\Http\Controllers\Web\Sign\EditorController as SignEditorController;
use App\Http\Controllers\Web\Sign\PdfController as SignPdfController;
use App\Http\Controllers\Web\Sign\CompleteController as SignCompleteController;
use App\Http\Controllers\Web\Sign\ReviewController as SignReviewController;
use Illuminate\Support\Facades\Route;

// Public website — always visible, no auth redirect
Route::get('/', HomeController::class)->name('home');
Route::get('/features', FeaturesController::class)->name('features');
Route::get('/pricing', PricingController::class)->name('pricing');
Route::get('/faq', FaqController::class)->name('faq');

// Workspace (authenticated)
Route::get('/overview', OverviewController::class)
    ->middleware(['auth', 'verified'])
    ->name('overview');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Signing flow — guests + authenticated, token stored in session (not URL)
Route::prefix('sign')->name('sign.')->group(function () {
    Route::get('/', [SignUploadController::class, 'show'])->name('index');
    Route::post('/', [SignUploadController::class, 'store'])->name('store');
    Route::get('/editor', SignEditorController::class)->name('editor');
    Route::get('/pdf', SignPdfController::class)->name('pdf');
    Route::get('/review', SignReviewController::class)->name('review');
    Route::get('/complete', SignCompleteController::class)->name('complete');
});

require __DIR__.'/auth.php';
