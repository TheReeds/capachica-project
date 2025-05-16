import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { TurismoService, Emprendedor, Servicio } from '../../../../../core/services/turismo.service';

@Component({
  selector: 'app-emprendedor-servicios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Servicios de {{ emprendedor?.nombre }}</h1>
          <p class="mt-1 text-sm text-gray-500" *ngIf="emprendedor">
            Gestione los servicios que ofrece este emprendedor.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <a 
            routerLink="/admin/emprendedores" 
            class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver
          </a>
          
          <a 
            routerLink="/admin/servicios/create" 
            [queryParams]="{emprendedor_id: emprendedorId}"
            class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nuevo Servicio
          </a>
        </div>
      </div>
      
      <!-- Información del emprendedor -->
      @if (emprendedor) {
        <div class="rounded-lg bg-white shadow-sm overflow-hidden">
          <div class="p-6">
            <div class="sm:flex sm:items-center">
              @if (emprendedor.imagenes && emprendedor.imagenes.length > 0) {
                <div class="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 sm:mr-6">
                  <img [src]="emprendedor.imagenes[0]" alt="Imagen de emprendedor" class="h-full w-full object-cover">
                </div>
              } @else {
                <div class="h-20 w-20 flex-shrink-0 rounded-md bg-primary-100 flex items-center justify-center sm:mr-6">
                  <span class="text-2xl text-primary-800 font-medium">{{ getEmprendedorInitials() }}</span>
                </div>
              }
              
              <div class="mt-4 sm:mt-0">
                <div class="flex items-center">
                  <h2 class="text-xl font-bold text-gray-900">{{ emprendedor.nombre }}</h2>
                  <span class="ml-3 inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {{ emprendedor.categoria }}
                  </span>
                </div>
                <div class="mt-1 text-sm text-gray-500">{{ emprendedor.descripcion }}</div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <div class="flex items-center text-sm text-gray-500">
                    <svg class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {{ emprendedor.ubicacion }}
                  </div>
                  <div class="flex items-center text-sm text-gray-500">
                    <svg class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    {{ emprendedor.telefono }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      
      <!-- Lista de servicios -->
      <div class="rounded-lg bg-white shadow-sm overflow-hidden">
        @if (loading) {
          <div class="flex justify-center items-center p-8">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
            <span class="ml-4">Cargando servicios...</span>
          </div>
        } @else if (servicios.length === 0) {
          <div class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay servicios</h3>
            <p class="mt-1 text-sm text-gray-500">Comience creando un nuevo servicio para este emprendedor.</p>
            <div class="mt-6">
              <a 
                routerLink="/admin/servicios/create" 
                [queryParams]="{emprendedor_id: emprendedorId}"
                class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Nuevo Servicio
              </a>
            </div>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categorías</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (servicio of servicios; track servicio.id) {
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ servicio.nombre }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-500 truncate max-w-xs">{{ servicio.descripcion || 'Sin descripción' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">S/. {{ servicio.precio_referencial || '0.00' }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex flex-wrap gap-1">
                        @for (categoria of servicio.categorias; track categoria.id) {
                          <span class="inline-flex rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                            {{ categoria.nombre }}
                          </span>
                        }
                        @if (!servicio.categorias || servicio.categorias.length === 0) {
                          <span class="text-sm text-gray-500">Sin categorías</span>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      @if (servicio.estado) {
                        <span class="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Activo
                        </span>
                      } @else {
                        <span class="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Inactivo
                        </span>
                      }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <a 
                          [routerLink]="['/admin/servicios/edit', servicio.id]" 
                          class="text-primary-600 hover:text-primary-900"
                          title="Editar"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </a>
                        
                        <button 
                          (click)="toggleServicioEstado(servicio)" 
                          [class]="servicio.estado ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'"
                          [title]="servicio.estado ? 'Desactivar' : 'Activar'"
                        >
                          @if (servicio.estado) {
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                            </svg>
                          } @else {
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          }
                        </button>
                        
                        <button 
                          (click)="deleteServicio(servicio)" 
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
export class EmprendedorServiciosComponent implements OnInit {
  private turismoService = inject(TurismoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  emprendedorId: number | null = null;
  emprendedor: Emprendedor | null = null;
  servicios: Servicio[] = [];
  
  loading = true;
  error = '';
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.emprendedorId = +id;
      this.loadEmprendedor();
      this.loadServicios();
    } else {
      this.error = 'ID de emprendedor no válido';
      this.loading = false;
    }
  }
  
  loadEmprendedor() {
    if (!this.emprendedorId) return;
    
    this.turismoService.getEmprendedor(this.emprendedorId).subscribe({
      next: (emprendedor) => {
        this.emprendedor = emprendedor;
      },
      error: (error) => {
        console.error('Error al cargar emprendedor:', error);
        this.error = 'Error al cargar los datos del emprendedor.';
      }
    });
  }
  
  loadServicios() {
    if (!this.emprendedorId) return;
    
    this.loading = true;
    this.turismoService.getServiciosByEmprendedor(this.emprendedorId).subscribe({
      next: (servicios) => {
        this.servicios = servicios;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.error = 'Error al cargar los servicios.';
        this.loading = false;
      }
    });
  }
  
  getEmprendedorInitials(): string {
    if (!this.emprendedor?.nombre) return '';
    
    const nameParts = this.emprendedor.nombre.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  }
  
  toggleServicioEstado(servicio: Servicio) {
    if (!servicio.id) return;
    
    // Clonar el servicio para no mutar el original
    const servicioActualizado = {
      ...servicio,
      estado: !servicio.estado
    };
    
    this.turismoService.updateServicio(servicio.id, servicioActualizado).subscribe({
      next: (updated) => {
        // Actualizar el servicio en la lista
        const index = this.servicios.findIndex(s => s.id === servicio.id);
        if (index !== -1) {
          this.servicios[index] = updated;
        }
      },
      error: (error) => {
        console.error('Error al actualizar estado del servicio:', error);
        alert('Error al actualizar el estado del servicio. Por favor, intente nuevamente.');
      }
    });
  }
  
  deleteServicio(servicio: Servicio) {
    if (!servicio.id) return;
    
    if (confirm(`¿Está seguro de eliminar el servicio "${servicio.nombre}"? Esta acción no se puede deshacer.`)) {
      this.turismoService.deleteServicio(servicio.id).subscribe({
        next: () => {
          // Actualizar la lista de servicios
          this.servicios = this.servicios.filter(s => s.id !== servicio.id);
          alert('Servicio eliminado correctamente');
        },
        error: (error) => {
          console.error('Error al eliminar servicio:', error);
          alert('Error al eliminar el servicio. Por favor, intente nuevamente.');
        }
      });
    }
  }
}