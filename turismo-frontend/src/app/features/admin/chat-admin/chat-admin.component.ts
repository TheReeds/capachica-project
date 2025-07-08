import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage, ChatStats, ChatSearchParams, ChatHistoryParams } from '../../../core/services/chat.service';
import { Subscription, debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-chat-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div class="max-w-7xl mx-auto space-y-6">
        
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                Administración del Chat
              </h1>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                Gestiona conversaciones, busca mensajes y monitorea estadísticas
              </p>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" 
                     [class]="conectado ? 'bg-green-500' : 'bg-red-500'"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ conectado ? 'Conectado' : 'Desconectado' }}
                </span>
              </div>
              <button (click)="actualizarTodo()" 
                      [disabled]="cargandoStats"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {{ cargandoStats ? 'Actualizando...' : 'Actualizar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Estadísticas -->
        <div *ngIf="estadisticas" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Mensajes</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ estadisticas.total_mensajes }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Entregados</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ estadisticas.mensajes_entregados }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Leídos</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ estadisticas.mensajes_leidos }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Pendientes</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ estadisticas.mensajes_pendientes }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Conversaciones</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ estadisticas.conversaciones_activas }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Conectados</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ estadisticas.usuarios_conectados }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtros y Búsqueda -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- Búsqueda de texto -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar mensajes
              </label>
              <div class="flex gap-2">
              <input 
                type="text" 
                [(ngModel)]="filtrosBusqueda.texto"
                (ngModelChange)="busquedaSubject.next($event)"
                placeholder="Buscar en mensajes..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <button (click)="aplicarFiltros()" class="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" title="Buscar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Filtro por reserva -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reserva ID
              </label>
              <input 
                type="number" 
                [(ngModel)]="filtrosBusqueda.reserva_id"
                (ngModelChange)="aplicarFiltros()"
                placeholder="ID de reserva..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>

            <!-- Filtro por emisor -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emisor
              </label>
              <select 
                [(ngModel)]="filtrosBusqueda.emisor"
                (ngModelChange)="aplicarFiltros()"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Todos</option>
                <option value="usuario">Usuario</option>
                <option value="emprendedor">Emprendedor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <!-- Filtro por fecha -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha desde
              </label>
              <input 
                type="date" 
                [(ngModel)]="filtrosBusqueda.fecha_desde"
                (ngModelChange)="aplicarFiltros()"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
          </div>

          <div class="flex justify-between items-center mt-4">
            <button (click)="limpiarFiltros()" 
                    class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              Limpiar filtros
            </button>
            
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ totalMensajes }} mensajes encontrados
              </span>
            </div>
          </div>
        </div>

        <!-- Lista de mensajes -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Historial de Mensajes
            </h3>
          </div>

          <!-- Resultados de búsqueda -->
          <div *ngIf="resultadosBusqueda.esBusqueda && mensajes.length > 0" 
               class="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  🔍 Encontrados {{ resultadosBusqueda.total }} mensajes para "{{ resultadosBusqueda.termino }}"
                </p>
                <p class="text-xs text-blue-500 dark:text-blue-300">
                  Página {{ resultadosBusqueda.pagina }} de {{ resultadosBusqueda.totalPaginas }}
                </p>
              </div>
              <button (click)="limpiarFiltros()" 
                      class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                ✕ Limpiar búsqueda
              </button>
            </div>
          </div>

          <!-- Sin resultados de búsqueda -->
          <div *ngIf="resultadosBusqueda.esBusqueda && mensajes.length === 0 && !cargando" 
               class="p-8 text-center">
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 104 4a7 7 0 0013 13z"/>
            </svg>
            <p class="text-gray-600 dark:text-gray-400">No se encontraron mensajes</p>
            <p class="text-sm text-gray-500 dark:text-gray-500">para "{{ resultadosBusqueda.termino }}"</p>
            <button (click)="limpiarFiltros()" 
                    class="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Limpiar búsqueda
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reserva
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Emisor
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mensaje
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr *ngFor="let mensaje of mensajes; trackBy: trackByMensaje">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ mensaje.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    #{{ mensaje.reserva_id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [class]="getEmisorBadgeClass(mensaje.emisor)">
                      {{ mensaje.emisor | titlecase }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div class="max-w-xs truncate" [title]="mensaje.contenido">
                      {{ mensaje.contenido }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ mensaje.created_at | date:'short' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <span [class]="chatService.getEstadoIconoClase(mensaje)" class="text-sm">
                        {{ chatService.getEstadoIcono(mensaje) }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ mensaje.leido ? 'Leído' : mensaje.entregado ? 'Entregado' : 'Enviado' }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Loading -->
          <div *ngIf="cargando" class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Cargando mensajes...</p>
          </div>

          <!-- Sin mensajes -->
          <div *ngIf="!cargando && mensajes.length === 0 && !resultadosBusqueda.esBusqueda" class="p-8 text-center">
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <p class="text-gray-600 dark:text-gray-400">No se encontraron mensajes</p>
          </div>
        </div>

        <!-- Paginación -->
        <div *ngIf="totalMensajes > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 dark:text-white">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Mostrando {{ (paginaActual - 1) * 50 + 1 }} a {{ Math.min(paginaActual * 50, totalMensajes) }} de {{ totalMensajes }} mensajes
            </div>
            <div class="flex items-center gap-2">
              <button 
                (click)="cambiarPagina(paginaActual - 1)"
                [disabled]="paginaActual <= 1"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50">
                Anterior
              </button>
              <span class="px-3 py-1 text-sm">{{ paginaActual }}</span>
              <button 
                (click)="cambiarPagina(paginaActual + 1)"
                [disabled]="mensajes.length < 50"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ChatAdminComponent implements OnInit, OnDestroy {
  // Datos
  mensajes: ChatMessage[] = [];
  estadisticas?: ChatStats;
  totalMensajes = 0;
  
  // Estados
  cargando = false;
  cargandoStats = false;
  conectado = false;
  
  // Filtros
  filtrosBusqueda: ChatSearchParams = {
    texto: '',
    reserva_id: undefined,
    emisor: '',
    fecha_desde: '',
    fecha_hasta: '',
    page: 1
  };
  
  // Información de resultados de búsqueda
  resultadosBusqueda = {
    termino: '',
    total: 0,
    pagina: 1,
    totalPaginas: 1,
    esBusqueda: false
  };
  
  // Paginación
  paginaActual = 1;
  
  // Búsqueda
  busquedaSubject = new Subject<string>();
  
  // Subscripciones
  private subscriptions: Subscription[] = [];

  constructor(public chatService: ChatService) {}

  ngOnInit() {
    this.configurarSubscripciones();
    this.cargarEstadisticas();
    this.cargarMensajes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private configurarSubscripciones() {
    // Conexión
    this.subscriptions.push(
      this.chatService.conexion$.subscribe(conectado => {
        this.conectado = conectado;
      })
    );

    // Búsqueda con debounce
    this.subscriptions.push(
      this.busquedaSubject.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(texto => {
        this.filtrosBusqueda.texto = texto;
        this.aplicarFiltros();
      })
    );
  }

  cargarEstadisticas() {
    this.cargandoStats = true;
    this.chatService.obtenerEstadisticas().subscribe({
      next: (stats) => {
        this.estadisticas = stats;
        this.cargandoStats = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.cargandoStats = false;
      }
    });
  }

  cargarMensajes() {
    this.cargando = true;
    const params: ChatHistoryParams = {
      ...this.filtrosBusqueda,
      page: this.paginaActual
    };

    if (this.filtrosBusqueda.texto && this.filtrosBusqueda.texto.trim() !== '') {
      // Es una búsqueda
      this.resultadosBusqueda.esBusqueda = true;
      this.resultadosBusqueda.termino = this.filtrosBusqueda.texto;
      
      const searchParams: ChatSearchParams = {
        texto: this.filtrosBusqueda.texto,
        reserva_id: this.filtrosBusqueda.reserva_id,
        emisor: this.filtrosBusqueda.emisor,
        fecha_desde: this.filtrosBusqueda.fecha_desde,
        fecha_hasta: this.filtrosBusqueda.fecha_hasta,
        page: this.paginaActual
      };
      
      this.chatService.buscarMensajes(searchParams).subscribe({
        next: (resultado: any) => {
          const mensajes = resultado.data || resultado;
          this.mensajes = (mensajes.data || mensajes).map((m: any) => ({
            ...m,
            entregado: !!m.entregado_en,
            leido: !!m.leido_en
          }));
          
          // Actualizar información de resultados
          this.totalMensajes = mensajes.total || this.mensajes.length;
          this.resultadosBusqueda.total = mensajes.total || 0;
          this.resultadosBusqueda.pagina = mensajes.current_page || 1;
          this.resultadosBusqueda.totalPaginas = mensajes.last_page || 1;
          
          this.cargando = false;
          
          // Log para debug
          console.log(`[BÚSQUEDA HISTORIAL] Encontrados ${mensajes.total} mensajes para "${this.filtrosBusqueda.texto}"`);
          console.log(`[BÚSQUEDA HISTORIAL] Página ${mensajes.current_page} de ${mensajes.last_page}`);
        },
        error: (error) => {
          console.error('Error al buscar mensajes:', error);
          this.cargando = false;
        }
      });
    } else {
      // Es historial normal
      this.resultadosBusqueda.esBusqueda = false;
      this.resultadosBusqueda.termino = '';
      
      this.chatService.obtenerHistorial(params).subscribe({
        next: (resultado: any) => {
          this.mensajes = (resultado.data?.data || []).map((m: any) => ({
            ...m,
            entregado: !!m.entregado_en,
            leido: !!m.leido_en
          }));
          this.totalMensajes = resultado.data?.total || 0;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar mensajes:', error);
          this.cargando = false;
        }
      });
    }
  }

  aplicarFiltros() {
    this.paginaActual = 1;
    this.cargarMensajes();
  }

  limpiarFiltros() {
    this.filtrosBusqueda = {
      texto: '',
      reserva_id: undefined,
      emisor: '',
      fecha_desde: '',
      fecha_hasta: '',
      page: 1
    };
    this.resultadosBusqueda = {
      termino: '',
      total: 0,
      pagina: 1,
      totalPaginas: 1,
      esBusqueda: false
    };
    this.aplicarFiltros();
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1) {
      this.paginaActual = pagina;
      this.cargarMensajes();
    }
  }

  actualizarTodo() {
    this.cargarEstadisticas();
    this.cargarMensajes();
  }

  getEmisorBadgeClass(emisor: string): string {
    const clases = {
      'usuario': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'emprendedor': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return clases[emisor as keyof typeof clases] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  trackByMensaje(index: number, mensaje: ChatMessage): number {
    return mensaje.id;
  }

  // Utilidad para Math.min en template
  get Math() {
    return Math;
  }
} 