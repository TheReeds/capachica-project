<?php

namespace App\Policies;

use App\Models\Mensaje;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MensajePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Mensaje $mensaje): bool
    {
        // Admin puede ver cualquier mensaje
        if ($user->hasRole('admin')) {
            return true;
        }

        // Usuario puede ver mensajes de sus reservas
        if ($mensaje->reserva->usuario_id === $user->id) {
            return true;
        }

        // Emprendedor o moderador puede ver mensajes de sus emprendimientos
        $emprendimientoIds = $mensaje->reserva->servicios()->pluck('emprendedor_id')->unique();
        return $user->emprendimientos()->whereIn('emprendedores.id', $emprendimientoIds)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Cualquier usuario autenticado puede crear mensajes
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Mensaje $mensaje): bool
    {
        // Solo el autor del mensaje puede actualizarlo
        return $mensaje->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Mensaje $mensaje): bool
    {
        // Solo admin puede eliminar mensajes
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can mark message as delivered.
     */
    public function markAsDelivered(User $user, Mensaje $mensaje): bool
    {
        // Si puede ver el mensaje, puede marcarlo como entregado
        return $this->view($user, $mensaje);
    }

    /**
     * Determine whether the user can mark message as read.
     */
    public function markAsRead(User $user, Mensaje $mensaje): bool
    {
        // Si puede ver el mensaje, puede marcarlo como leído
        return $this->view($user, $mensaje);
    }

    /**
     * Determine whether the user can search messages.
     */
    public function search(User $user): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can view conversation history.
     */
    public function viewHistory(User $user): bool
    {
        return $user->hasRole('admin');
    }
} 