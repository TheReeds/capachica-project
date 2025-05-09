import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmprendimientosService, Emprendimiento } from '../../../core/services/emprendimientos.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mis-emprendimientos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <!-- Barra Superior -->
      <header class="bg-white dark:bg-gray-800 shadow">
        <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Gestión de Emprendimientos</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Administra tus negocios y servicios</p>
          </div>
          <div class="flex items-center space-x-4">
            <a routerLink="/dashboard" class="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Ir al Panel
            </a>
            <button (click)="logout()" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      
      <!-- Contenido Principal -->
      <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
              <h3 class="text-sm font-medium text-red-800 dark:text-red-300">Error al cargar tus emprendimientos</h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-400">
                <p>{{ error }}</p>
              </div>
              <div class="mt-4">
                <button (click)="loadEmprendimientos()" class="rounded-md bg-red-50 dark:bg-red-900 px-3 py-2 text-sm font-medium text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800">
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sin Emprendimientos -->
        <div *ngIf="!loading && !error && emprendimientos.length === 0" class="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No tienes emprendimientos</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No hay emprendimientos asociados a tu cuenta.</p>
        </div>
        
        <!-- Lista de Emprendimientos -->
        <div *ngIf="!loading && !error && emprendimientos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let emprendimiento of emprendimientos" class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="relative h-48 overflow-hidden">
            <ng-container *ngIf="emprendimiento.sliders_principales as sliders">
                <!-- Si hay al menos un slider y su URL existe -->
                <img 
                    *ngIf="sliders.length > 0 && sliders[0]?.url_completa" 
                    [src]="sliders[0].url_completa" 
                    [alt]="emprendimiento.nombre"
                    class="w-full h-full object-cover"
                />

                <!-- Si no hay sliders o el primero no tiene URL -->
                <div 
                    *ngIf="sliders.length === 0 || !sliders[0]?.url_completa" 
                    class="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 
                            0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                </ng-container>

              <div class="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/70 to-transparent">
                <h3 class="text-lg font-semibold text-white truncate">{{ emprendimiento.nombre }}</h3>
                <p class="text-sm text-gray-200">{{ emprendimiento.tipo_servicio }}</p>
              </div>
            </div>
            <div class="p-5">
              <div class="mb-4">
                <div class="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-sm text-gray-600 dark:text-gray-300 truncate">{{ emprendimiento.ubicacion }}</span>
                </div>
                <div class="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm text-gray-600 dark:text-gray-300 truncate">{{ emprendimiento.email }}</span>
                </div>
                <div class="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="text-sm text-gray-600 dark:text-gray-300">{{ emprendimiento.telefono }}</span>
                </div>
              </div>
              
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                  {{ emprendimiento.categoria }}
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                  {{ emprendimiento.servicios?.length || 0 }} servicios
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                     [ngClass]="emprendimiento.estado ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'">
                  {{ emprendimiento.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <a [routerLink]="['/emprendimiento', emprendimiento.id]" class="inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 dark:hover:bg-orange-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Editar
                </a>
                <a [routerLink]="['/emprendimiento', emprendimiento.id, 'servicios']" class="inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Servicios
                </a>
              </div>
              
              <div class="mt-3">
                <a [routerLink]="['/emprendimiento', emprendimiento.id, 'administradores']" class="inline-flex w-full justify-center items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Administradores ({{ emprendimiento.administradores?.length || 0 }})
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class MisEmprendimientosComponent implements OnInit {
  private emprendimientosService = inject(EmprendimientosService);
  private authService = inject(AuthService);
  
  emprendimientos: Emprendimiento[] = [];
  loading = true;
  error = '';
  
  ngOnInit(): void {
    this.loadEmprendimientos();
  }
  
  loadEmprendimientos(): void {
    this.loading = true;
    this.error = '';
    
    this.emprendimientosService.getMisEmprendimientos().subscribe({
      next: (data) => {
        this.emprendimientos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar emprendimientos:', err);
        this.error = err.error?.message || 'Error al cargar los emprendimientos. Inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }
  
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // La redirección la maneja el servicio de auth
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
      }
    });
  }
}