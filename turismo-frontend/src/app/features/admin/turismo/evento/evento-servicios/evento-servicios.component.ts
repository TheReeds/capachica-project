import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Evento } from '../../../../../core/services/turismo.service';
import { EventoService } from '../evento.service';

@Component({
  selector: 'app-evento-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Eventos</h1>
        <div class="mt-4 sm:mt-0">
          <a 
            routerLink="/admin/evento/create" 
            class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            + Nuevo Evento
          </a>
        </div>
      </div>


      
      <!-- Tabla de eventos mejorada -->
      <div class="rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 shadow-lg overflow-hidden border border-indigo-100">
        <!-- Estado de carga -->
        <div *ngIf="loading" class="flex justify-center items-center p-8">
          <div class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
          <span class="ml-4 text-indigo-700 font-medium">Cargando eventos...</span>
        </div>

        <!-- Estado vacío -->
        <div *ngIf="!loading && eventos.length === 0" class="p-12 text-center">
          <div class="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <svg class="h-10 w-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <h3 class="mt-4 text-xl font-bold text-indigo-900">No se encontraron eventos</h3>
          <p class="mt-2 text-indigo-600">Comienza creando un nuevo evento para tu organización.</p>
          <button class="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Crear evento
          </button>
        </div>

        <!-- Tabla con datos -->
        <div *ngIf="!loading && eventos.length > 0" class="overflow-hidden">
          
          
          <!-- Controles y búsqueda -->
          <div class="bg-white border-b border-indigo-100 p-4 flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="text-indigo-700 font-medium">{{ eventos.length }} eventos</span>
              <span class="text-gray-400">|</span>
              <button class="text-indigo-600 hover:text-indigo-800 flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                Filtrar
              </button>
            </div>
            <div class="relative">
              <input type="text" placeholder="Buscar evento..." class="pl-10 pr-4 py-2 rounded-full border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64">
              <svg class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-indigo-100">
              <thead class="bg-indigo-50">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">Nombre</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">Descripción</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">Fecha de Inicio</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">Fecha Fin</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">Imagen</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let evento of eventos; let i = index" 
                    [ngClass]="{'bg-white': i % 2 === 0, 'bg-indigo-50': i % 2 === 1}"
                    class="hover:bg-indigo-100 transition-colors duration-150">
                  <!-- nombre -->
                  <td class="px-6 py-4">
                    <div class="text-sm font-semibold text-indigo-900">{{ evento.nombre }}</div>
                  </td>
                  <!-- descripcion -->
                  <td class="px-6 py-4 max-w-xs">
                    <div class="text-sm text-gray-700  line-clamp-2">{{ evento.descripcion }}</div>
                  </td>
                  <!-- fecha inicio -->
                  <td class="px-6 py-4">
                    <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {{ evento.fecha_inicio | date: 'dd/MM/yyyy' }}
                    </div>
                  </td>
                  <!-- fecha fin -->
                  <td class="px-6 py-4">
                    <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {{ evento.fecha_fin | date: 'dd/MM/yyyy' }}
                    </div>
                  </td>
                  <!-- iamgen -->
                  <td class="px-6 py-4">
                    <div class="relative group">
                      <img [src]="evento.imagen_url" alt="Imagen de evento" 
                          class="w-20 h-20 object-cover rounded-lg   transition-all duration-300" />
                      
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                      <a [routerLink]="['/admin/evento/edit', evento.id]" 
                        class="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors duration-300"
                        title="Editar">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </a>
                      <button (click)="deleteEvento(evento)" 
                              class="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-300"
                              title="Eliminar">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                      <button 
                              class="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-300"
                              title="Ver detalles">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Paginación -->
          <div class="bg-white px-6 py-4 border-t border-indigo-100 flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50">
                Anterior
              </a>
              <a href="#" class="ml-3 relative inline-flex items-center px-4 py-2 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50">
                Siguiente
              </a>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando <span class="font-medium">1</span> a <span class="font-medium">10</span> de <span class="font-medium">{{ eventos.length }}</span> resultados
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-indigo-300 bg-white text-sm font-medium text-indigo-500 hover:bg-indigo-50">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </a>
                  <a href="#" class="relative inline-flex items-center px-4 py-2 border border-indigo-300 bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700">
                    1
                  </a>
                  <a href="#" class="relative inline-flex items-center px-4 py-2 border border-indigo-300 bg-white text-sm font-medium text-indigo-500 hover:bg-indigo-50">
                    2
                  </a>
                  <a href="#" class="relative inline-flex items-center px-4 py-2 border border-indigo-300 bg-white text-sm font-medium text-indigo-500 hover:bg-indigo-50">
                    3
                  </a>
                  <span class="relative inline-flex items-center px-4 py-2 border border-indigo-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                  <a href="#" class="relative inline-flex items-center px-4 py-2 border border-indigo-300 bg-white text-sm font-medium text-indigo-500 hover:bg-indigo-50">
                    10
                  </a>
                  <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-indigo-300 bg-white text-sm font-medium text-indigo-500 hover:bg-indigo-50">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})




export class EventoListComponent implements OnInit {
  private eventoService = inject(EventoService);

  eventos: Evento[] = [];
  loading = true;

  

  ngOnInit() {
    this.loadEventos();
  }

  loadEventos() {
    this.loading = true;
    this.eventoService.getEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos!.data.data;
        console.log(this.eventos);
        this.loading = false;  // No necesitas 'data' si 'eventos' ya es un arreglo
      },
      error: (err) => {
        console.error('Error al cargar eventos:', err);
      }
    });
  }


  deleteEvento(evento: Evento) {
    if (!evento.id) return;

    if (confirm(`¿Está seguro de eliminar el evento "${evento.nombre}"? Esta acción no se puede deshacer.`)) {
      this.eventoService.deleteEvento(evento.id).subscribe({
        next: () => {
          this.eventos = this.eventos.filter(e => e.id !== evento.id);
          alert('Evento eliminado correctamente');
        },
        error: (error) => {
          console.error('Error al eliminar evento:', error);
          alert('Error al eliminar el evento. Por favor, intente nuevamente.');
        }
      });
    }
  }
}

export interface SliderImage {
  nombre: string;
  imagen: string;
  orden: number;
  es_principal: boolean;
}

