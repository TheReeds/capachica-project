<?php

namespace App\Resenas\Model;

use Illuminate\Database\Eloquent\Model;

class Resenas extends Model
{
    protected $fillable = [
        'emprendedor_id',
        'user_id',
        'nombre_autor',
        'comentario',
        'puntuacion',
        'imagenes',
        'estado'
    ];

    protected $casts = [
        'imagenes' => 'array',
        'puntuacion' => 'integer'
    ];

    public function emprendedor()
    {
        return $this->belongsTo(\App\reservas\Emprendedores\Models\Emprendedor::class);
    }

    public function usuario()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }
}
