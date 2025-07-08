<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reserva;
use App\Models\Conversacion;
use App\Models\Mensaje;
use App\Events\MensajeEnviado;
use App\Events\MensajeEntregado;
use App\Events\MensajeLeido;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ChatController extends Controller
{
    use AuthorizesRequests;

    // Crear conversación para una reserva (si no existe)
    public function crearConversacion($reserva_id): JsonResponse
    {
        $reserva = Reserva::findOrFail($reserva_id);
        $conversacion = $reserva->conversacion;
        if (!$conversacion) {
            $conversacion = Conversacion::create([
                'reserva_id' => $reserva->id,
                'activa' => true,
            ]);
        }
        return response()->json(['success' => true, 'data' => $conversacion]);
    }

    // Enviar mensaje en una conversación
    public function enviarMensaje(Request $request, $reserva_id): JsonResponse
    {
        $request->validate([
            'contenido' => 'required|string',
        ]);
        $reserva = Reserva::findOrFail($reserva_id);
        $conversacion = $reserva->conversacion;
        if (!$conversacion) {
            return response()->json(['success' => false, 'message' => 'No existe conversación para esta reserva'], 404);
        }
        $user = Auth::user();
        // Determinar si es usuario o emprendedor/moderador
        $emisor = ($user->id === $reserva->usuario_id) ? 'usuario' : 'emprendedor';
        // Validar acceso
        if ($emisor === 'emprendedor') {
            $emprendimientoIds = $reserva->servicios()->pluck('emprendedor_id')->unique();
            if (!$user->emprendimientos()->whereIn('emprendedores.id', $emprendimientoIds)->exists()) {
                return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
            }
        } else if ($emisor === 'usuario' && $user->id !== $reserva->usuario_id) {
            return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
        }
        $mensaje = DB::transaction(function () use ($request, $conversacion, $reserva, $user, $emisor) {
            $mensaje = Mensaje::create([
                'conversacion_id' => $conversacion->id,
                'reserva_id' => $reserva->id,
                'user_id' => $user->id,
                'contenido' => $request->input('contenido'),
                'emisor' => $emisor,
            ]);

            // Cargar las relaciones necesarias antes de emitir el evento
            $mensaje->load(['user', 'reserva.servicios.emprendedor']);

            broadcast(new MensajeEnviado($mensaje));
            return $mensaje;
        });
        return response()->json(['success' => true, 'data' => $mensaje]);
    }

    // Obtener mensajes de una conversación
    public function mensajes($reserva_id): JsonResponse
    {
        $reserva = Reserva::findOrFail($reserva_id);
        $conversacion = $reserva->conversacion;
        if (!$conversacion) {
            return response()->json(['success' => false, 'message' => 'No existe conversación para esta reserva'], 404);
        }
        $mensajes = $conversacion->mensajes()->orderBy('created_at')->get();
        return response()->json(['success' => true, 'data' => $mensajes]);
    }

    // Marcar mensaje como entregado
    public function marcarComoEntregado($mensaje_id): JsonResponse
    {
        $mensaje = Mensaje::with(['reserva.servicios.emprendedor', 'user'])->findOrFail($mensaje_id);
        $this->authorize('markAsDelivered', $mensaje);

        $mensaje->marcarComoEntregado();

        // Emitir evento en tiempo real
        broadcast(new MensajeEntregado($mensaje));

        return response()->json([
            'success' => true,
            'message' => 'Mensaje marcado como entregado',
            'data' => $mensaje
        ]);
    }

    // Marcar mensaje como leído
    public function marcarComoLeido($mensaje_id): JsonResponse
    {
        $mensaje = Mensaje::with(['reserva.servicios.emprendedor', 'user'])->findOrFail($mensaje_id);
        $this->authorize('markAsRead', $mensaje);

        $mensaje->marcarComoLeido();

        // Emitir evento en tiempo real
        broadcast(new MensajeLeido($mensaje));

        return response()->json([
            'success' => true,
            'message' => 'Mensaje marcado como leído',
            'data' => $mensaje
        ]);
    }

    // Historial completo de mensajes (solo admin)
    public function historialCompleto(Request $request): JsonResponse
    {
        $this->authorize('viewHistory', Mensaje::class);

        $query = Mensaje::with(['conversacion', 'reserva', 'user']);

        // Filtros opcionales
        if (!empty($request->reserva_id)) {
            $query->where('reserva_id', $request->reserva_id);
        }

        if (!empty($request->conversacion_id)) {
            $query->where('conversacion_id', $request->conversacion_id);
        }

        if (!empty($request->emisor)) {
            $query->where('emisor', $request->emisor);
        }

        if (!empty($request->fecha_desde)) {
            $query->where('created_at', '>=', $request->fecha_desde);
        }

        if (!empty($request->fecha_hasta)) {
            $query->where('created_at', '<=', $request->fecha_hasta);
        }

        $mensajes = $query->orderBy('created_at', 'desc')->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $mensajes
        ]);
    }

    // Búsqueda de mensajes por texto (solo admin)
    public function buscarMensajes(Request $request): JsonResponse
    {
        $this->authorize('search', Mensaje::class);
        
        $request->validate([
            'texto' => 'required|string|min:2',
        ]);
        
        $query = Mensaje::where('contenido', 'ILIKE', '%' . $request->texto . '%');
        
        $mensajes = $query->orderBy('created_at', 'desc')->paginate(50);
        
        return response()->json([
            'success' => true,
            'data' => $mensajes,
            'search_term' => $request->texto
        ]);
    }

    // Búsqueda de mensajes en el chat (no restringido)
    public function buscarMensajesChat(Request $request): JsonResponse
    {
        $request->validate([
            'texto' => 'required|string|min:2',
        ]);
        
        $query = Mensaje::where('contenido', 'ILIKE', '%' . $request->texto . '%');
        
        $mensajes = $query->orderBy('created_at', 'desc')->paginate(20);
        
        return response()->json([
            'success' => true,
            'data' => $mensajes,
            'search_term' => $request->texto
        ]);
    }

    // Obtener información del usuario en el contexto del chat
    public function miInfoEnChat($reserva_id): JsonResponse
    {
        $reserva = Reserva::findOrFail($reserva_id);
        $user = Auth::user();

        // Determinar el rol principal del usuario
        $rol = 'usuario'; // Por defecto

        if ($user->hasRole('admin')) {
            $rol = 'admin';
        } elseif ($user->id !== $reserva->usuario_id) {
            // Es emprendedor o moderador
            $emprendimientoIds = $reserva->servicios()->pluck('emprendedor_id')->unique();
            $emprendimiento = $user->emprendimientos()
                ->whereIn('emprendedores.id', $emprendimientoIds)
                ->first();

            if ($emprendimiento) {
                // Mapear el rol de la base de datos al rol del chat
                $rolDB = $emprendimiento->pivot->rol ?? 'administrador';
                if ($rolDB === 'administrador') {
                    $rol = 'emprendedor';
                } elseif ($rolDB === 'ayudante') {
                    $rol = 'moderador';
                } else {
                    $rol = $rolDB; // Para otros roles que puedan existir
                }
            }
        }

        $info = [
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'rol' => $rol, // Campo principal para el frontend
            'es_usuario' => $user->id === $reserva->usuario_id,
            'es_admin' => $user->hasRole('admin'),
            'es_moderador' => $user->esModerador(),
            'es_emprendedor' => $user->esEmprendedor(),
        ];

        if ($user->id !== $reserva->usuario_id) {
            // Es emprendedor o moderador
            $emprendimientoIds = $reserva->servicios()->pluck('emprendedor_id')->unique();
            $emprendimientos = $user->emprendimientos()
                ->whereIn('emprendedores.id', $emprendimientoIds)
                ->get(['emprendedores.id', 'emprendedores.nombre', 'user_emprendedor.rol', 'user_emprendedor.es_principal']);

            $info['emprendimientos'] = $emprendimientos;
            $info['puede_interactuar'] = $emprendimientos->isNotEmpty();
        } else {
            $info['puede_interactuar'] = true;
        }

        return response()->json([
            'success' => true,
            'data' => $info
        ]);
    }

    // Estadísticas de mensajes (solo admin)
    public function estadisticas(): JsonResponse
    {
        $this->authorize('viewAny', Mensaje::class);

        $stats = [
            'total_mensajes' => Mensaje::count(),
            'mensajes_entregados' => Mensaje::whereNotNull('entregado_en')->count(),
            'mensajes_leidos' => Mensaje::whereNotNull('leido_en')->count(),
            'mensajes_pendientes_entrega' => Mensaje::whereNull('entregado_en')->count(),
            'mensajes_pendientes_lectura' => Mensaje::whereNull('leido_en')->count(),
            'por_conversacion' => Conversacion::withCount('mensajes')->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
