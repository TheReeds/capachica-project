<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    public function up(): void
    {
        Schema::create('municipalidad', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('titulo');
            $table->text('descripcion');
            $table->string('redes_url')->nullable();
            $table->string('red_facebook')->nullable();
            $table->string('red_twitter')->nullable();
            $table->string('red_whatsapp')->nullable();
            $table->decimal('coordenadas_x', 10, 7)->nullable();
            $table->decimal('coordenadas_y', 10, 7)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('municipalidad');
    }
};
