<?php
namespace App\reservas\reservadetalle\Models;

use Illuminate\Database\Eloquent\Model;

class ReservaDetalle extends Model
{
    protected $table = 'reserva_detalle';

    protected $fillable = [
        'reserva_id',
        'emprendedor_id',
        'descripcion',
        'cantidad',
    ];
}