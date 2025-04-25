<?php
namespace App\reservas\reservadetalle\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\reservas\reserva\Models\Reserva;
use App\reservas\Emprendedores\Models\Emprendedor;

class ReservaDetalle extends Model
{
    protected $table = 'reserva_detalle';

    protected $fillable = [
        'reserva_id',
        'emprendedor_id',
        'descripcion',
        'cantidad',
    ];

    /**
     * Obtener la reserva a la que pertenece este detalle
     */
    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class);
    }

    /**
     * Obtener el emprendedor asociado a este detalle
     */
    public function emprendedor(): BelongsTo
    {
        return $this->belongsTo(Emprendedor::class);
    }
}