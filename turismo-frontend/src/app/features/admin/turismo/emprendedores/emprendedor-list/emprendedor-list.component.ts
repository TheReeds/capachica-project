import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TurismoService, Emprendedor, PaginatedResponse } from '../../../../../core/services/turismo.service';

@Component({
  selector: 'app-emprendedor-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Emprendedores</h1>
        <div class="mt-4 sm:mt-0">
          <a 
            routerLink="/admin/emprendedores/create" 
            class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nuevo Emprendedor
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
            <label for="categoria" class="block text-sm font-medium text-gray-700">Categoría</label>
            <div class="mt-1">
              <select 
                id="categoria" 
                [(ngModel)]="selectedCategoria" 
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Todas</option>
                <option value="Artesanía">Artesanía</option>
                <option value="Gastronomía">Gastronomía</option>
                <option value="Alojamiento">Alojamiento</option>
                <option value="Guía">Guía</option>
                <option value="Transporte">Transporte</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
          
          <div>
            <label for="asociacion_id" class="block text-sm font-medium text-gray-700">Asociación</label>
            <div class="mt-1">
              <select 
                id="asociacion_id" 
                [(ngModel)]="selectedAsociacionId" 
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option [ngValue]="null">Todas</option>
                <option [ngValue]="0">Sin asociación</option>
                @for (asociacion of asociaciones; track asociacion.id) {
                  <option [ngValue]="asociacion.id">{{ asociacion.nombre }}</option>
                }
              </select>
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
      
      <!-- Tabla de emprendedores -->
      <div class="rounded-lg bg-white shadow-sm overflow-hidden">
        @if (loading) {
          <div class="flex justify-center items-center p-8">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
            <span class="ml-4">Cargando emprendedores...</span>
          </div>
        } @else if (!pagination || pagination.data.length === 0) {
          <div class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron emprendedores</h3>
            <p class="mt-1 text-sm text-gray-500">Comience creando un nuevo emprendedor.</p>
            <div class="mt-6">
              <a routerLink="/admin/emprendedores/create" class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Nuevo Emprendedor
              </a>
            </div>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emprendedor</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Servicio</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asociación</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (emprendedor of pagination.data; track emprendedor.id) {
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        @if (emprendedor.imagenes && emprendedor.imagenes.length > 0) {
                          <div class="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-100">
                            <img [src]="emprendedor.imagenes[0]" alt="Imagen de emprendedor" class="h-full w-full object-cover">
                          </div>
                        } @else {
                          <div class="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
                            <span class="text-primary-800 font-medium">{{ getEmprendedorInitials(emprendedor) }}</span>
                          </div>
                        }
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ emprendedor.nombre }}</div>
                          <div class="text-sm text-gray-500">{{ emprendedor.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ emprendedor.tipo_servicio }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{{ emprendedor.ubicacion }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        @if (emprendedor.asociacion) {
                          {{ emprendedor.asociacion.nombre }}
                        } @else {
                          <span class="text-gray-500">Sin asociación</span>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {{ emprendedor.categoria }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <a 
                          [routerLink]="['/admin/emprendedores/edit', emprendedor.id]" 
                          class="text-primary-600 hover:text-primary-900"
                          title="Editar"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </a>
                        
                        <a 
                          [routerLink]="['/admin/emprendedores', emprendedor.id, 'servicios']" 
                          class="text-green-600 hover:text-green-900"
                          title="Ver servicios"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                          </svg>
                        </a>
                        
                        <button 
                          (click)="deleteEmprendedor(emprendedor)" 
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
          
          <!-- Paginación -->
          @if (pagination) {
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Mostrando <span class="font-medium">{{ pagination.from || 0 }}</span> a <span class="font-medium">{{ pagination.to || 0 }}</span> de <span class="font-medium">{{ pagination.total }}</span> resultados
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      (click)="goToPage(currentPage - 1)"
                      [disabled]="!pagination.prev_page_url"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      [class.opacity-50]="!pagination.prev_page_url"
                      [class.cursor-not-allowed]="!pagination.prev_page_url"
                    >
                      <span class="sr-only">Anterior</span>
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    
                    @for (link of pagination.links; track $index) {
                      @if (link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;') {
                        <button
                          (click)="goToPage(+link.label)"
                          class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
                          [class.bg-primary-50]="link.active"
                          [class.text-primary-600]="link.active"
                          [class.text-gray-700]="!link.active"
                          [class.hover:bg-gray-50]="!link.active"
                          [disabled]="link.active"
                        >
                          {{ link.label }}
                        </button>
                      }
                    }
                    
                    <button
                      (click)="goToPage(currentPage + 1)"
                      [disabled]="!pagination.next_page_url"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      [class.opacity-50]="!pagination.next_page_url"
                      [class.cursor-not-allowed]="!pagination.next_page_url"
                    >
                      <span class="sr-only">Siguiente</span>
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class EmprendedorListComponent implements OnInit {
  private turismoService = inject(TurismoService);
  
  pagination: PaginatedResponse<Emprendedor> | null = null;
  asociaciones: any[] = [];
  loading = true;
  
  // Filtros
  searchTerm = '';
  selectedCategoria = '';
  selectedAsociacionId: number | null = null;
  
  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  
  ngOnInit() {
    this.loadAsociaciones();
    this.loadEmprendedores();
  }
  
  loadAsociaciones() {
    this.turismoService.getAsociaciones(1, 100).subscribe({
      next: (response) => {
        this.asociaciones = response.data;
      },
      error: (error) => {
        console.error('Error al cargar asociaciones:', error);
      }
    });
  }
  
  loadEmprendedores() {
    this.loading = true;
    this.turismoService.getEmprendedores(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.pagination = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar emprendedores:', error);
        this.loading = false;
      }
    });
  }
  
  getEmprendedorInitials(emprendedor: Emprendedor): string {
    if (!emprendedor.nombre) return '';
    
    const nameParts = emprendedor.nombre.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  }
  
  applyFilters() {
    this.currentPage = 1;
    // Aquí implementarías la lógica para filtrar emprendedores según searchTerm, selectedCategoria y selectedAsociacionId
    // Por ahora, simplemente recargamos los emprendedores
    this.loadEmprendedores();
  }
  
  deleteEmprendedor(emprendedor: Emprendedor) {
    if (!emprendedor.id) return;
    
    if (confirm(`¿Está seguro de eliminar el emprendedor "${emprendedor.nombre}"? Esta acción eliminará también todos los servicios relacionados y no se puede deshacer.`)) {
      this.turismoService.deleteEmprendedor(emprendedor.id).subscribe({
        next: () => {
          // Recargar la lista después de eliminar
          this.loadEmprendedores();
          alert('Emprendedor eliminado correctamente');
        },
        error: (error) => {
          console.error('Error al eliminar emprendedor:', error);
          alert('Error al eliminar el emprendedor. Por favor, intente nuevamente.');
        }
      });
    }
  }
  
  goToPage(page: number) {
    if (!this.pagination) return;
    
    if (page < 1 || page > this.pagination.last_page) {
      return;
    }
    
    this.currentPage = page;
    this.loadEmprendedores();
  }
}