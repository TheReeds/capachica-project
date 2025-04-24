<?php

namespace App\pagegeneral\models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Municipalidad extends Model
{
    use HasFactory;

    protected $table = 'municipalidad';
    
    protected $fillable = [
        'nombre',
        'titulo',
        'descripcion',
        'redes_url',
        'red_facebook',
        'red_twitter',
        'red_whatsapp',
        'coordenadas_x',
        'coordenadas_y',
    ];

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
