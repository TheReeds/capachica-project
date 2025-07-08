import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
// @ts-ignore
import Echo from 'laravel-echo';
import Pusher from 'pusher-js'; // Necesario para que Echo use el protocolo Pusher
import { environment } from '../../../environments/environments';

(window as any).Pusher = Pusher; // Asegúrate de que Pusher esté disponible globalmente para Echo

export interface ChatMessage {
  id: number;
  contenido: string;
  emisor: string;
  reserva_id: number;
  created_at: string;
  updated_at: string;
  entregado: boolean;
  entregado_en?: string;
  leido: boolean;
  leido_en?: string;
  pending?: boolean;
}

export interface ChatUserInfo {
  rol: 'usuario' | 'emprendedor' | 'moderador' | 'admin';
  permisos: string[];
  nombre: string;
  id: number;
}

export interface ChatStats {
  total_mensajes: number;
  mensajes_entregados: number;
  mensajes_leidos: number;
  mensajes_pendientes: number;
  conversaciones_activas: number;
  usuarios_conectados: number;
}

export interface ChatSearchParams {
  texto: string;
  reserva_id?: number;
  emisor?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
}

export interface ChatHistoryParams {
  reserva_id?: number;
  conversacion_id?: number;
  emisor?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = environment.apiUrl;// Cambia por tu URL
  private echoInstance: any; // Usar 'any' para evitar error de tipo
  private token: string = '';

  // Mensajes en tiempo real
  private mensajesSubject = new BehaviorSubject<any>(null);
  mensajes$ = this.mensajesSubject.asObservable();

  // Estado de conexión
  private conexionSubject = new BehaviorSubject<boolean>(false);
  conexion$ = this.conexionSubject.asObservable();

  // Usuarios conectados
  private usuariosConectadosSubject = new BehaviorSubject<any[]>([]);
  usuariosConectados$ = this.usuariosConectadosSubject.asObservable();

  // Eventos de presencia
  private presenciaSubject = new Subject<any>();
  presencia$ = this.presenciaSubject.asObservable();

  // Estado de entrega/lectura
  private estadoMensajeSubject = new Subject<any>();
  estadoMensaje$ = this.estadoMensajeSubject.asObservable();

  constructor(private http: HttpClient, private ngZone: NgZone) {
    // No inicializar Echo aquí, solo cuando el token esté disponible
  }

  /**
   * Inicializa Echo con el token proporcionado.
   * Llama a este método después de obtener el token (por ejemplo, tras el login).
   */
  public inicializarEcho(token: string) {
    if (!token) {
      return;
    }
    this.token = token;

    if (this.echoInstance) {
      this.echoInstance.disconnect();
      this.echoInstance = null;
    }

    this.echoInstance = new Echo({
      broadcaster: 'reverb', // Correcto para Laravel Reverb
      key: environment.REVERB_APP_KEY || 'bhvninc6bkpjcnpskace',
      wsHost: environment.REVERB_HOST || 'localhost',
      wsPort: environment.REVERB_PORT || 6001,
      wssPort: environment.REVERB_PORT || 6001, // Asegúrate de que wssPort también esté configurado
      forceTLS: (environment.REVERB_SCHEME || 'http') === 'https',
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: (environment.BACKEND_URL || 'http://127.0.0.1:8000') + '/broadcasting/auth',
      cluster: 'mt1', // Puede ser 'mt1' o cualquier valor, Reverb lo ignora pero Pusher.js lo necesita
      auth: {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json', // ¡AÑADIDO NUEVAMENTE AQUÍ!
        }
      },
    });

