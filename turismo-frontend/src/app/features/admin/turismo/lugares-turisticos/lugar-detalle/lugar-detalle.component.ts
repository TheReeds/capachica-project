import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { TurismoService, LugarTuristico } from '../../../../../core/services/turismo.service';

@Component({
  selector: 'app-lugar-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Detalle del Lugar Turístico</h1>
          @if (lugar) {
            <p class="mt-1 text-sm text-gray-500">
              Ubicación: <span class="font-medium">{{ lugar.ubicacion }}</span>
            </p>
          }
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          @if (lugar) {
            <a
              [routerLink]="['/admin/lugares-turisticos/edit', lugar.id]"
              class="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-primary-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Editar
            </a>
          }
          <a
            routerLink="/admin/lugares-turisticos"
            class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver
          </a>
        </div>
      </div>

      @if (loading) {
        <div class="rounded-lg bg-white p-6 shadow-sm">
          <div class="flex justify-center items-center p-8">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
            <span class="ml-4">Cargando información del lugar turístico...</span>
          </div>
        </div>
      } @else if (!lugar) {
        <div class="rounded-lg bg-white p-6 shadow-sm">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Lugar turístico no encontrado</h3>
            <p class="mt-1 text-sm text-gray-500">
              El lugar turístico que estás buscando no existe o ha sido eliminado.
            </p>
            <div class="mt-6">
              <a
                routerLink="/admin/lugares-turisticos"
                class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Volver a la lista de lugares turísticos
              </a>
            </div>
          </div>
        </div>
      } @else {
        <!-- Información principal del lugar turístico -->
        <div class="rounded-lg bg-white p-6 shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-2">
              <h2 class="text-lg font-medium text-gray-900 mb-4">{{ lugar.nombre }}</h2>

              <div class="space-y-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Descripción</h3>
                  <p class="mt-1 text-sm text-gray-900 whitespace-pre-line">{{ lugar.descripcion }}</p>
                </div>

                <div>
                  <h3 class="text-sm font-medium text-gray-500">Ubicación</h3>
                  <p class="mt-1 text-sm text-gray-900">{{ lugar.ubicacion }}</p>
                </div>

                <div>
                  <h3 class="text-sm font-medium text-gray-500">Fecha de Creación</h3>
                  <p class="mt-1 text-sm text-gray-900">{{ formatDate(lugar.created_at) }}</p>
                </div>

                <div>
                  <h3 class="text-sm font-medium text-gray-500">Última Actualización</h3>
                  <p class="mt-1 text-sm text-gray-900">{{ formatDate(lugar.updated_at) }}</p>
                </div>
              </div>

              <!-- Acciones -->
              <div class="mt-6 flex space-x-3">
                <button
                  (click)="imprimirLugar()"
                  class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <svg class="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                  </svg>
                  Imprimir
                </button>
                <button
                  (click)="showDeleteConfirmation = true"
                  class="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <svg class="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>

            <!-- Panel lateral con la imagen -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Imagen</h3>

              @if (lugar.imagen) {
                <div class="overflow-hidden rounded-lg shadow-sm">
                  <img
                    [src]="'assets/images/lugares/' + lugar.imagen"
                    [alt]="lugar.nombre"
                    class="h-auto w-full object-cover"
                    onError="this.src='assets/images/placeholder.jpg'"
                  />
                </div>
              } @else {
                <div class="bg-gray-200 rounded-lg p-8 flex items-center justify-center">
                  <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span class="ml-2 text-sm text-gray-500">Sin imagen disponible</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Historial de cambios (opcional) -->
        <div class="rounded-lg bg-white shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Historial de Cambios</h2>
          </div>

          <div class="p-6">
            <div class="flow-root">
              <ul class="-mb-8">
                <!-- Cambio de creación (siempre existe) -->
                <li>
                  <div class="relative pb-8">
                    <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    <div class="relative flex space-x-3">
                      <div>
                        <span class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                          <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                        </span>
                      </div>
                      <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p class="text-sm text-gray-500">Lugar turístico creado</p>
                        </div>
                        <div class="text-right text-sm whitespace-nowrap text-gray-500">
                          {{ formatDate(lugar.created_at) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="relative pb-8">
                    <div class="relative flex space-x-3">
                      <div>
                        <span class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                      </div>
                      <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p class="text-sm text-gray-500">Última actualización</p>
                        </div>
                        <div class="text-right text-sm whitespace-nowrap text-gray-500">
                          {{ formatDate(lugar.updated_at) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Modal de confirmación para eliminar -->
        @if (showDeleteConfirmation) {
          <div class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="showDeleteConfirmation = false"></div>

            <div class="relative bg-white rounded-lg p-6 max-w-md w-full mx-auto shadow-xl">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">Eliminar Lugar Turístico</h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      ¿Estás seguro de que deseas eliminar este lugar turístico? Esta acción no se puede deshacer.
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  (click)="eliminarLugar()"
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                  (click)="showDeleteConfirmation = false"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class LugarDetalleComponent implements OnInit {
  private turismoService = inject(TurismoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Propiedades
  lugarId: number = 0;
  lugar: LugarTuristico | null = null;
  loading = true;

  // Estado de UI
  showDeleteConfirmation = false;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.lugarId = +idParam;
      this.cargarLugar();
    } else {
      this.loading = false;
    }
  }

  cargarLugar() {
    this.loading = true;
    this.turismoService.getLugarTuristico(this.lugarId).subscribe({
      next: (lugar) => {
        this.lugar = lugar;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar el lugar turístico:', error);
        this.loading = false;
      }
    });
  }

  eliminarLugar() {
    if (!this.lugar || !this.lugar.id) return;

    this.turismoService.deleteLugarTuristico(this.lugar.id).subscribe({
      next: () => {
        this.showDeleteConfirmation = false;
        this.router.navigate(['/admin/lugares-turisticos']);
        alert('Lugar turístico eliminado correctamente');
      },
      error: (error) => {
        console.error('Error al eliminar el lugar turístico:', error);
        this.showDeleteConfirmation = false;
        alert('Error al eliminar el lugar turístico. Por favor, intente nuevamente.');
      }
    });
  }

  imprimirLugar() {
    window.print();
  }

  // Métodos de ayuda
  formatDate(dateString?: string | null): string {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}
