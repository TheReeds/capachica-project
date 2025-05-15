import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TurismoService, Asociacion, PaginatedResponse } from '../../../../../core/services/turismo.service';
import { ThemeService } from '../../../../../core/services/theme.service';

@Component({
  selector: 'app-asociacion-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6 transition-colors duration-300">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Gestión de Asociaciones</h1>
        <div class="mt-4 sm:mt-0">
          <a
            routerLink="/admin/asociaciones/create"
            class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-300"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nueva Asociación
          </a>
        </div>
      </div>

      <!-- Tabla de asociaciones -->
      <div class="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
        @if (loading) {
          <div class="flex justify-center items-center p-8 dark:text-white transition-colors duration-300">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
            <span class="ml-4">Cargando asociaciones...</span>
          </div>
        } @else if (!pagination || pagination.data.length === 0) {
          <div class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">No se encontraron asociaciones</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Comience creando una nueva asociación.</p>
            <div class="mt-6">
              <a routerLink="/admin/asociaciones/create" class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-300">
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Nueva Asociación
              </a>
            </div>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
              <thead class="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Nombre</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Descripción</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Municipalidad</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Contacto</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Estado</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                @for (asociacion of pagination.data; track asociacion.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{{ asociacion.nombre }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs transition-colors duration-300">{{ asociacion.descripcion }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900 dark:text-white transition-colors duration-300">
                        @if (asociacion.municipalidad) {
                          {{ asociacion.municipalidad.nombre }}
                        } @else {
                          <span class="text-gray-500 dark:text-gray-400 transition-colors duration-300">No disponible</span>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500 dark:text-gray-300 transition-colors duration-300">
                        @if (asociacion.telefono) {
                          <div>{{ asociacion.telefono }}</div>
                        }
                        @if (asociacion.email) {
                          <div>{{ asociacion.email }}</div>
                        }
                        @if (!asociacion.telefono && !asociacion.email) {
                          <div>Sin información</div>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      @if (asociacion.estado) {
                        <span class="inline-flex rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-200 transition-colors duration-300">
                          Activo
                        </span>
                      } @else {
                        <span class="inline-flex rounded-full bg-red-100 dark:bg-red-900 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-200 transition-colors duration-300">
                          Inactivo
                        </span>
                      }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <a
                          [routerLink]="['/admin/asociaciones/edit', asociacion.id]"
                          class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-300"
                          title="Editar"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </a>

                        <a
                          [routerLink]="['/admin/asociaciones', asociacion.id, 'emprendedores']"
                          class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-300"
                          title="Ver emprendedores"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                        </a>

                        <button
                          (click)="deleteAsociacion(asociacion)"
                          class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
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
            <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 transition-colors duration-300">
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Mostrando <span class="font-medium">{{ pagination.from || 0 }}</span> a <span class="font-medium">{{ pagination.to || 0 }}</span> de <span class="font-medium">{{ pagination.total }}</span> resultados
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      (click)="goToPage(currentPage - 1)"
                      [disabled]="!pagination.prev_page_url"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300"
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
                          class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium transition-colors duration-300"
                          [class.bg-primary-50]="link.active && !isDarkMode()"
                          [class.bg-primary-900]="link.active && isDarkMode()"
                          [class.text-primary-600]="link.active && !isDarkMode()"
                          [class.text-primary-300]="link.active && isDarkMode()"
                          [class.bg-white]="!link.active && !isDarkMode()"
                          [class.bg-gray-700]="!link.active && isDarkMode()"
                          [class.text-gray-700]="!link.active && !isDarkMode()"
                          [class.text-gray-300]="!link.active && isDarkMode()"
                          [class.hover:bg-gray-50]="!link.active && !isDarkMode()"
                          [class.hover:bg-gray-600]="!link.active && isDarkMode()"
                          [disabled]="link.active"
                        >
                          {{ link.label }}
                        </button>
                      }
                    }

                    <button
                      (click)="goToPage(currentPage + 1)"
                      [disabled]="!pagination.next_page_url"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300"
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
export class AsociacionListComponent implements OnInit {
  private turismoService = inject(TurismoService);
  private themeService = inject(ThemeService);

  pagination: PaginatedResponse<Asociacion> | null = null;
  loading = true;
  currentPage = 1;
  itemsPerPage = 10;

  ngOnInit() {
    this.loadAsociaciones();
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  loadAsociaciones() {
    this.loading = true;
    this.turismoService.getAsociaciones(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.pagination = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar asociaciones:', error);
        this.loading = false;
      }
    });
  }

  deleteAsociacion(asociacion: Asociacion) {
    if (!asociacion.id) return;

    if (confirm(`¿Está seguro de eliminar la asociación "${asociacion.nombre}"? Esta acción eliminará también todos los emprendedores relacionados y no se puede deshacer.`)) {
      this.turismoService.deleteAsociacion(asociacion.id).subscribe({
        next: () => {
          // Recargar la lista después de eliminar
          this.loadAsociaciones();
          alert('Asociación eliminada correctamente');
        },
        error: (error) => {
          console.error('Error al eliminar asociación:', error);
          alert('Error al eliminar la asociación. Por favor, intente nuevamente.');
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
    this.loadAsociaciones();
  }
}
