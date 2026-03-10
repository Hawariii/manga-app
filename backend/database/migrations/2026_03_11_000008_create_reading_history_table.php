<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reading_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('manga_id')->constrained('mangas')->cascadeOnDelete();
            $table->foreignId('chapter_id')->constrained('chapters')->cascadeOnDelete();
            $table->unsignedInteger('page_number')->default(1);
            $table->timestamps();

            $table->unique(['user_id', 'manga_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reading_history');
    }
};
