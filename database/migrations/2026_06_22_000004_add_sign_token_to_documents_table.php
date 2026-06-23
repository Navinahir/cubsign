<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private function columnExists(): bool
    {
        $result = DB::selectOne(
            "SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME   = 'documents'
               AND COLUMN_NAME  = 'sign_token'"
        );
        return (int) $result->cnt > 0;
    }

    public function up(): void
    {
        if ($this->columnExists()) {
            return;
        }

        Schema::table('documents', function (Blueprint $table) {
            $table->string('sign_token')->nullable()->unique()->after('pdf_path');
        });
    }

    public function down(): void
    {
        if (!$this->columnExists()) {
            return;
        }

        Schema::table('documents', function (Blueprint $table) {
            $table->dropUnique(['sign_token']);
            $table->dropColumn('sign_token');
        });
    }
};
