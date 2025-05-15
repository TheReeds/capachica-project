/**
 * Nombre del archivo: lugar-list.component.ts
 * Ubicación del archivo: src\app\features\admin\turismo\lugares-turisticos\lugar-list
 * Descripción: Componente que muestra una lista de lugares turísticos con funcionalidad de filtrado y CRUD.
 */

// Importaciones del Framework Angular
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Importaciones de servicios del proyecto
import { TurismoService, LugarTuristico } from '../../../../../core/services/turismo.service';
import { ThemeService } from '../../../../../core/services/theme.service';

@Component({
  selector: 'app-lugar-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Lugares Turísticos</h1>
        <div class="mt-4 sm:mt-0">
          <a
            routerLink="/admin/lugares-turisticos/create"
            class="inline-flex items-center rounded-md bg-primary-600 dark:bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nuevo Lugar Turístico
          </a>
        </div>
      </div>

      <!-- Filtros -->
      <div class="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors duration-200">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Buscar</label>
            <div class="mt-1">
              <input
                type="text"
                id="search"
                [(ngModel)]="searchTerm"
                placeholder="Nombre o descripción"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              >
            </div>
          </div>

          <div>
            <label for="ubicacion" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Ubicación</label>
            <div class="mt-1">
              <select
                id="ubicacion"
                [(ngModel)]="selectedUbicacion"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              >
                <option value="">Todas</option>
                @for (ubicacion of ubicaciones; track ubicacion) {
                  <option [value]="ubicacion">{{ ubicacion }}</option>
                }
              </select>
            </div>
          </div>

          <div>
            <label for="popularidad" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Popularidad</label>
            <div class="mt-1">
              <select
                id="popularidad"
                [(ngModel)]="selectedPopularidad"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              >
                <option value="">Todos</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>

          <div class="flex items-end">
            <button
              type="button"
              (click)="applyFilters()"
              class="inline-flex items-center rounded-md bg-primary-600 dark:bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Filtrar
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla de lugares turísticos -->
      <div class="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden transition-colors duration-200">
        @if (loading) {
          <div class="flex justify-center items-center p-8">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 dark:border-primary-600 border-r-transparent"></div>
            <span class="ml-4 text-gray-900 dark:text-gray-200">Cargando lugares turísticos...</span>
          </div>
        } @else if ((lugares?.length ?? 0) === 0) {
          <div class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No se encontraron lugares turísticos</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Comience creando un nuevo lugar turístico.</p>
            <div class="mt-6">
              <a routerLink="/admin/lugares-turisticos/create" class="inline-flex items-center rounded-md bg-primary-600 dark:bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200">
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Nuevo Lugar Turístico
              </a>
            </div>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
              <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Imagen</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ubicación</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descripción</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                @for (lugar of lugares; track lugar.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
                    <td class="px-4 py-4 whitespace-nowrap">
                      <div class="h-12 w-12 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                        @if (lugar.imagen) {
                          <img
                            [src]="lugar.imagen.startsWith('http') ? lugar.imagen : '/assets/images/lugares/' + lugar.imagen"
                            alt="{{ lugar.nombre }}"
                            class="h-full w-full object-cover"
                          />
                        } @else {
                          <div class="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                        }
                      </div>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ lugar.nombre }}</div>
                      @if (lugar.popularidad) {
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          Popularidad:
                          <span
                            [class]="getPopularidadClass(lugar.popularidad)"
                          >
                            {{ lugar.popularidad | uppercase }}
                          </span>
                        </div>
                      }
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ lugar.ubicacion }}</div>
                    </td>
                    <td class="px-4 py-4">
                      <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{{ lugar.descripcion }}</div>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <a
                          [routerLink]="['/admin/lugares-turisticos/detail', lugar.id]"
                          class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200"
                          title="Ver detalles"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </a>

                        <a
                          [routerLink]="['/admin/lugares-turisticos/edit', lugar.id]"
                          class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors duration-200"
                          title="Editar"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </a>

                        <button
                          (click)="deleteLugarTuristico(lugar)"
                          class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
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
export class LugarListComponent implements OnInit {
  private turismoService = inject(TurismoService);
  private themeService = inject(ThemeService);

  // Lista completa de lugares turísticos
  lugares: LugarTuristico[] = []; // Inicializado como array vacío
  // Lista filtrada de lugares turísticos
  filteredLugares: LugarTuristico[] = [];
  loading = true;

  // Filtros
  searchTerm = '';
  selectedUbicacion = '';
  selectedPopularidad = '';
  ubicaciones: string[] = [];

  ngOnInit() {
    this.loadUbicaciones();
    this.loadLugaresTuristicos();
  }

  /**
   * Carga las ubicaciones disponibles para los filtros
   */
  loadUbicaciones() {
    this.ubicaciones = [
      'Ciudad Principal',
      'Montaña',
      'Playa',
      'Selva',
      'Valle',
      'Río'
    ];
  }

  /**
   * Carga la lista de lugares turísticos desde el servicio
   */
  loadLugaresTuristicos() {
    this.loading = true;

    this.turismoService.getLugaresTuristicos().subscribe({
      next: (lugares) => {
        this.lugares = lugares;
        this.filteredLugares = [...lugares]; // Inicializa filteredLugares con los mismos datos
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar lugares turísticos:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Aplica los filtros seleccionados a la lista de lugares
   */
  applyFilters() {
    if (this.lugares.length === 0) return;

    // Filtramos según los criterios
    let filteredData = [...this.lugares];

    // Filtro por término de búsqueda
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter(lugar =>
        lugar.nombre?.toLowerCase().includes(searchLower) ||
        lugar.descripcion?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por ubicación
    if (this.selectedUbicacion) {
      filteredData = filteredData.filter(lugar =>
        lugar.ubicacion === this.selectedUbicacion
      );
    }

    // Filtro por popularidad
    if (this.selectedPopularidad) {
      filteredData = filteredData.filter(lugar =>
        lugar.popularidad?.toLowerCase() === this.selectedPopularidad.toLowerCase()
      );
    }

    this.filteredLugares = filteredData;
  }

  /**
   * Devuelve las clases CSS según el nivel de popularidad
   * @param popularidad Nivel de popularidad (alta, media, baja)
   * @returns Clases CSS para mostrar el texto con el color adecuado
   */
  getPopularidadClass(popularidad: string): string {
    switch (popularidad.toLowerCase()) {
      case 'alta':
        return 'text-green-600 dark:text-green-400 font-semibold';
      case 'media':
        return 'text-yellow-600 dark:text-yellow-400 font-medium';
      case 'baja':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  }

  /**
   * Elimina un lugar turístico después de confirmación
   * @param lugar Lugar turístico a eliminar
   */
  deleteLugarTuristico(lugar: LugarTuristico) {
    if (!lugar.id) return;

    if (confirm(`¿Está seguro de eliminar el lugar turístico "${lugar.nombre}"? Esta acción no se puede deshacer.`)) {
      this.turismoService.deleteLugarTuristico(lugar.id).subscribe({
        next: () => {
          // Actualizamos ambas listas (completa y filtrada)
          this.lugares = this.lugares.filter(l => l.id !== lugar.id);
          this.filteredLugares = this.filteredLugares.filter(l => l.id !== lugar.id);
          alert('Lugar turístico eliminado correctamente');
        },
        error: (error) => {
          console.error('Error al eliminar lugar turístico:', error);
          alert('Error al eliminar el lugar turístico. Por favor, intente nuevamente.');
        }
      });
    }
  }

  /**
   * Verifica si el modo oscuro está activo
   * @returns true si el modo oscuro está activo, false en caso contrario
   */
  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }
}
