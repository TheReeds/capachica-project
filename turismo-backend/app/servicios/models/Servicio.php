<?php

namespace App\Servicios\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\reservas\emprendedores\Models\Emprendedor;
use App\Servicios\Models\Categoria;
use App\Pagegeneral\Models\Slider;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Servicio extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio_referencial',
        'emprendedor_id',
        'estado',
    ];

    protected $casts = [
        'precio_referencial' => 'decimal:2',
        'estado' => 'boolean',
    ];

    public function emprendedor(): BelongsTo
    {
        return $this->belongsTo(Emprendedor::class);
    }

    public function categorias(): BelongsToMany
    {
        return $this->belongsToMany(Categoria::class, 'categoria_servicio')
            ->withTimestamps();
    }
    public function sliders(): HasMany
    {
        return $this->hasMany(Slider::class, 'entidad_id')
                    ->where('tipo_entidad', 'servicio')
                    ->orderBy('orden');
    }
}