        // --- CUSTOM AUTHORIZER PARA FORZAR withCredentials: true Y LOGGING ---
    // ESTO ES CRÍTICO PARA QUE LAS COOKIES SE ENVÍEN EN LA SOLICITUD DE AUTENTICACIÓN DE BROADCASTING
    this.echoInstance.connector.pusher.config.authorizer = (channel: any, options: any) => {
      return {
        authorize: (socketId: string, callback: Function) => {
          const authUrl = options.authEndpoint;
          const headers = options.auth.headers; // Obtiene los headers de la configuración de Echo
          const body = {
            socket_id: socketId,
            channel_name: channel.name
          };


          this.http.post(authUrl, body, {
            headers: new HttpHeaders(headers), // Usa HttpHeaders aquí para enviar los headers
            withCredentials: true // <--- ¡ESTO ES CRÍTICO PARA LAS COOKIES!
          })
            .subscribe({
              next: (authResponse: any) => {
                console.log('[WS DEBUG] Custom Authorizer: Autenticación exitosa:', authResponse);
                callback(false, authResponse); // false indica que no hay error
              },
              error: (error) => {
                console.error('[WS DEBUG] Custom Authorizer: Error en la autenticación:', error);
                console.error('[WS DEBUG] Custom Authorizer: Detalles del error:', {
                  status: error.status,
                  statusText: error.statusText,
                  response: error.error, // Cuerpo de la respuesta de error
                  headers: error.headers,
                });
                callback(true, error); // true indica que hay un error
              }
            });
        }
      };
    };
    // --- FIN CUSTOM AUTHORIZER ---
    
