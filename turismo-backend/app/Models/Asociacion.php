<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Asociacion extends Model
{
    use HasFactory;

    protected $table = 'asociaciones';

    protected $fillable = [
        'nombre',
        'descripcion',
        'ubicacion',
        'telefono',
        'email',
        'municipalidad_id',
        'estado',
    ];

    protected $casts = [
        'estado' => 'boolean',
    ];

    /**
     * Obtener la municipalidad a la que pertenece la asociación
     */
    public function municipalidad(): BelongsTo
    {
        return $this->belongsTo(Municipalidad::class);
    }

    /**
     * Obtener los emprendedores que pertenecen a esta asociación
     */
    public function emprendedores(): HasMany
    {
        return $this->hasMany(Emprendedor::class);
    }
}