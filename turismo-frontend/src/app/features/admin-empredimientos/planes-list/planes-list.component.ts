import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmprendimientoAdminService } from '../../../core/services/emprendimiento-admin.service';
import { 
  Emprendimiento, 
  Plan,
  MetaEmprendedorResponse,
  ResumenPlanes,
  EstadisticasPlan
} from '../../../core/models/emprendimiento-admin.model';

@Component({
  selector: 'app-planes-list',
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
                      <a [routerLink]="['/admin-emprendedores/emprendimiento', emprendimientoId, 'dashboard']" 
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
                      <span class="ml-1 text-gray-500 dark:text-gray-400">Planes</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                Planes - {{ emprendimiento?.nombre || 'Cargando...' }}
              </h1>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                Administra los planes turísticos en los que participas
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <button (click)="refreshData()" 
                      [disabled]="loading"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50">
                <svg *ngIf="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <div *ngIf="loading" class="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Summary Dashboard -->
      <div *ngIf="resumenPlanes" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <!-- Total Planes -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Total Planes</h3>
                <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ resumenPlanes.total_planes_participando }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ resumenPlanes.planes_activos_participando }} activos</p>
              </div>
            </div>
          </div>

          <!-- Planes Organizando -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Organizando</h3>
                <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ resumenPlanes.planes_organizando }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ resumenPlanes.planes_activos_organizando }} activos</p>
              </div>
            </div>
          </div>

          <!-- Planes Colaborando -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Colaborando</h3>
                <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ resumenPlanes.planes_colaborando }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ resumenPlanes.planes_activos_colaborando }} activos</p>
              </div>
            </div>
          </div>

          <!-- Ingresos Estimados -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Ingresos Estimados</h3>
                <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">S/. {{ resumenPlanes.ingresos_estimados_total | number:'1.2-2' }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ resumenPlanes.inscripciones_confirmadas }} inscripciones</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Tipo de Rol Filter -->
            <div>
              <label for="tipo_rol" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mi Rol
              </label>
              <select
                id="tipo_rol"
                [(ngModel)]="filters.tipo_rol"
                (change)="applyFilters()"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white">
                <option value="">Todos</option>
                <option value="organizador">Organizador</option>
                <option value="colaborador">Colaborador</option>
              </select>
            </div>

            <!-- Solo Activos Filter -->
            <div class="flex items-center mt-6">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="filters.solo_activos"
                  (change)="applyFilters()"
                  class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Solo planes activos
                </span>
              </label>
            </div>

            <!-- Search -->
            <div>
              <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar planes
              </label>
              <input
                type="text"
                id="search"
                [(ngModel)]="searchTerm"
                (input)="onSearchChange()"
                placeholder="Nombre del plan..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white">
            </div>

            <!-- Clear Filters -->
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

      <!-- Loading State -->
      <div *ngIf="loading && !planes.length" class="flex justify-center items-center py-20">
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
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error al cargar los planes</h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">{{ error }}</div>
              <div class="mt-4">
                <button (click)="loadPlanes()" 
                        class="bg-red-100 dark:bg-red-800 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700">
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !error && planes.length === 0" 
           class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="mt-6 text-xl font-medium text-gray-900 dark:text-white">No hay planes</h3>
          <p class="mt-2 text-gray-500 dark:text-gray-400">
            {{ hasActiveFilters() ? 'No se encontraron planes con los filtros aplicados.' : 'Aún no participas en ningún plan turístico.' }}
          </p>
          <div *ngIf="hasActiveFilters()" class="mt-6">
            <button (click)="clearFilters()"
                    class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Planes Grid -->
      <div *ngIf="!loading && !error && planes.length > 0" 
           class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let plan of planes; trackBy: trackByPlan" 
               class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-200">
            
            <!-- Plan Image -->
            <div class="relative h-48">
              <ng-container *ngIf="plan.imagen_principal_url; else noImageTemplate">
                <img [src]="plan.imagen_principal_url" 
                     [alt]="plan.nombre" 
                     class="w-full h-full object-cover">
              </ng-container>
              <ng-template #noImageTemplate>
                <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </ng-template>
              
              <!-- Status Badges -->
              <div class="absolute top-4 right-4 flex flex-col space-y-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="{
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': plan.estado === 'activo',
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': plan.estado === 'inactivo',
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400': plan.estado === 'borrador'
                      }">
                  {{ plan.estado | titlecase }}
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="{
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400': plan.mi_rol?.rol === 'organizador',
                        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400': plan.mi_rol?.rol === 'colaborador'
                      }">
                  {{ plan.mi_rol?.rol | titlecase }}
                </span>
                <span *ngIf="plan.mi_rol?.es_organizador_principal" 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  Principal
                </span>
              </div>

              <!-- Difficulty Badge -->
              <div class="absolute top-4 left-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="{
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': plan.dificultad === 'facil',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': plan.dificultad === 'moderado',
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': plan.dificultad === 'dificil'
                      }">
                  {{ getDificultadLabel(plan.dificultad) }}
                </span>
              </div>
            </div>

            <!-- Plan Content -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {{ plan.nombre }}
                </h3>
              </div>
              
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {{ plan.descripcion }}
              </p>

              <!-- Plan Details -->
              <div class="space-y-3 mb-4">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-400">Duración:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ plan.duracion_dias }} día{{ plan.duracion_dias > 1 ? 's' : '' }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-400">Capacidad:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ plan.capacidad }} personas</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-400">Disponibles:</span>
                  <span class="font-medium" 
                        [ngClass]="{
                          'text-green-600 dark:text-green-400': plan.cupos_disponibles && plan.cupos_disponibles > 5,
                          'text-yellow-600 dark:text-yellow-400': plan.cupos_disponibles && plan.cupos_disponibles <= 5 && plan.cupos_disponibles > 0,
                          'text-red-600 dark:text-red-400': plan.cupos_disponibles === 0
                        }">
                    {{ plan.cupos_disponibles || 0 }} cupos
                  </span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-400">Precio:</span>
                  <span class="font-bold text-green-600 dark:text-green-400">S/. {{ plan.precio_total | number:'1.2-2' }}</span>
                </div>
              </div>

              <!-- My Participation Info -->
              <div *ngIf="plan.mi_rol" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Mi Participación</h4>
                <div class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <p><strong>Rol:</strong> {{ plan.mi_rol.rol | titlecase }}</p>
                  <p *ngIf="plan.mi_rol.descripcion_participacion"><strong>Descripción:</strong> {{ plan.mi_rol.descripcion_participacion }}</p>
                  <p><strong>% Ganancia:</strong> {{ plan.mi_rol.porcentaje_ganancia }}%</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-2">
                <button (click)="viewPlanDetails(plan)" 
                        class="w-full bg-orange-600 text-white text-center py-2 px-4 rounded-md hover:bg-orange-700 transition-colors text-sm font-medium">
                  Ver Detalles
                </button>
                
                <div class="grid grid-cols-2 gap-2">
                  <button (click)="viewInscripciones(plan)" 
                          class="bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                    Inscripciones
                  </button>
                  <button (click)="viewEstadisticas(plan)" 
                          class="bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
                    Estadísticas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div *ngIf="meta && meta.total > 0" class="mt-8 flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando {{ (currentPage - 1) * 10 + 1 }} a {{ Math.min(currentPage * 10, meta.total) }} de {{ meta.total }} planes
          </div>
          <div class="flex items-center space-x-2">
            <button
              (click)="loadPage(currentPage - 1)"
              [disabled]="currentPage <= 1 || loading"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
              Anterior
            </button>
            
            <span class="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Página {{ currentPage }}
            </span>
            
            <button
              (click)="loadPage(currentPage + 1)"
              [disabled]="!hasNextPage() || loading"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <!-- Plan Details Modal (Simple version - could be expanded) -->
      <div *ngIf="selectedPlan" 
           class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
           (click)="closeModal()">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800"
             (click)="$event.stopPropagation()">
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedPlan.nombre }}</h3>
              <button (click)="closeModal()" 
                      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">Descripción</h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ selectedPlan.descripcion }}</p>
              </div>
              
              <div *ngIf="selectedPlan.que_incluye">
                <h4 class="font-medium text-gray-900 dark:text-white">Qué incluye</h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ selectedPlan.que_incluye }}</p>
              </div>
              
              <div *ngIf="selectedPlan.requerimientos">
                <h4 class="font-medium text-gray-900 dark:text-white">Requerimientos</h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ selectedPlan.requerimientos }}</p>
              </div>
              
              <div *ngIf="selectedPlan.que_llevar">
                <h4 class="font-medium text-gray-900 dark:text-white">Qué llevar</h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ selectedPlan.que_llevar }}</p>
              </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button (click)="closeModal()" 
                      class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500">
                Cerrar
              </button>
            </div>
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
export class PlanesListComponent implements OnInit {
  private emprendimientoAdminService = inject(EmprendimientoAdminService);
  private route = inject(ActivatedRoute);

