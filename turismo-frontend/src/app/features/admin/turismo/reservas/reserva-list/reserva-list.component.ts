import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TurismoService, Reserva } from '../../../../../core/services/turismo.service';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Reservas</h1>
        <div class="mt-4 sm:mt-0">
          <a 
            routerLink="/admin/reservas/create" 
            class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nueva Reserva
          </a>
        </div>
      </div>
      
      <!-- Filtros -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700">Buscar</label>
            <div class="mt-1">
              <input 
                type="text" 
                id="search" 
                [(ngModel)]="searchTerm" 
                placeholder="Nombre o descripción" 
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
            </div>
          </div>
          
          <div>
            <label for="fecha_desde" class="block text-sm font-medium text-gray-700">Fecha desde</label>
            <div class="mt-1">
              <input 
                type="date" 
                id="fecha_desde" 
                [(ngModel)]="fechaDesde" 
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
            </div>
          </div>
          
          <div>
            <label for="fecha_hasta" class="block text-sm font-medium text-gray-700">Fecha hasta</label>
            <div class="mt-1">
              <input 
                type="date" 
                id="fecha_hasta" 
                [(ngModel)]="fechaHasta" 
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
            </div>
          </div>
          
          <div class="flex items-end">
            <button 
              type="button" 
              (click)="applyFilters()" 
              class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Filtrar
            </button>
          </div>
        </div>
      </div>
      
      <!-- Tabla de reservas -->
      <div class="rounded-lg bg-white shadow-sm overflow-hidden">
        @if (loading) {
          <div class="flex justify-center items-center p-8">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
            <span class="ml-4">Cargando reservas...</span>
          </div>
        } @else if (reservas.length === 0) {
          <div class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron reservas</h3>
            <p class="mt-1 text-sm text-gray-500">Comience creando una nueva reserva.</p>
            <div class="mt-6">
              <a routerLink="/admin/reservas/create" class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Nueva Reserva
              </a>
            </div>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emprendedores</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (reserva of reservas; track reserva.id) {
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ reserva.nombre }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ formatDate(reserva.fecha) }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-500 truncate max-w-xs">{{ reserva.descripcion || 'Sin descripción' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                            [class.bg-green-100]="reserva.tipo === 'Individual'"
                            [class.text-green-800]="reserva.tipo === 'Individual'"
                            [class.bg-blue-100]="reserva.tipo === 'Grupal'"
                            [class.text-blue-800]="reserva.tipo === 'Grupal'">
                        {{ reserva.tipo }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        @if (reserva.emprendedores && reserva.emprendedores.length > 0) {
                          <span>{{ reserva.emprendedores.length }} emprendedor(es)</span>
                        } @else {
                          <span class="text-gray-500">Sin emprendedores</span>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <a 
                          [routerLink]="['/admin/reservas/edit', reserva.id]" 
                          class="text-primary-600 hover:text-primary-900"
                          title="Editar"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </a>
                        
                        <a 
                          [routerLink]="['/admin/reservas', reserva.id, 'detalles']" 
                          class="text-green-600 hover:text-green-900"
                          title="Ver detalles"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                          </svg>
                        </a>
                        
                        <button 
                          (click)="deleteReserva(reserva)" 
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
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
})
export class ReservaListComponent implements OnInit {
  private turismoService = inject(TurismoService);
  
  reservas: Reserva[] = [];
  loading = true;
  
  // Filtros
  searchTerm = '';
  fechaDesde = '';
  fechaHasta = '';
  
  ngOnInit() {
    this.loadReservas();
  }
  
  loadReservas() {
    this.loading = true;
    this.turismoService.getReservas().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.loading = false;
      }
    });
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  applyFilters() {
    // Implementar la lógica de filtrado
    // Por ahora, simplemente recargamos las reservas
    this.loadReservas();
  }
  
  deleteReserva(reserva: Reserva) {
    if (!reserva.id) return;
    
    if (confirm(`¿Está seguro de eliminar la reserva "${reserva.nombre}"? Esta acción no se puede deshacer.`)) {
      this.turismoService.deleteReserva(reserva.id).subscribe({
        next: () => {
          this.reservas = this.reservas.filter(r => r.id !== reserva.id);
          alert('Reserva eliminada correctamente');
        },
        error: (error) => {
          console.error('Error al eliminar reserva:', error);
          alert('Error al eliminar la reserva. Por favor, intente nuevamente.');
        }
      });
    }
  }
}