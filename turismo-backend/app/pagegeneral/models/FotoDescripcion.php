<?php

namespace App\pagegeneral\models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FotoDescripcion extends Model
{
    use HasFactory;

    protected $table = 'fotos_descripcion';

    protected $fillable = [
        'foto_url',
        'descripcion_url',
        'descripcion_id',
    ];

    public function descripcion(): BelongsTo
    {
        return $this->belongsTo(Descripcion::class);
    }
}