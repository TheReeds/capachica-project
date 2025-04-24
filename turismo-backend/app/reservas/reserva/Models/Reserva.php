<?php
namespace App\reservas\reserva\Models;

use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    protected $fillable = [
        'nombre',
        'fecha',
        'descripcion',
        'redes_url',
        'tipo',
    ];
}