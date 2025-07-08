<?php
namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Mensaje;

class MensajeEntregado implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $mensaje;
    public $reserva_id;
    public $mensaje_id;

    public function __construct(Mensaje $mensaje)
    {
        $this->mensaje = $mensaje;
        $this->reserva_id = $mensaje->reserva_id;
        $this->mensaje_id = $mensaje->id;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('conversacion.' . $this->reserva_id);
    }

    public function broadcastWith()
    {
        return [
            'mensaje_id' => $this->mensaje_id,
            'reserva_id' => $this->reserva_id,
            'entregado_en' => $this->mensaje->entregado_en,
            'tipo' => 'entregado'
        ];
    }

    public function broadcastAs()
    {
        return 'MensajeEntregado';
    }
} 