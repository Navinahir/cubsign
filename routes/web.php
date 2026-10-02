<?php

use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\AboutController;
use App\Http\Controllers\Web\BlogController;
use App\Http\Controllers\Web\BlogRssController;
use App\Http\Controllers\Web\ContactController;
use App\Http\Controllers\Web\CookiePolicyController;
use App\Http\Controllers\Web\FaqController;
use App\Http\Controllers\Web\FeaturesController;
use App\Http\Controllers\Web\HelpCenterController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\OverviewController;
use App\Http\Controllers\Web\PricingController;
use App\Http\Controllers\Web\PrivacyController;
use App\Http\Controllers\Web\SecurityController;
use App\Http\Controllers\Web\SitemapController;
use App\Http\Controllers\Web\TermsController;
use App\Http\Controllers\Web\Sign\CompleteController as SignCompleteController;
use App\Http\Controllers\Web\Sign\SentController as SignSentController;
use App\Http\Controllers\Web\Sign\EditorController as SignEditorController;
use App\Http\Controllers\Web\Sign\PdfController as SignPdfController;
use App\Http\Controllers\Web\Sign\ReviewController as SignReviewController;
use App\Http\Controllers\Web\Sign\UploadController as SignUploadController;
use App\Http\Controllers\Web\Sign\SaveDocumentController as SignSaveDocumentController;
use App\Http\Controllers\Web\Workspace\AdminDashboardController;
use App\Http\Controllers\Web\Workspace\BlogCategoriesController;
use App\Http\Controllers\Web\Workspace\BlogsController;
use App\Http\Controllers\Web\Workspace\DocumentDownloadController;
use App\Http\Controllers\RecipientSignController;
use App\Http\Controllers\Web\Workspace\DocumentsController;
use App\Http\Controllers\Web\Workspace\TemplatesController;
use Illuminate\Support\Facades\Route;

// Public website — always visible, no auth redirect
Route::get('/', HomeController::class)->name('home');
Route::get('/dashboard', function () {
    $user = auth()->user();

    return redirect()->route($user?->homeRouteName() ?? 'overview');
})->name('dashboard');
Route::get('/features', FeaturesController::class)->name('features');
Route::get('/pricing', PricingController::class)->name('pricing');
Route::get('/faq', FaqController::class)->name('faq');
Route::get('/help-center', [HelpCenterController::class, 'index'])->name('help-center');
Route::get('/help-center/{slug}', [HelpCenterController::class, 'show'])->name('help-center.show');
Route::get('/about', AboutController::class)->name('about');
Route::get('/contact', ContactController::class)->name('contact');
Route::get('/security', SecurityController::class)->name('security');
Route::get('/privacy', PrivacyController::class)->name('privacy');
Route::get('/terms', TermsController::class)->name('terms');
Route::get('/cookies', CookiePolicyController::class)->name('cookies');
Route::get('/blog', [BlogController::class, 'index'])->name('blog');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
Route::get('/rss.xml', BlogRssController::class)->name('blog.rss');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