    // DEPURACIÓN: Estado de la conexión WebSocket
    if (this.echoInstance.connector && this.echoInstance.connector.pusher) {
      this.echoInstance.connector.pusher.connection.bind('connected', () => {
        console.log('[WS DEBUG] WebSocket conectado');
        this.ngZone.run(() => this.conexionSubject.next(true));
      });
      this.echoInstance.connector.pusher.connection.bind('disconnected', () => {
        console.log('[WS DEBUG] WebSocket desconectado');
        this.ngZone.run(() => this.conexionSubject.next(false));
      });
      this.echoInstance.connector.pusher.connection.bind('unavailable', () => {
        console.log('[WS DEBUG] WebSocket no disponible');
        this.ngZone.run(() => this.conexionSubject.next(false));
      });
      this.echoInstance.connector.pusher.connection.bind('error', (err: any) => {
        console.error('[WS DEBUG] WebSocket error:', err);
        this.ngZone.run(() => this.conexionSubject.next(false));
      });
    }
  }

  // Crear conversación
  crearConversacion(reservaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservas/${reservaId}/conversacion`, {}, {
      headers: this.getHeaders(),
      withCredentials: true // <--- AÑADIDO
    });
  }

  // Obtener mensajes
  obtenerMensajes(reservaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservas/${reservaId}/mensajes`, {
      headers: this.getHeaders(),
      withCredentials: true // <--- AÑADIDO
    });
  }

  // Enviar mensaje
  enviarMensaje(reservaId: number, contenido: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservas/${reservaId}/mensajes`, { contenido }, {
      headers: this.getHeaders(),
      withCredentials: true // <--- AÑADIDO
    });
  }

  // Obtener información del usuario en el contexto del chat
  obtenerMiInfo(reservaId: number): Observable<{ success: boolean, data: ChatUserInfo }> {
    return this.http.get<{ success: boolean, data: ChatUserInfo }>(`${this.apiUrl}/reservas/${reservaId}/mi-info`, {
      headers: this.getHeaders(),
      withCredentials: true // <--- AÑADIDO
    });
  }

  // Marcar mensaje como entregado
  marcarEntregado(mensajeId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/mensajes/${mensajeId}/entregado`, {}, {
      headers: this.getHeaders(),
      withCredentials: true // <--- AÑADIDO
    });
  }

  // Marcar mensaje como leído
  marcarLeido(mensajeId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/mensajes/${mensajeId}/leido`, {}, {
      headers: this.getHeaders(),
      withCredentials: true // <--- AÑADIDO
    });
  }

  // Historial completo de mensajes
  obtenerHistorial(params: ChatHistoryParams = {}): Observable<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return this.http.get(`${this.apiUrl}/admin/chat/historial?${queryParams}`, {
      headers: this.getHeaders(),
      withCredentials: true // <--- AÑADIDO
    });
  }

  // Búsqueda de mensajes (para usuarios normales)
  buscarMensajesUsuario(params: ChatSearchParams): Observable<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return this.http.get(`${this.apiUrl}/chat/buscar?${queryParams}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  // Búsqueda de mensajes (solo admin)
  buscarMensajes(params: ChatSearchParams): Observable<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return this.http.get(`${this.apiUrl}/admin/chat/buscar?${queryParams}`, {
      headers: this.getHeaders(),
      withCredentials: true // <--- AÑADIDO
    });
  }

  // Estadísticas del chat
  obtenerEstadisticas(): Observable<ChatStats> {
    return this.http.get<{ success: boolean, data: ChatStats }>(`${this.apiUrl}/admin/chat/estadisticas`, {
      headers: this.getHeaders(),
      withCredentials: true // <--- AÑADIDO
    }).pipe(
      map(res => res.data)
    );
  }


  private activeMessageChannels: Map<number, any> = new Map();
  private activePresenceChannels: Map<number, any> = new Map();

  // Escuchar canal privado de la reserva
  escucharMensajes(reservaId: number) {
    if (!this.echoInstance) {
      console.warn('[WS DEBUG] Echo no está inicializado para escuchar mensajes.');
      return;
    }
    if (this.activeMessageChannels.has(reservaId)) {
      console.warn(`[WS DEBUG] Ya se está escuchando el canal de mensajes para la reserva ${reservaId}.`);
      return; // Ya estamos suscritos
    }

    console.log('[WS DEBUG] Intentando suscribirse al canal privado: conversacion.' + reservaId);
    const channel = this.echoInstance.private(`conversacion.${reservaId}`);
    this.activeMessageChannels.set(reservaId, channel); // Guarda la instancia del canal

    channel.listen('.MensajeEnviado', (data: any) => {
      console.log('[WS DEBUG] MensajeEnviado recibido:', data.mensaje);
      this.mensajesSubject.next(data.mensaje); // Asumiendo que quieres emitir el mensaje individual
    })
      .listen('.MensajeEntregado', (data: any) => {
        console.log('[WS DEBUG] MensajeEntregado recibido:', data.mensajeId);
        this.estadoMensajeSubject.next({ id: data.mensajeId, estado: 'entregado' });
      })
      .listen('.MensajeLeido', (data: any) => {
        console.log('[WS DEBUG] MensajeLeido recibido:', data.mensajeId);
        this.estadoMensajeSubject.next({ id: data.mensajeId, estado: 'leido' });
      })
      .error((error: any) => { // Es buena idea añadir un manejador de errores aquí
        console.error(`[WS DEBUG] Error en el canal privado 'conversacion.${reservaId}':`, error);
      });
  }

  // Escuchar presencia de usuarios
  escucharPresencia(reservaId: number) {
    if (!this.echoInstance) {
      console.warn('[WS DEBUG] Echo no está inicializado para escuchar presencia.');
      return;
    }
    if (this.activePresenceChannels.has(reservaId)) {
      console.warn(`[WS DEBUG] Ya se está escuchando el canal de presencia para la reserva ${reservaId}.`);
      return;
    }

    console.log(`[WS DEBUG] Intentando suscribirse al canal de presencia: conversacion.${reservaId}`);
    const channel = this.echoInstance.join(`conversacion.${reservaId}`);
    this.activePresenceChannels.set(reservaId, channel); // Guarda la instancia del canal de presencia

    channel.here((users: any[]) => {
      console.log(`[PRESENCIA] Usuarios actualmente en conversacion.${reservaId}:`, users);
      this.ngZone.run(() => this.usuariosConectadosSubject.next(users));
    })
      .joining((user: any) => {
        console.log(`[PRESENCIA] Usuario uniéndose a conversacion.${reservaId}:`, user);
        this.ngZone.run(() => {
          const currentUsers = this.usuariosConectadosSubject.getValue();
          this.usuariosConectadosSubject.next([...currentUsers, user]);
        });
      })
      .leaving((user: any) => {
        console.log(`[PRESENCIA] Usuario saliendo de conversacion.${reservaId}:`, user);
        this.ngZone.run(() => {
          const currentUsers = this.usuariosConectadosSubject.getValue();
          this.usuariosConectadosSubject.next(currentUsers.filter(u => u.id !== user.id));
        });
      })
      .error((error: any) => { // También añade un manejador de errores aquí
        console.error(`[PRESENCIA] Error en el canal de presencia 'conversacion.${reservaId}':`, error);
      });
  }

  // Dejar de escuchar (manteniendo el nombre original 'dejarDeEscuchar')
  dejarDeEscuchar(reservaId: number) {
    if (!this.echoInstance) { return; }

    if (this.activeMessageChannels.has(reservaId)) {
      this.echoInstance.leave(`conversacion.${reservaId}`);
      this.activeMessageChannels.delete(reservaId);
      console.log(`[WS DEBUG] Dejado de escuchar el canal privado 'conversacion.${reservaId}'`);
    }
    if (this.activePresenceChannels.has(reservaId)) {
      this.echoInstance.leave(`conversacion.${reservaId}`); // El mismo canal `join` para presencia
      this.activePresenceChannels.delete(reservaId);
      console.log(`[WS DEBUG] Dejado de escuchar el canal de presencia 'conversacion.${reservaId}'`);
    }
  }

  // Detectar cuando un mensaje es visible (para marcar como leído)
  detectarMensajeVisible(mensajeId: number, callback: () => void) {
    // Esta función se puede usar con Intersection Observer
    // Por ahora retornamos una función que se puede llamar manualmente
    return () => {
      this.marcarLeido(mensajeId).subscribe({
        next: () => {
          console.log(`Mensaje ${mensajeId} marcado como leído`);
          callback();
        },
        error: (error) => {
          console.error('Error al marcar mensaje como leído:', error);
        }
      });
    };
  }

  // Detectar cuando un mensaje es recibido (para marcar como entregado)
  detectarMensajeRecibido(mensajeId: number, callback: () => void) {
    return () => {
      this.marcarEntregado(mensajeId).subscribe({
        next: () => {
          console.log(`Mensaje ${mensajeId} marcado como entregado`);
          callback();
        },
        error: (error) => {
          console.error('Error al marcar mensaje como entregado:', error);
        }
      });
    };
  }

  // Obtener icono de estado del mensaje
  getEstadoIcono(mensaje: ChatMessage): string {
    if (mensaje.leido) {
      return '✓✓'; // Doble check azul (leído)
    } else if (mensaje.entregado) {
      return '✓✓'; // Doble check (entregado)
    } else {
      return '✓'; // Check simple (enviado)
    }
  }

  // Obtener clase CSS para el icono de estado
  getEstadoIconoClase(mensaje: ChatMessage): string {
    if (mensaje.leido) {
      return 'text-blue-500'; // Azul para leído
    } else if (mensaje.entregado) {
      return 'text-gray-500'; // Gris para entregado
    } else {
      return 'text-gray-400'; // Gris claro para enviado
    }
  }

  // Headers con Bearer
  private getHeaders() {
    return new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}` // <-- ¡AÑADIDO NUEVAMENTE AQUÍ!
    });
  }

  testSimplePost(): Observable<any> {
    // Asegúrate de que apiUrl apunte a http://127.0.0.1:8000/api
    return this.http.post(`${this.apiUrl}/test-simple-post`, { test: 'data' });
  }

  /**
   * Obtener el usuario autenticado (para debug o pruebas de sesión)
   */
  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, { withCredentials: true });
  }

  desconectarEcho(): void {
    if (this.echoInstance) {
      this.echoInstance.disconnect();
      this.echoInstance = null;
      console.log('[WS DEBUG] Echo desconectado.');
      this.mensajesSubject.next(null); // Limpiar mensajes al desconectar
      this.usuariosConectadosSubject.next([]); // Limpiar usuarios al desconectar
      this.activeMessageChannels.clear();
      this.activePresenceChannels.clear();
    }
  }
}
