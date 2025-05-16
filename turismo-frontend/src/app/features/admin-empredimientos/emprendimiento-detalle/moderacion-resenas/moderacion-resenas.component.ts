import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmprendimientosService, Resena } from '../../../../core/services/emprendimientos.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-moderacion-resenas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="flex flex-col space-y-4">
          <!-- Título y Filtros -->
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Moderación de Reseñas</h2>
            <div class="flex space-x-4">
              <select [(ngModel)]="filtroEstado" (change)="aplicarFiltros()"
                      class="w-40 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200">
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="aprobado">Aprobados</option>
                <option value="rechazado">Rechazados</option>
              </select>
              <input type="text" [(ngModel)]="filtroBusqueda" (input)="aplicarFiltros()"
                    placeholder="Buscar por autor o comentario..."
                    class="w-64 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200">
            </div>
          </div>

          <!-- Botón Volver -->
          <div class="flex items-center">
            <a (click)="volver()"
              class="flex items-center px-4 py-2 bg-orange-50 dark:bg-gray-700 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-gray-600 border border-orange-300 dark:border-orange-500 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Volver
            </a>
          </div>
      </div>

      <!-- Estado de Carga -->
      <div *ngIf="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-300">{{ error }}</h3>
          </div>
        </div>
      </div>

      <!-- Lista de Reseñas -->
      <div *ngIf="!loading && !error" class="space-y-4">
        <div *ngFor="let resena of resenasFiltradas" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ resena.nombre_autor }}</h3>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': resena.estado === 'pendiente',
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': resena.estado === 'aprobado',
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': resena.estado === 'rechazado'
                      }">
                  {{ resena.estado | titlecase }}
                </span>
              </div>

              <!-- Estrellas -->
              <div class="flex items-center mt-1">
                <div class="flex items-center">
                  <ng-container *ngFor="let star of [1,2,3,4,5]">
                    <svg class="w-5 h-5" [class.text-yellow-400]="star <= resena.puntuacion"
                         [class.text-gray-300]="star > resena.puntuacion"
                         fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </ng-container>
                </div>
                <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {{ resena.created_at | date:'medium' }}
                </span>
              </div>

              <p class="mt-2 text-gray-600 dark:text-gray-300">{{ resena.comentario }}</p>

              <!-- Imágenes -->
              <div *ngIf="resena.imagenes?.length" class="mt-3 flex space-x-2">
                <div *ngFor="let imagen of resena.imagenes" class="relative">
                  <img [src]="imagen" [alt]="'Imagen de reseña'"
                       class="h-20 w-20 object-cover rounded-lg cursor-pointer"
                       (click)="mostrarImagen(imagen)">
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="flex space-x-2">
              <button *ngIf="resena.estado !== 'aprobado'"
                      (click)="cambiarEstado(resena, 'aprobado')"
                      class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Aprobar
              </button>

              <button *ngIf="resena.estado !== 'rechazado'"
                      (click)="cambiarEstado(resena, 'rechazado')"
                      class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Rechazar
              </button>

              <button (click)="eliminarResena(resena)"
                      class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Sin reseñas -->
        <div *ngIf="resenasFiltradas.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay reseñas</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No se encontraron reseñas que coincidan con los filtros seleccionados.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ModeracionResenasComponent implements OnInit {
  private emprendimientosService = inject(EmprendimientosService);
  private route = inject(ActivatedRoute);

  emprendedorId: number = 0;
  resenas: Resena[] = [];
  resenasFiltradas: Resena[] = [];
  loading = true;
  error = '';

  filtroEstado = '';
  filtroBusqueda = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.emprendedorId = +params['id'];
      this.cargarResenas();
    });
  }

  cargarResenas(): void {
    this.loading = true;
    this.error = '';

    this.emprendimientosService.getResenas(this.emprendedorId).subscribe({
      next: (data) => {
        this.resenas = data;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar reseñas:', err);
        this.error = err.error?.message || 'Error al cargar las reseñas. Inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.resenasFiltradas = this.resenas.filter(resena => {
      const cumpleEstado = !this.filtroEstado || resena.estado === this.filtroEstado;
      const cumpleBusqueda = !this.filtroBusqueda ||
        resena.nombre_autor.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        resena.comentario.toLowerCase().includes(this.filtroBusqueda.toLowerCase());

      return cumpleEstado && cumpleBusqueda;
    });
  }

  cambiarEstado(resena: Resena, nuevoEstado: string): void {
    this.emprendimientosService.updateResenaEstado(this.emprendedorId, resena.id, nuevoEstado).subscribe({
      next: (data) => {
        const index = this.resenas.findIndex(r => r.id === resena.id);
        if (index !== -1) {
          this.resenas[index] = data;
          this.aplicarFiltros();
        }
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        alert(err.error?.message || 'Error al actualizar el estado de la reseña.');
      }
    });
  }

  eliminarResena(resena: Resena): void {
    if (!confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      return;
    }

    this.emprendimientosService.deleteResena(this.emprendedorId, resena.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.resenas = this.resenas.filter(r => r.id !== resena.id);
          this.aplicarFiltros();
          alert('Reseña eliminada correctamente');
        } else {
          alert(response.message || 'Error al eliminar la reseña');
        }
      },
      error: (err) => {
        console.error('Error al eliminar reseña:', err);
        alert(err.error?.message || 'Error al eliminar la reseña. Por favor, inténtalo de nuevo.');
      }
    });
  }

  mostrarImagen(url: string): void {
    // Implementar visualización de imagen en tamaño completo
    window.open(url, '_blank');
  }

  constructor(private location: Location) {}

  volver() {
    console.log('Volviendo a la página anterior');
    this.location.back();
  }

}
