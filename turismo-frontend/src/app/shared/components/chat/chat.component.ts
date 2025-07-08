import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage, ChatUserInfo, ChatSearchParams } from '../../../core/services/chat.service';
import { Subscription, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col h-96">
      
      <!-- Header del chat -->
      <div class="chat-header px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            {{ titulo || 'Chat' }}
          </h3>
          
          <!-- Estado de conexión -->
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" 
                 [class]="conectado ? 'bg-green-500' : 'bg-red-500'"></div>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ conectado ? 'Conectado' : 'Desconectado' }}
            </span>
          </div>
        </div>

        <!-- Botón actualizar chat -->
        <button (click)="cargarMensajes()" class="ml-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          🔄 Actualizar chat
        </button>

        <!-- Usuarios conectados -->
        <div *ngIf="usuariosConectados.length > 0" class="flex items-center gap-2">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ usuariosConectados.length }} conectado(s)
          </span>
          <div class="flex -space-x-2">
            <div *ngFor="let usuario of usuariosConectados.slice(0, 3)" 
                 class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
              {{ usuario.nombre?.charAt(0) || 'U' }}
            </div>
          </div>
        </div>

        <!-- Búsqueda (disponible para todos) -->
        <div class="flex items-center gap-2">
          <input 
            type="text" 
            [(ngModel)]="textoBusqueda"
            (ngModelChange)="busquedaSubject.next($event)"
            placeholder="Buscar mensajes..."
            class="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <button (click)="limpiarBusqueda()" 
                  class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            ✕
          </button>
        </div>
      </div>

      <!-- Mensajes -->
      <div #mensajesContainer 
           class="flex-1 overflow-y-auto p-4 space-y-3"
           (scroll)="onScroll()">
        
        <!-- Loading -->
        <div *ngIf="cargando || !miInfo" class="text-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Cargando mensajes...</p>
        </div>

        <!-- Mensajes -->
        <ng-container *ngIf="miInfo">
          <div *ngFor="let mensaje of mensajesAMostrar; trackBy: trackByMensaje" 
               class="flex"
               [ngClass]="logDebug(mensaje) || (esMensajePropio(mensaje) ? 'justify-end' : 'justify-start')">
            <div
              class="max-w-xs lg:max-w-md px-4 py-2 rounded-xl relative flex flex-col"
              [ngClass]="esMensajePropio(mensaje) 
                ? 'bg-gradient-to-br from-orange-500/30 to-orange-600/30 text-white items-end' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white items-start'">
              <!-- Contenido del mensaje -->
              <p class="text-sm break-all whitespace-pre-line">{{ mensaje.contenido }}</p>
              <!-- Timestamp y estado -->
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs opacity-75">
                  {{ mensaje.created_at | date:'shortTime' }}
                </span>
                <!-- Iconos de estado (solo para mensajes propios) -->
                <span *ngIf="esMensajePropio(mensaje)" [class]="chatService.getEstadoIconoClase(mensaje) + ' text-xs flex items-center'">
                  <ng-container *ngIf="mensaje.pending">
                    <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </ng-container>
                  <ng-container *ngIf="!mensaje.pending">
                    {{ chatService.getEstadoIcono(mensaje) }}
                  </ng-container>
                </span>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- Estado de búsqueda -->
        <div *ngIf="buscando" class="text-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Buscando...</p>
        </div>

        <!-- Resultados de búsqueda -->
        <div *ngIf="!buscando && resultadosBusqueda.termino && mensajesAMostrar.length > 0" 
             class="text-center py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mx-2 mb-2">
          <p class="text-sm text-blue-600 dark:text-blue-400">
            🔍 Encontrados {{ resultadosBusqueda.total }} mensajes para "{{ resultadosBusqueda.termino }}"
          </p>
          <p class="text-xs text-blue-500 dark:text-blue-300">
            Página {{ resultadosBusqueda.pagina }} de {{ resultadosBusqueda.totalPaginas }}
          </p>
        </div>

        <!-- Sin resultados de búsqueda -->
        <div *ngIf="!buscando && resultadosBusqueda.termino && mensajesAMostrar.length === 0" 
             class="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <p class="text-sm">No se encontraron mensajes</p>
          <p class="text-xs">para "{{ resultadosBusqueda.termino }}"</p>
        </div>

        <!-- Sin mensajes -->
        <div *ngIf="!cargando && miInfo && mensajesAMostrar.length === 0" 
             class="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <p class="text-sm">No hay mensajes</p>
          <p class="text-xs">Inicia una conversación</p>
        </div>
      </div>

      <!-- Input de mensaje -->
      <div class="chat-input px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div class="flex gap-2">
          <input 
            type="text" 
            [(ngModel)]="nuevoMensaje"
            (keyup.enter)="enviarMensaje()"
            placeholder="Escribe un mensaje..."
            [disabled]="enviando"
            class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
          
          <button 
            (click)="enviarMensaje()"
            [disabled]="!nuevoMensaje.trim() || enviando"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <svg *ngIf="!enviando" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            <svg *ngIf="enviando" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      min-height: 400px;
    }
    
    .chat-input input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() reservaId!: number;
  @Input() titulo?: string;
  @Input() esAdmin: boolean = false;
  @Output() mensajeEnviado = new EventEmitter<ChatMessage>();

  @ViewChild('mensajesContainer') mensajesContainer!: ElementRef;

  // Datos del chat
  mensajes: ChatMessage[] = [];
  mensajesAMostrar: ChatMessage[] = [];
  miInfo?: ChatUserInfo;
  miRol: string = 'usuario';
  
  // Estados
  cargando = false;
  enviando = false;
  conectado = false;
  usuariosConectados: any[] = [];
  
  // Búsqueda (solo admin)
  textoBusqueda = '';
  buscando = false;
  busquedaSubject = new Subject<string>();
  
  // Información de búsqueda
  resultadosBusqueda = {
    termino: '',
    total: 0,
    pagina: 1,
    totalPaginas: 1
  };
  
  // Input
  nuevoMensaje = '';

  // Subscripciones
  private readonly subscriptions: Subscription[] = [];

  constructor(
    public chatService: ChatService,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      this.chatService.inicializarEcho(token);
      this.inicializarChat();
      this.configurarSubscripciones();
    } else {
      console.warn('[CHAT] No hay token disponible, no se inicializa el chat.');
    }
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.reservaId) {
      this.chatService.dejarDeEscuchar(this.reservaId);
    }
  }

  private inicializarChat() {
    if (!this.reservaId) return;

    this.cargando = true;
    
    // Obtener información del usuario
    this.chatService.obtenerMiInfo(this.reservaId).subscribe({
      next: (info) => {
        this.miInfo = info.data;
        this.miRol = info.data?.rol ?? '';
        this.cargarMensajes();
      },
      error: (error) => {
        console.error('Error al obtener info del usuario:', error);
        this.cargarMensajes();
      }
    });

    // Escuchar mensajes y presencia
    this.chatService.escucharMensajes(this.reservaId);
    this.chatService.escucharPresencia(this.reservaId);
  }

  private configurarSubscripciones() {
    // Conexión
    this.subscriptions.push(
      this.chatService.conexion$.subscribe(conectado => {
        this.conectado = conectado;
      })
    );

    // Mensajes en tiempo real
    this.subscriptions.push(
      this.chatService.mensajes$.subscribe(mensaje => {
        if (mensaje) {
          console.log('[DEBUG][chat.component] Mensaje recibido en tiempo real:', mensaje);
          this.agregarMensaje(mensaje);
          this.marcarMensajeRecibido(mensaje.id);
        }
      })
    );

    // Estados de mensajes
    this.subscriptions.push(
      this.chatService.estadoMensaje$.subscribe(evento => {
        this.actualizarEstadoMensaje(evento);
      })
    );

    // Presencia
    this.subscriptions.push(
      this.chatService.presencia$.subscribe(evento => {
        this.manejarEventoPresencia(evento);
      })
    );

    // Usuarios conectados
    this.subscriptions.push(
      this.chatService.usuariosConectados$.subscribe(usuarios => {
        this.usuariosConectados = usuarios;
      })
    );

    // Búsqueda con debounce
    this.subscriptions.push(
      this.busquedaSubject.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(texto => {
        if (texto.trim()) {
          this.buscarMensajes(texto);
        } else {
          this.mensajesAMostrar = this.mensajes;
        }
      })
    );
  }

  public cargarMensajes() {
    this.chatService.obtenerMensajes(this.reservaId).subscribe({
      next: (mensajes: any) => {
        this.mensajes = (Array.isArray(mensajes) ? mensajes : (mensajes.data || [])).map((m: any) => ({
          ...m,
          entregado: !!m.entregado_en,
          leido: !!m.leido_en
        }));
        this.mensajesAMostrar = this.mensajes;
        this.cargando = false;
        
        // Marcar mensajes como entregados y leídos
        this.mensajes.forEach(mensaje => {
          if (mensaje.emisor !== this.miRol) {
            this.marcarMensajeRecibido(mensaje.id);
            this.marcarMensajeLeido(mensaje.id);
          }
        });
        
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Error al cargar mensajes:', error);
        
        // Si el error es porque no existe conversación, intentar crearla
        if (error.status === 404 && error.error?.message?.includes('No existe conversación')) {
          console.log('Creando conversación para la reserva:', this.reservaId);
          this.crearConversacion();
        } else {
          this.cargando = false;
        }
      }
    });
  }

  private crearConversacion() {
    this.chatService.crearConversacion(this.reservaId).subscribe({
      next: (conversacion) => {
        console.log('Conversación creada:', conversacion);
        // Una vez creada la conversación, intentar cargar los mensajes nuevamente
        this.cargarMensajes();
      },
      error: (error) => {
        console.error('Error al crear conversación:', error);
        this.cargando = false;
      }
    });
  }

  private agregarMensaje(mensaje: ChatMessage) {
    console.log('[DEBUG][chat.component] Agregando mensaje:', mensaje);
    // Verificar si el mensaje ya existe
    const existe = this.mensajes.some(m => m.id === mensaje.id);
    if (!existe) {
      this.mensajes.push(mensaje);
      this.mensajesAMostrar = this.mensajes;
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  private actualizarEstadoMensaje(evento: any) {
    const { tipo, data } = evento;
    const mensajeIndex = this.mensajes.findIndex(m => m.id === data.mensaje_id);
    
    if (mensajeIndex !== -1) {
      if (tipo === 'entregado') {
        this.mensajes[mensajeIndex].entregado = true;
        this.mensajes[mensajeIndex].entregado_en = data.entregado_en;
      } else if (tipo === 'leido') {
        this.mensajes[mensajeIndex].leido = true;
        this.mensajes[mensajeIndex].leido_en = data.leido_en;
      }
    }
  }

  private manejarEventoPresencia(evento: any) {
    console.log('Evento de presencia:', evento);
    // Los usuarios conectados se actualizan automáticamente a través del observable
  }

  private marcarMensajeRecibido(mensajeId: number) {
    this.chatService.marcarEntregado(mensajeId).subscribe({
      next: () => {
        const mensaje = this.mensajes.find(m => m.id === mensajeId);
        if (mensaje) {
          mensaje.entregado = true;
        }
      },
      error: (error) => {
        console.error('Error al marcar mensaje como entregado:', error);
      }
    });
  }

  private marcarMensajeLeido(mensajeId: number) {
    this.chatService.marcarLeido(mensajeId).subscribe({
      next: () => {
        const mensaje = this.mensajes.find(m => m.id === mensajeId);
        if (mensaje) {
          mensaje.leido = true;
        }
      },
      error: (error) => {
        console.error('Error al marcar mensaje como leído:', error);
      }
    });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim() || this.enviando) return;

    const contenido = this.nuevoMensaje.trim();
    this.enviando = true;

    // Mensaje temporal
    const tempMensaje: ChatMessage = {
      id: Date.now(), // ID temporal
      contenido,
      emisor: this.miInfo?.rol ?? this.miRol, // Usar siempre el rol real
      reserva_id: this.reservaId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      entregado: false,
      leido: false,
      pending: true
    };

    console.log('[DEBUG][chat.component] Enviando mensaje:', tempMensaje);
    this.mensajes.push(tempMensaje);
    this.mensajesAMostrar = this.mensajes;
    this.nuevoMensaje = '';
    this.scrollToBottom();

    this.chatService.enviarMensaje(this.reservaId, contenido).subscribe({
      next: (mensajeReal) => {
        // Reemplazar mensaje temporal con el real
        const index = this.mensajes.findIndex(m => m.id === tempMensaje.id);
        if (index !== -1) {
          // Forzar el emisor a ser igual a miInfo.rol si el backend responde diferente
          const realMsg = mensajeReal.data || mensajeReal;
          if (realMsg.emisor === undefined || realMsg.emisor === null) {
            realMsg.emisor = this.miInfo?.rol ?? this.miRol;
          }
          this.mensajes[index] = realMsg;
          this.mensajes[index].pending = false;
        }
        this.enviando = false;
        this.mensajeEnviado.emit(this.mensajes[index]);
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
        
        // Si el error es porque no existe conversación, intentar crearla y reenviar
        if (error.status === 404 && error.error?.message?.includes('No existe conversación')) {
          console.log('Creando conversación antes de enviar mensaje');
          this.crearConversacionYEnviarMensaje(contenido, tempMensaje);
        } else {
          // Remover mensaje temporal en caso de error
          this.mensajes = this.mensajes.filter(m => m.id !== tempMensaje.id);
          this.mensajesAMostrar = this.mensajes;
          this.enviando = false;
        }
      }
    });
  }

  private crearConversacionYEnviarMensaje(contenido: string, tempMensaje: ChatMessage) {
    this.chatService.crearConversacion(this.reservaId).subscribe({
      next: (conversacion) => {
        console.log('Conversación creada, reenviando mensaje');
        // Una vez creada la conversación, intentar enviar el mensaje nuevamente
        this.chatService.enviarMensaje(this.reservaId, contenido).subscribe({
          next: (mensajeReal) => {
            // Reemplazar mensaje temporal con el real
            const index = this.mensajes.findIndex(m => m.id === tempMensaje.id);
            if (index !== -1) {
              // Forzar el emisor a ser igual a miInfo.rol si el backend responde diferente
              const realMsg = mensajeReal.data || mensajeReal;
              if (realMsg.emisor === undefined || realMsg.emisor === null) {
                realMsg.emisor = this.miInfo?.rol ?? this.miRol;
              }
              this.mensajes[index] = realMsg;
              this.mensajes[index].pending = false;
            }
            this.enviando = false;
            this.mensajeEnviado.emit(this.mensajes[index]);
          },
          error: (error) => {
            console.error('Error al reenviar mensaje:', error);
            // Remover mensaje temporal en caso de error
            this.mensajes = this.mensajes.filter(m => m.id !== tempMensaje.id);
            this.mensajesAMostrar = this.mensajes;
            this.enviando = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al crear conversación para enviar mensaje:', error);
        // Remover mensaje temporal en caso de error
        this.mensajes = this.mensajes.filter(m => m.id !== tempMensaje.id);
        this.mensajesAMostrar = this.mensajes;
        this.enviando = false;
      }
    });
  }

  private buscarMensajes(texto: string) {
    this.buscando = true;
    const params: ChatSearchParams = {
      texto,
      reserva_id: this.reservaId
    };

    this.chatService.buscarMensajesUsuario(params).subscribe({
      next: (resultado) => {
        // Extraer los mensajes de la respuesta paginada
        this.mensajesAMostrar = resultado.data.data || [];
        this.resultadosBusqueda = {
          termino: texto,
          total: resultado.data.total,
          pagina: resultado.data.current_page,
          totalPaginas: resultado.data.last_page || 1 // Si no hay last_page, asumir 1 página
        };
        this.buscando = false;
        
        // Log para debug
        console.log(`[BÚSQUEDA] Encontrados ${resultado.data.total} mensajes para "${resultado.search_term}"`);
        console.log(`[BÚSQUEDA] Página ${resultado.data.current_page} de ${this.resultadosBusqueda.totalPaginas}`);
      },
      error: (error) => {
        console.error('Error al buscar mensajes:', error);
        this.buscando = false;
      }
    });
  }

  limpiarBusqueda() {
    this.textoBusqueda = '';
    this.mensajesAMostrar = this.mensajes;
    this.resultadosBusqueda = {
      termino: '',
      total: 0,
      pagina: 1,
      totalPaginas: 1
    };
  }

  onScroll() {
    // Detectar cuando el usuario hace scroll para marcar mensajes como leídos
    const container = this.mensajesContainer.nativeElement;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    // Si está cerca del final, marcar mensajes como leídos
    if (scrollHeight - scrollTop - clientHeight < 50) {
      this.mensajes.forEach(mensaje => {
        if (mensaje.emisor !== this.miInfo?.rol && !mensaje.leido) {
          this.marcarMensajeLeido(mensaje.id);
        }
      });
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.mensajesContainer) {
        const container = this.mensajesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  trackByMensaje(index: number, mensaje: ChatMessage): number {
    return mensaje.id;
  }

  logDebug(mensaje: ChatMessage) {
    return '';
  }

  esMensajePropio(mensaje: ChatMessage): boolean {
    const miRol = ((this.miInfo?.rol ?? this.miRol) || '').toLowerCase();
    const emisor = (mensaje.emisor ?? '').toLowerCase();
    // Si soy admin, solo los mensajes de admin van a la derecha
    if (miRol === 'administrador') {
      return emisor === 'administrador';
    }
    // Si soy usuario o emprendedor, solo los míos van a la derecha
    return emisor === miRol;
  }
}
