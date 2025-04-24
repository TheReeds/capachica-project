<?php

namespace App\reservas\Emprendedores\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'facilidades_discapacidad'
    ];

    protected $casts = [
        'metodos_pago' => 'array',
        'imagenes' => 'array',
        'certificaciones' => 'array',
        'idiomas_hablados' => 'array',
        'facilidades_discapacidad' => 'boolean'
    ];
}
