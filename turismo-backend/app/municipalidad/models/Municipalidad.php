<?php

namespace App\municipalidad\Models;

use Illuminate\Database\Eloquent\Model;

class Municipalidad extends Model
{
    protected $table = 'municipalidades';

    protected $fillable = [
        'nombre', 'direccion', 'telefono', 'correo'
    ];
}
