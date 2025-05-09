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
      
      <!-- Tabla de eventos -->
      <div class="rounded-lg bg-white shadow-sm overflow-hidden">
        <div *ngIf="loading" class="flex justify-center items-center p-8">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
          <span class="ml-4">Cargando datos...</span>
        </div>
        <div *ngIf="!loading && eventos.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron eventos</h3>
          <p class="mt-1 text-sm text-gray-500">Comienza creando un nuevo evento.</p>
        </div>
        <div *ngIf="!loading && eventos.length > 0">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let evento of eventos">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ evento.nombre }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ evento.descripcion }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2">
                      <a 
                        [routerLink]="['/admin/eventos/edit', evento.id]" 
                        class="text-primary-600 hover:text-primary-900"
                        title="Editar"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </a>
                      
                      <button 
                        (click)="deleteEvento(evento)" 
                        class="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
        this.eventos = eventos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        this.loading = false;
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
