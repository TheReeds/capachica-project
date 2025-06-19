import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmprendimientoAdminService } from '../../../core/services/emprendimiento-admin.service';
import { Emprendimiento, Servicio } from '../../../core/models/emprendimiento-admin.model';

@Component({
  selector: 'app-servicios-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <nav class="flex mb-3" aria-label="Breadcrumb">
                <ol class="inline-flex items-center space-x-1 md:space-x-3">
                  <li class="inline-flex items-center">
                    <a routerLink="/admin-emprendedores/mis-emprendimientos" 
                       class="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">
                      Mis Emprendimientos
                    </a>
                  </li>
                  <li>
                    <div class="flex items-center">
                      <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <a [routerLink]="['/admin-emprendedores/emprendimiento', emprendimientoId]" 
                         class="ml-1 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">
                        {{ emprendimiento?.nombre || 'Emprendimiento' }}
                      </a>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center">
                      <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="ml-1 text-gray-500 dark:text-gray-400">Servicios</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                Servicios - {{ emprendimiento?.nombre || 'Cargando...' }}
              </h1>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                Administra los servicios que ofreces en tu emprendimiento
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <a [routerLink]="['/admin-emprendedores/emprendimiento', emprendimientoId, 'servicio', 'nuevo']"
                 class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Nuevo Servicio
              </a>
              <button (click)="refreshData()" 
                      [disabled]="loading"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50">
                <svg *ngIf="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <div *ngIf="loading" class="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Loading State -->
      <div *ngIf="loading && servicios.length === 0" class="flex justify-center items-center py-20">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-orange-200 rounded-full"></div>
          <div class="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                Error al cargar los servicios
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                {{ error }}
              </div>
              <div class="mt-4">
                <button (click)="loadServicios()" 
                        class="bg-red-100 dark:bg-red-800 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700">
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div *ngIf="!loading || servicios.length > 0" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar servicios
              </label>
              <input
                type="text"
                id="search"
                [(ngModel)]="searchTerm"
                (input)="applyFilters()"
                placeholder="Nombre del servicio..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white">
            </div>
            <div>
              <label for="estado" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado
              </label>
              <select
                id="estado"
                [(ngModel)]="filtroEstado"
                (change)="applyFilters()"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white">
                <option value="">Todos</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                (click)="clearFilters()"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !error && servicios.length === 0" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="mt-6 text-xl font-medium text-gray-900 dark:text-white">No hay servicios</h3>
          <p class="mt-2 text-gray-500 dark:text-gray-400">
            Comienza creando tu primer servicio para este emprendimiento.
          </p>
          <div class="mt-6">
            <a [routerLink]="['/admin-emprendedores/emprendimiento', emprendimientoId, 'servicio', 'nuevo']"
               class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Crear primer servicio
            </a>
          </div>
        </div>
      </div>

      <!-- Services Grid -->
      <div *ngIf="!loading && !error && filteredServicios.length > 0" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let servicio of filteredServicios" 
               class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-200">
            
            <!-- Service Image -->
            <div class="relative h-48">
              <ng-container *ngIf="getServiceImage(servicio) as imageUrl; else noImageTemplate">
                <img [src]="imageUrl" 
                     [alt]="servicio.nombre" 
                     class="w-full h-full object-cover">
              </ng-container>
              <ng-template #noImageTemplate>
                <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </ng-template>
              
              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="{
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': servicio.estado,
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': !servicio.estado
                      }">
                  {{ servicio.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
            </div>

            <!-- Service Content -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {{ servicio.nombre }}
                </h3>
              </div>
              
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {{ servicio.descripcion }}
              </p>
              
              <!-- Price -->
              <div class="mb-4">
                <span class="text-2xl font-bold text-green-600 dark:text-green-400">
                  S/. {{ servicio.precio_referencial | number:'1.2-2' }}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  precio referencial
                </span>
              </div>

              <!-- Location -->
              <div *ngIf="servicio.ubicacion_referencia" class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ servicio.ubicacion_referencia }}
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-2">
                <a [routerLink]="['/admin-emprendedores/emprendimiento', emprendimientoId, 'servicio', servicio.id]"
                   class="flex-1 bg-orange-600 text-white text-center py-2 px-4 rounded-md hover:bg-orange-700 transition-colors text-sm font-medium">
                  Editar
                </a>
                <button (click)="toggleServicioEstado(servicio)"
                        [disabled]="servicio.updating"
                        class="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-center py-2 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50">
                  <span *ngIf="!servicio.updating">
                    {{ servicio.estado ? 'Desactivar' : 'Activar' }}
                  </span>
                  <span *ngIf="servicio.updating" class="flex items-center justify-center">
                    <div class="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent mr-1"></div>
                    Actualizando...
                  </span>
                </button>
                <button (click)="deleteServicio(servicio)"
                        [disabled]="servicio.deleting"
                        class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50">
                  <svg *ngIf="!servicio.deleting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <div *ngIf="servicio.deleting" class="w-4 h-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div *ngIf="!loading && !error && servicios.length > 0 && filteredServicios.length === 0" 
           class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No se encontraron servicios</h3>
          <p class="mt-2 text-gray-500 dark:text-gray-400">
            Intenta ajustar los filtros de búsqueda.
          </p>
          <div class="mt-4">
            <button (click)="clearFilters()"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-600 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .line-clamp-2 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    
    .line-clamp-3 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }
  `]
})
export class ServiciosListComponent implements OnInit {
  private emprendimientoAdminService = inject(EmprendimientoAdminService);
  private route = inject(ActivatedRoute);

  emprendimientoId!: number;
  emprendimiento?: Emprendimiento;
  servicios: (Servicio & { updating?: boolean; deleting?: boolean })[] = [];
  filteredServicios: (Servicio & { updating?: boolean; deleting?: boolean })[] = [];
  loading = true;
  error = '';

  // Filtros
  searchTerm = '';
  filtroEstado = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.emprendimientoId = +params['id'];
      this.loadData();
    });
  }

  private loadData(): void {
    this.loadEmprendimiento();
    this.loadServicios();
  }

  private loadEmprendimiento(): void {
    this.emprendimientoAdminService.getEmprendimiento(this.emprendimientoId).subscribe({
      next: (data) => {
        this.emprendimiento = data;
      },
      error: (err) => {
        console.error('Error al cargar emprendimiento:', err);
      }
    });
  }

  loadServicios(): void {
    this.loading = true;
    this.error = '';

    this.emprendimientoAdminService.getServicios(this.emprendimientoId).subscribe({
      next: (data) => {
        this.servicios = data.map(servicio => ({ ...servicio, updating: false, deleting: false }));
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        this.error = err.error?.message || 'Error al cargar los servicios';
        this.loading = false;
      }
    });
  }

  refreshData(): void {
    this.loadServicios();
  }

  applyFilters(): void {
    let filtered = [...this.servicios];

    // Filtro por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(servicio =>
        servicio.nombre.toLowerCase().includes(term) ||
        servicio.descripcion.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (this.filtroEstado !== '') {
      const estado = this.filtroEstado === 'true';
      filtered = filtered.filter(servicio => servicio.estado === estado);
    }

    this.filteredServicios = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filtroEstado = '';
    this.applyFilters();
  }

  getServiceImage(servicio: Servicio): string | null {
    if (servicio.sliders && servicio.sliders.length > 0) {
      return servicio.sliders[0].url_completa || servicio.sliders[0].url || null;
    }
    return null;
  }

  async toggleServicioEstado(servicio: Servicio & { updating?: boolean }): Promise<void> {
    if (servicio.updating || !servicio.id) return;

    const confirmMessage = servicio.estado 
      ? '¿Estás seguro de que quieres desactivar este servicio?' 
      : '¿Estás seguro de que quieres activar este servicio?';

    if (!confirm(confirmMessage)) return;

    servicio.updating = true;

    try {
      const updatedServicio = await this.emprendimientoAdminService.updateServicio(
        servicio.id,
        { ...servicio, estado: !servicio.estado }
      ).toPromise();

      if (updatedServicio) {
        // Actualizar el servicio en la lista
        const index = this.servicios.findIndex(s => s.id === servicio.id);
        if (index !== -1) {
          this.servicios[index] = { ...updatedServicio, updating: false, deleting: false };
          this.applyFilters();
        }
      }
    } catch (err: any) {
      console.error('Error al actualizar servicio:', err);
      alert(err.error?.message || 'Error al actualizar el servicio');
    } finally {
      servicio.updating = false;
    }
  }

  async deleteServicio(servicio: Servicio & { deleting?: boolean }): Promise<void> {
    if (servicio.deleting || !servicio.id) return;

    const confirmMessage = `¿Estás seguro de que quieres eliminar el servicio "${servicio.nombre}"? Esta acción no se puede deshacer.`;
    
    if (!confirm(confirmMessage)) return;

    servicio.deleting = true;

    try {
      await this.emprendimientoAdminService.deleteServicio(servicio.id).toPromise();
      
      // Remover el servicio de la lista
      this.servicios = this.servicios.filter(s => s.id !== servicio.id);
      this.applyFilters();
      
      // Mostrar mensaje de éxito
      alert('Servicio eliminado correctamente');
    } catch (err: any) {
      console.error('Error al eliminar servicio:', err);
      alert(err.error?.message || 'Error al eliminar el servicio');
      servicio.deleting = false;
    }
  }
}