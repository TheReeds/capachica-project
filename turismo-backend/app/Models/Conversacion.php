<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversacion extends Model
{
    use HasFactory;

    protected $fillable = [
        'reserva_id',
        'activa',
    ];

    protected $table = 'conversaciones';

    public function reserva()
    {
        return $this->belongsTo(Reserva::class);
    }

    public function mensajes()
    {
        return $this->hasMany(Mensaje::class);
    }
} 