// Google OAuth
Route::get('/auth/google', [SocialiteController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [SocialiteController::class, 'callback'])->name('auth.google.callback');

// Workspace — authenticated + verified
Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware('role:user')->group(function () {
        Route::get('/overview',                           OverviewController::class)->name('overview');
        Route::get('/documents',                          [DocumentsController::class, 'index'])->name('documents.index');
        Route::get('/documents/{document}',               [DocumentsController::class, 'show'])->name('documents.show');
        Route::get('/documents/{document}/download',      DocumentDownloadController::class)->name('documents.download');
        Route::patch('/documents/{document}/rename',      [DocumentsController::class, 'rename'])->name('documents.rename');
        Route::patch('/documents/{document}/archive',     [DocumentsController::class, 'archive'])->name('documents.archive');
        Route::patch('/documents/{document}/editor-state',[DocumentsController::class, 'saveEditorState'])->name('documents.editor-state');
        Route::post('/documents/{document}/open',         [DocumentsController::class, 'open'])->name('documents.open');
        Route::post('/documents/{document}/send',         [DocumentsController::class, 'send'])->name('documents.send');
        Route::delete('/documents/{document}',            [DocumentsController::class, 'destroy'])->name('documents.destroy');
        Route::get('/templates',                          [TemplatesController::class, 'index'])->name('templates.index');
        Route::get('/templates/create',                   [TemplatesController::class, 'create'])->name('templates.create');
        Route::post('/templates',                         [TemplatesController::class, 'store'])->name('templates.store');
        Route::get('/templates/{template}',               [TemplatesController::class, 'show'])->name('templates.show');
        Route::get('/templates/{template}/edit',          [TemplatesController::class, 'edit'])->name('templates.edit');
        Route::get('/templates/{template}/preview',       [TemplatesController::class, 'preview'])->name('templates.preview');
        Route::get('/templates/{template}/pdf',           [TemplatesController::class, 'pdf'])->name('templates.pdf');
        Route::put('/templates/{template}',               [TemplatesController::class, 'update'])->name('templates.update');
        Route::delete('/templates/{template}',            [TemplatesController::class, 'destroy'])->name('templates.destroy');
        Route::post('/templates/{template}/use',          [TemplatesController::class, 'useTemplate'])->name('templates.use');
        Route::post('/templates/{template}/duplicate',    [TemplatesController::class, 'duplicate'])->name('templates.duplicate');
        Route::post('/templates/{template}/replace-pdf',  [TemplatesController::class, 'replacePdf'])->name('templates.replace-pdf');
    });

    // Admin workspace — Blog CMS and Admin Dashboard only
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin',                    AdminDashboardController::class)->name('admin.dashboard');
        Route::get('/blogs',                    [BlogsController::class, 'index'])->name('blogs.index');
        Route::get('/blogs/create',             [BlogsController::class, 'create'])->name('blogs.create');
        Route::post('/blogs',                   [BlogsController::class, 'store'])->name('blogs.store');
        Route::post('/blogs/upload-image',      [BlogsController::class, 'uploadImage'])->name('blogs.upload-image');
        Route::delete('/blogs',                 [BlogsController::class, 'destroyMany'])->name('blogs.destroy-many');
        Route::get('/blogs/{blog}',             [BlogsController::class, 'show'])->name('blogs.show');
        Route::get('/blogs/{blog}/edit',        [BlogsController::class, 'edit'])->name('blogs.edit');
        Route::put('/blogs/{blog}',             [BlogsController::class, 'update'])->name('blogs.update');
        Route::delete('/blogs/{blog}',          [BlogsController::class, 'destroy'])->name('blogs.destroy');

        Route::get('/blog-categories',                      [BlogCategoriesController::class, 'index'])->name('blog-categories.index');
        Route::get('/blog-categories/create',               [BlogCategoriesController::class, 'create'])->name('blog-categories.create');
        Route::post('/blog-categories',                     [BlogCategoriesController::class, 'store'])->name('blog-categories.store');
        Route::post('/blog-categories/quick',               [BlogCategoriesController::class, 'quickStore'])->name('blog-categories.quick');
        Route::get('/blog-categories/{blog_category}/edit', [BlogCategoriesController::class, 'edit'])->name('blog-categories.edit');
        Route::put('/blog-categories/{blog_category}',      [BlogCategoriesController::class, 'update'])->name('blog-categories.update');
        Route::delete('/blog-categories/{blog_category}',   [BlogCategoriesController::class, 'destroy'])->name('blog-categories.destroy');
    });
});

// Profile — authenticated account holders; admins stay in the admin workspace
Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Signing flow — public; no auth or verification required
Route::prefix('sign')->name('sign.')->group(function () {
    Route::get('/',        [SignUploadController::class, 'show'])->name('index');
    Route::post('/',       [SignUploadController::class, 'store'])->name('store');
    Route::get('/editor',  SignEditorController::class)->name('editor');
    Route::get('/pdf',     SignPdfController::class)->name('pdf');
    Route::get('/review',  SignReviewController::class)->name('review');
    Route::post('/review-snapshot', \App\Http\Controllers\Web\Sign\ReviewSnapshotController::class)->name('review.snapshot');
    Route::get('/complete', SignCompleteController::class)->name('complete');
    Route::get('/sent', SignSentController::class)->name('sent')->middleware('auth');
    Route::middleware('auth')->post('/save', SignSaveDocumentController::class)->name('save');
});

// Recipient signing — public, token-gated
Route::prefix('r')->name('recipient.')->group(function () {
    Route::get('/{token}',          [RecipientSignController::class, 'show'])->name('sign');
    Route::get('/{token}/pdf',      [RecipientSignController::class, 'pdf'])->name('pdf');
    Route::post('/{token}/complete', [RecipientSignController::class, 'complete'])->name('complete');
});

require __DIR__.'/auth.php';
