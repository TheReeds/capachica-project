<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Mensaje;

class MensajeEnviado implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $mensaje;
    public $reserva_id;
    public $conversacion_id;
    public $user_id;
    public $contenido;
    public $emisor;
    public $created_at;

    public function __construct(Mensaje $mensaje)
    {
        $this->mensaje = $mensaje;
        $this->reserva_id = $mensaje->reserva_id;
        $this->conversacion_id = $mensaje->conversacion_id;
        $this->user_id = $mensaje->user_id;
        $this->contenido = $mensaje->contenido;
        $this->emisor = $mensaje->emisor;
        $this->created_at = $mensaje->created_at;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('conversacion.' . $this->reserva_id);
    }

    public function broadcastWith()
    {
        try {
            $user = $this->mensaje->user;
            $rol = 'usuario';

            if ($this->emisor === 'emprendedor') {
                // Determinar si es emprendedor o moderador
                $emprendimiento = $user->emprendimientos()
                    ->where('emprendedores.id', function($query) {
                        $query->select('emprendedor_id')
                              ->from('reserva_servicios')
                              ->where('reserva_id', $this->reserva_id)
                              ->limit(1);
                    })
                    ->first();

                if ($emprendimiento) {
                    $rolDB = $emprendimiento->pivot->rol ?? 'administrador';
                    if ($rolDB === 'administrador') {
                        $rol = 'emprendedor';
                    } elseif ($rolDB === 'ayudante') {
                        $rol = 'moderador';
                    } else {
                        $rol = $rolDB;
                    }
                }
            }

            return [
                'id' => $this->mensaje->id,
                'reserva_id' => $this->reserva_id,
                'conversacion_id' => $this->conversacion_id,
                'user_id' => $this->user_id,
                'contenido' => $this->contenido,
                'emisor' => $this->emisor,
                'rol' => $rol,
                'created_at' => $this->created_at,
                'entregado_en' => $this->mensaje->entregado_en,
                'leido_en' => $this->mensaje->leido_en,
            ];
        } catch (\Exception $e) {
            return [
                'id' => $this->mensaje->id,
                'reserva_id' => $this->reserva_id,
                'conversacion_id' => $this->conversacion_id,
                'user_id' => $this->user_id,
                'contenido' => $this->contenido,
                'emisor' => $this->emisor,
                'rol' => 'usuario',
                'created_at' => $this->created_at,
                'entregado_en' => $this->mensaje->entregado_en,
                'leido_en' => $this->mensaje->leido_en,
            ];
        }
    }

    public function broadcastAs()
    {
        return 'MensajeEnviado';
    }
}
