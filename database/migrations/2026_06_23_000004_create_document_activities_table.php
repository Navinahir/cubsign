<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('document_activities')) {
            return;
        }

        Schema::create('document_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('recipient_id')->nullable();
            $table->foreign('recipient_id')->references('id')->on('recipients')->nullOnDelete();
            $table->string('event', 40); // created|sent|opened|signed|completed
            $table->text('meta')->nullable(); // JSON stored as text for MySQL 5.6
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_activities');
    }
};
