<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\FaqController;
use App\Http\Controllers\Web\FeaturesController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\OverviewController;
use App\Http\Controllers\Web\PricingController;
use Illuminate\Support\Facades\Route;

// Public website
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

require __DIR__.'/auth.php';
