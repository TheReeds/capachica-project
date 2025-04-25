<?php
namespace App\reservas\reserva\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\reservas\Emprendedores\Models\Emprendedor;

class Reserva extends Model
{
    protected $fillable = [
        'nombre',
        'fecha',
        'descripcion',
        'redes_url',
        'tipo',
    ];

    /**
     * Obtener los emprendedores asociados a esta reserva
     */
    public function emprendedores(): BelongsToMany
    {
        return $this->belongsToMany(Emprendedor::class, 'reserva_detalle')
                    ->withPivot('descripcion', 'cantidad')
                    ->withTimestamps();
    }
}