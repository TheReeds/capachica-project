<?php
namespace App\Evento\Models;

    use Illuminate\Database\Eloquent\Model;
    use Illuminate\Database\Eloquent\Relations\HasMany;
    use App\Pagegeneral\Models\Slider;

    class Evento extends Model
    {
        protected $table = 'eventos';

        protected $fillable = [
            'nombre',
            'descripcion',
            'tipo_evento',
            'idioma_principal',
            'fecha_inicio',
            'hora_inicio',
            'fecha_fin',
            'hora_fin',
            'duracion_horas',
            'coordenada_x',
            'coordenada_y',
            'imagen_url',
            'id_emprendedor',
            'que_llevar',
        ];

        // Relación con emprendedor
        public function emprendedor()
        {
            return $this->belongsTo(\App\Models\Emprendedor::class, 'id_emprendedor');
        }

        
        

        public function sliders(): \Illuminate\Database\Eloquent\Relations\HasMany
        {
        return $this->hasMany(Slider::class, 'entidad_id')
                    ->where('tipo_entidad', 'evento')
                    ->orderBy('orden');
        }

        
    }
