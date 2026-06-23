<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // sign_token was added in a previous partial run; editor_state uses longText for older MySQL compat
        Schema::table('documents', function (Blueprint $table) {
            $table->longText('editor_state')->nullable()->after('sign_token');
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn(['sign_token', 'editor_state']);
        });
    }
};
