<?php

namespace App\pagegeneral\models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Descripcion extends Model
{
    use HasFactory;

    protected $table = 'descripciones';

    protected $fillable = [
        'titulo',
        'imagen_url',
        'icon',
        'slider_id',
    ];

    public function slider(): BelongsTo
    {
        return $this->belongsTo(Slider::class);
    }

    public function fotosDescripcion(): HasMany
    {
        return $this->hasMany(FotoDescripcion::class);
    }
}
