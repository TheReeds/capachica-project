<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('fotos_descripcion', function (Blueprint $table) {
            $table->id();
            $table->string('foto_url');
            $table->string('descripcion_url')->nullable();
            $table->foreignId('descripcion_id')->constrained('descripciones')->onDelete('cascade');
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('fotos_descripcion');
    }
};
