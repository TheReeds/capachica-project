<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('descripciones', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('imagen_url')->nullable();
            $table->string('icon')->nullable();
            $table->foreignId('slider_id')->constrained('sliders')->onDelete('cascade');
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('descripciones');
    }
};
