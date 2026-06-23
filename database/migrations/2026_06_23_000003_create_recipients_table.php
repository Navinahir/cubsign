<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('recipients')) {
            return;
        }

        Schema::create('recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('color', 10)->default('#3B82F6');
            $table->unsignedTinyInteger('signing_order')->default(1);
            $table->unsignedInteger('editor_recipient_id');
            $table->string('status', 20)->default('pending'); // pending|sent|opened|signed
            $table->string('sign_token', 64)->nullable()->unique();
            $table->timestamp('signed_at')->nullable();
            $table->text('signed_fields')->nullable(); // JSON stored as text for MySQL 5.6
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipients');
    }
};
