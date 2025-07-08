<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mensaje extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversacion_id',
        'reserva_id',
        'user_id',
        'contenido',
        'emisor',
        'entregado_en',
        'leido_en',
    ];

    protected $table = 'mensajes';

    protected $casts = [
        'entregado_en' => 'datetime',
        'leido_en' => 'datetime',
    ];

    public function conversacion()
    {
        return $this->belongsTo(Conversacion::class);
    }

    public function reserva()
    {
        return $this->belongsTo(Reserva::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Marcar mensaje como entregado
     */
    public function marcarComoEntregado()
    {
        if (!$this->entregado_en) {
            $this->update(['entregado_en' => now()]);
        }
        return $this;
    }

    /**
     * Marcar mensaje como leído
     */
    public function marcarComoLeido()
    {
        if (!$this->leido_en) {
            $this->update(['leido_en' => now()]);
        }
        return $this;
    }

    /**
     * Verificar si el mensaje está entregado
     */
    public function isEntregado()
    {
        return !is_null($this->entregado_en);
    }

    /**
     * Verificar si el mensaje está leído
     */
    public function isLeido()
    {
        return !is_null($this->leido_en);
    }

    /**
     * Scope para mensajes no entregados
     */
    public function scopeNoEntregados($query)
    {
        return $query->whereNull('entregado_en');
    }

    /**
     * Scope para mensajes no leídos
     */
    public function scopeNoLeidos($query)
    {
        return $query->whereNull('leido_en');
    }
} 