  emprendimientoId!: number;
  emprendimiento?: Emprendimiento;
  planes: Plan[] = [];
  meta?: MetaEmprendedorResponse;
  resumenPlanes?: ResumenPlanes;
  selectedPlan?: Plan;
  
  loading = true;
  error = '';
  currentPage = 1;
  searchTerm = '';
  searchTimeout?: any;

  filters = {
    solo_activos: true,
    tipo_rol: '' as 'organizador' | 'colaborador' | ''
  };

  // Expose Math to template
  Math = Math;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.emprendimientoId = +params['id'];
      this.loadData();
    });
  }

  private loadData(): void {
    this.loadEmprendimiento();
    this.loadPlanes();
    this.loadResumen();
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

  loadPlanes(page: number = 1): void {
    this.loading = true;
    this.error = '';
    this.currentPage = page;

    const params = {
      solo_activos: this.filters.solo_activos,
      tipo_rol: this.filters.tipo_rol || undefined,
      page: page
    };

    this.emprendimientoAdminService.getPlanesPorEmprendedor(this.emprendimientoId, params).subscribe({
      next: (data) => {
        this.planes = data.data;
        this.meta = data.meta;
        this.loading = false;
        
        // If search term is active, filter locally
        if (this.searchTerm.trim()) {
          this.filterBySearch();
        }
      },
      error: (err) => {
        console.error('Error al cargar planes:', err);
        this.error = err.error?.message || 'Error al cargar los planes';
        this.loading = false;
      }
    });
  }

  private loadResumen(): void {
    this.emprendimientoAdminService.getResumenPlanes(this.emprendimientoId).subscribe({
      next: (data) => {
        this.resumenPlanes = data;
      },
      error: (err) => {
        console.error('Error al cargar resumen de planes:', err);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadPlanes(1);
  }

  clearFilters(): void {
    this.filters = {
      solo_activos: true,
      tipo_rol: ''
    };
    this.searchTerm = '';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.tipo_rol || !this.filters.solo_activos || this.searchTerm.trim());
  }

  onSearchChange(): void {
    // Debounce search
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    this.searchTimeout = setTimeout(() => {
      this.filterBySearch();
    }, 300);
  }

  private filterBySearch(): void {
    if (!this.searchTerm.trim()) {
      return;
    }

    this.emprendimientoAdminService.searchPlanes(this.emprendimientoId, this.searchTerm).subscribe({
      next: (data) => {
        this.planes = data;
      },
      error: (err) => {
        console.error('Error en búsqueda:', err);
      }
    });
  }

  refreshData(): void {
    this.loadPlanes(this.currentPage);
    this.loadResumen();
  }

  loadPage(page: number): void {
    if (page >= 1) {
      this.loadPlanes(page);
    }
  }

  hasNextPage(): boolean {
    if (!this.meta) return false;
    return this.currentPage * 10 < this.meta.total;
  }

  getDificultadLabel(dificultad: string): string {
    const labels = {
      'facil': 'Fácil',
      'moderado': 'Moderado',
      'dificil': 'Difícil'
    };
    return labels[dificultad as keyof typeof labels] || dificultad;
  }

  viewPlanDetails(plan: Plan): void {
    this.selectedPlan = plan;
  }

  closeModal(): void {
    this.selectedPlan = undefined;
  }

  viewInscripciones(plan: Plan): void {
    // Navigate to inscripciones component (would need to be implemented)
    console.log('Ver inscripciones para plan:', plan.id);
    alert('Funcionalidad de inscripciones en desarrollo');
  }

  viewEstadisticas(plan: Plan): void {
    // Load and show statistics
    this.emprendimientoAdminService.getEstadisticasPlan(this.emprendimientoId, plan.id).subscribe({
      next: (stats) => {
        const message = `Estadísticas del Plan "${plan.nombre}":
        
Total Inscripciones: ${stats.total_inscripciones}
Confirmadas: ${stats.inscripciones_confirmadas}
Pendientes: ${stats.inscripciones_pendientes}
Canceladas: ${stats.inscripciones_canceladas}

Total Participantes: ${stats.total_participantes}
Ingresos Totales: S/. ${stats.ingresos_totales}
% Ocupación: ${stats.porcentaje_ocupacion}%

Mi Rol: ${stats.mi_participacion.rol}`;
        
        alert(message);
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
        alert('Error al cargar las estadísticas del plan');
      }
    });
  }

  // Track by function for performance
  trackByPlan(index: number, plan: Plan): number {
    return plan.id;
  }
}