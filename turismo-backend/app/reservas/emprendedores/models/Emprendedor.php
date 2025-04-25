<?php

namespace App\reservas\Emprendedores\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\reservas\Asociaciones\Models\Asociacion;
use App\Servicios\Models\Servicio;
use App\reservas\reserva\Models\Reserva;

class Emprendedor extends Model
{
    use HasFactory;

    protected $table = 'emprendedores';

    protected $fillable = [
        'nombre',
        'tipo_servicio',
        'descripcion',
        'ubicacion',
        'telefono',
        'email',
        'pagina_web',
        'horario_atencion',
        'precio_rango',
        'metodos_pago',
        'capacidad_aforo',
        'numero_personas_atiende',
        'comentarios_resenas',
        'imagenes',
        'categoria',
        'certificaciones',
        'idiomas_hablados',
        'opciones_acceso',
        'facilidades_discapacidad',
        'asociacion_id'
    ];

    protected $casts = [
        'metodos_pago' => 'array',
        'imagenes' => 'array',
        'certificaciones' => 'array',
        'idiomas_hablados' => 'array',
        'facilidades_discapacidad' => 'boolean'
    ];

    /**
     * Obtener la asociación a la que pertenece el emprendedor
     */
    public function asociacion(): BelongsTo
    {
        return $this->belongsTo(Asociacion::class);
    }

    /**
     * Obtener los servicios del emprendedor
     */
    public function servicios(): HasMany
    {
        return $this->hasMany(Servicio::class);
    }

    /**
     * Obtener las reservas del emprendedor
     */
    public function reservas(): BelongsToMany
    {
        return $this->belongsToMany(Reserva::class, 'reserva_detalle')
                    ->withPivot('descripcion', 'cantidad')
                    ->withTimestamps();
    }
}