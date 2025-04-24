<?php

namespace App\pagegeneral\models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contacto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre_contacto',
        'email',
        'telefono_principal',
        'telefono_secundario',
        'horario_atencion',
        'direccion_fisica',
        'mapa_embed_url',
        'municipalidad_id',
    ];

    public function municipalidad(): BelongsTo
    {
        return $this->belongsTo(Municipalidad::class);
    }
}