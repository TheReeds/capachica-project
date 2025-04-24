<?php

namespace App\pagegeneral\models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SobreNosotros extends Model
{
    use HasFactory;

    protected $table = 'sobre_nosotros';

    protected $fillable = [
        'mision',
        'vision',
        'valores',
        'historia',
        'objetivos',
        'imagen_historia_url',
        'comite_distrital_turismo',
        'imagen_comite_url',
        'municipalidad_id',
        'fecha_actualizacion',
    ];

    protected $casts = [
        'fecha_actualizacion' => 'date',
    ];

    public function municipalidad(): BelongsTo
    {
        return $this->belongsTo(Municipalidad::class);
    }
}