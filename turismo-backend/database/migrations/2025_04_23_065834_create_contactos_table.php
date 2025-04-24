<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('contactos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_contacto');
            $table->string('email')->nullable();
            $table->string('telefono_principal');
            $table->string('telefono_secundario')->nullable();
            $table->string('horario_atencion')->nullable();
            $table->string('direccion_fisica');
            $table->text('mapa_embed_url')->nullable();
            $table->foreignId('municipalidad_id')->constrained('municipalidad')->onDelete('cascade');
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('contactos');
    }
};
