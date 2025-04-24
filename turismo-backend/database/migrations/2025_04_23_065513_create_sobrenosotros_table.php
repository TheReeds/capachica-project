<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sobre_nosotros', function (Blueprint $table) {
            $table->id();
            $table->longText('mision');
            $table->longText('vision');
            $table->longText('valores');
            $table->longText('historia');
            $table->longText('objetivos')->nullable();
            $table->string('imagen_historia_url')->nullable();
            $table->longText('comite_distrital_turismo');
            $table->string('imagen_comite_url')->nullable();
            $table->foreignId('municipalidad_id')->constrained('municipalidad')->onDelete('cascade');
            $table->date('fecha_actualizacion');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sobre_nosotros');
    }
};
