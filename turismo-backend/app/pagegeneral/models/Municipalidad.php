<?php

namespace App\pagegeneral\models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\reservas\Asociaciones\Models\Asociacion;

class Municipalidad extends Model
{
    use HasFactory;

    protected $table = 'municipalidad';
    
    protected $fillable = [
        'nombre',
        'descripcion',
        'red_facebook',
        'red_instagram',
        'red_youtube',
        'coordenadas_x',
        'coordenadas_y',
        'frase',
        'comunidades',
        'historiafamilias',
        'historiacapachica',
        'comite',
        'mision',
        'vision',
        'valores',
        'ordenanzamunicipal',
        'alianzas',
        'correo',
        'horariodeatencion',
    ];

    /**
     * Obtener las asociaciones de la municipalidad
     */
    public function asociaciones(): HasMany
    {
        return $this->hasMany(Asociacion::class);
    }

    public function sliders(): HasMany
    {
        return $this->hasMany(Slider::class);
    }

    public function descripcionesMunicipalidad(): HasMany
    {
        return $this->hasMany(DescripcionMunicipalidad::class);
    }

    public function sobreNosotros(): HasMany
    {
        return $this->hasMany(SobreNosotros::class);
    }

    public function contactos(): HasMany
    {
        return $this->hasMany(Contacto::class);
    }
}