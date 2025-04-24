<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('descripcion_municipalidad', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('descripcion');
            $table->string('imagen_url')->nullable();
            $table->string('tipo')->nullable();
            $table->string('campo')->nullable();
            $table->foreignId('municipalidad_id')->constrained('municipalidad')->onDelete('cascade');
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('descripcion_municipalidad');
    }
};
