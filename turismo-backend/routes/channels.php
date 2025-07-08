<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;
use App\Models\Reserva;
use App\Models\User;

// Canal para eventos propios del usuario
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    Log::info('Canal User: Usuario autenticado', ['user_id' => $user ? $user->id : null, 'requested_id' => $id]);
    return (int) $user->id === (int) $id;
});

// Canal privado para conversación por reserva
Broadcast::channel('conversacion.{reservaId}', function ($user, $reservaId) {
    if (!$user) {
        Log::error('Canal conversacion: Usuario no autenticado');
        return false;
    }

    $reserva = Reserva::find($reservaId);
    if (!$reserva) {
        Log::error('Canal conversacion: Reserva no encontrada', ['reserva_id' => $reservaId]);
        return false;
    }

    Log::info('Canal conversacion: Reserva encontrada', [
        'reserva_id' => $reserva->id,
        'usuario_id' => $reserva->usuario_id,
        'user_roles' => $user->getRoleNames()->toArray()
    ]);

    if ($user->hasRole('admin') || $user->hasRole('administrador')) {
        Log::info('Canal conversacion: Acceso concedido para admin');
        return true;
    }

    if ($user->hasRole('emprendedor')) {
        $emprendimiento = $reserva->servicios->first()?->servicio?->emprendimiento;
        if ($emprendimiento && $emprendimiento->administradores->contains('id', $user->id)) {
            Log::info('Canal conversacion: Acceso concedido para emprendedor');
            return true;
        }
        Log::error('Canal conversacion: Emprendimiento no encontrado para emprendedor');
        return false;
    }

    if ($user->hasRole('usuario') || $user->hasRole('user')) {
        $isOwner = $reserva->usuario_id === $user->id;
        Log::info('Canal conversacion: Verificación usuario', [
            'reserva_usuario_id' => $reserva->usuario_id,
            'current_user_id' => $user->id,
            'is_owner' => $isOwner
        ]);
        return $isOwner;
    }

    Log::error('Canal conversacion: Usuario no tiene permisos', [
        'user_id' => $user->id,
        'user_roles' => $user->getRoleNames()->toArray()
    ]);
    return false;
}, ['middleware' => ['auth:sanctum']]);
