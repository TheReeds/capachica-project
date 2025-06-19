import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmprendimientoAdminService } from '../../../core/services/emprendimiento-admin.service';
import { 
  Emprendimiento, 
  Reserva, 
  PaginatedResponse,
  UpdateEstadoServicioRequest,
  ReservaServicio
} from '../../../core/models/emprendimiento-admin.model';

// Extendemos ReservaServicio para incluir la propiedad updating
interface ReservaServicioWithUpdating extends ReservaServicio {
  updating?: boolean;
}

// Extendemos Reserva para usar el ReservaServicio con updating
interface ReservaWithUpdating extends Omit<Reserva, 'servicios'> {
  servicios: ReservaServicioWithUpdating[];
}

@Component({
  selector: 'app-reservas-list',
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
                        <span class="ml-1 text-gray-500 dark:text-gray-400">Reservas</span>
                        </div>
                    </li>
                    </ol>
                </nav>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                    Reservas - {{ emprendimiento?.nombre || 'Cargando...' }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                    Administra todas las reservas de tus servicios
                </p>
                </div>
                <div class="flex items-center space-x-4">
                <button (click)="exportToCSV()" 
                        [disabled]="loading || !reservasData?.data?.length"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Exportar CSV
                </button>
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

        <!-- Filters -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Estado Filter -->
                <div>
                <label for="estado" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado
                </label>
                <select
                    id="estado"
                    [(ngModel)]="filters.estado"
                    (change)="applyFilters()"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white">
                    <option value="">Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="cancelada">Cancelada</option>
                    <option value="completada">Completada</option>
                </select>
                </div>

                <!-- Fecha Inicio -->
                <div>
                <label for="fecha_inicio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha Desde
                </label>
                <input
                    type="date"
                    id="fecha_inicio"
                    [(ngModel)]="filters.fecha_inicio"
                    (change)="applyFilters()"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white">
                </div>

                <!-- Fecha Fin -->
                <div>
                <label for="fecha_fin" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha Hasta
                </label>
                <input
                    type="date"
                    id="fecha_fin"
                    [(ngModel)]="filters.fecha_fin"
                    (change)="applyFilters()"
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
        <div *ngIf="loading && !reservasData" class="flex justify-center items-center py-20">
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
                <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error al cargar las reservas</h3>
                <div class="mt-2 text-sm text-red-700 dark:text-red-300">{{ error }}</div>
                <div class="mt-4">
                    <button (click)="loadReservas()" 
                            class="bg-red-100 dark:bg-red-800 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700">
                    Reintentar
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && !error && (!reservasData?.data || reservasData?.data?.length === 0)" 
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center">
            <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="mt-6 text-xl font-medium text-gray-900 dark:text-white">No hay reservas</h3>
            <p class="mt-2 text-gray-500 dark:text-gray-400">
                {{ hasActiveFilters() ? 'No se encontraron reservas con los filtros aplicados.' : 'Aún no tienes reservas para este emprendimiento.' }}
            </p>
            <div *ngIf="hasActiveFilters()" class="mt-6">
                <button (click)="clearFilters()"
                        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                Limpiar filtros
                </button>
            </div>
            </div>
        </div>

        <!-- Reservas List -->
        <div *ngIf="!loading && !error && reservasData?.data?.length"
                class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">


            
            <!-- Summary Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    </div>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ reservasData?.total }}</p>
                </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    </div>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Pendientes</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ getReservasByEstado('pendiente').length }}</p>
                </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    </div>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Confirmadas</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ getReservasByEstado('confirmada').length }}</p>
                </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    </div>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Ingresos Total</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">S/. {{ calculateTotalIngresos() | number:'1.2-2' }}</p>
                </div>
                </div>
            </div>
            </div>

            <!-- Reservas Cards -->
            <div class="space-y-6">
            <div *ngFor="let reserva of reservasData?.data; trackBy: trackByReserva" 
                class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                
                <!-- Reserva Header -->
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ reserva.usuario.name || 'Usuario' }}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Código: {{ reserva.codigo_reserva }}</p>
                    </div>
                    </div>
                    <div class="flex items-center space-x-3">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                            [ngClass]="getEstadoBadgeClass(reserva.estado)">
                        {{ reserva.estado | titlecase }}
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                        {{ reserva.created_at | date:'short' }}
                    </span>
                    </div>
                </div>
                </div>

                <!-- Servicios de la Reserva -->
                <div class="p-6">
                <div *ngIf="reserva.servicios && reserva.servicios.length > 0" class="space-y-4">
                    <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Servicios Reservados ({{ reserva.servicios.length }})
                    </h4>
                    
                    <div *ngFor="let servicioReserva of reserva.servicios; trackBy: trackByServicioReserva" 
                        class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                        <div class="flex items-center justify-between mb-2">
                            <h5 class="font-medium text-gray-900 dark:text-white">
                            {{ servicioReserva.servicio?.nombre || 'Servicio' }}
                            </h5>
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                [ngClass]="getEstadoBadgeClass(servicioReserva.estado)">
                            {{ servicioReserva.estado | titlecase }}
                            </span>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                            <span class="text-gray-500 dark:text-gray-400">Fecha:</span>
                            <p class="font-medium text-gray-900 dark:text-white">
                                {{ servicioReserva.fecha_inicio | date:'mediumDate' }}
                            </p>
                            </div>
                            <div>
                            <span class="text-gray-500 dark:text-gray-400">Horario:</span>
                            <p class="font-medium text-gray-900 dark:text-white">
                                {{ servicioReserva.hora_inicio }} - {{ servicioReserva.hora_fin }}
                            </p>
                            </div>
                            <div>
                            <span class="text-gray-500 dark:text-gray-400">Precio:</span>
                            <p class="font-medium text-green-600 dark:text-green-400">
                                S/. {{ servicioReserva.precio | number:'1.2-2' }}
                            </p>
                            </div>
                        </div>

                        <div *ngIf="servicioReserva.notas_cliente" class="mt-3">
                            <span class="text-gray-500 dark:text-gray-400 text-sm">Notas del cliente:</span>
                            <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">{{ servicioReserva.notas_cliente }}</p>
                        </div>

                        <div *ngIf="servicioReserva.notas_emprendedor" class="mt-3">
                            <span class="text-gray-500 dark:text-gray-400 text-sm">Notas del emprendedor:</span>
                            <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">{{ servicioReserva.notas_emprendedor }}</p>
                        </div>
                        </div>

                        <!-- Actions for Service -->
                        <div class="ml-4 flex flex-col space-y-2">
                        <button *ngIf="servicioReserva.estado === 'pendiente'"
                                (click)="updateEstadoServicio(servicioReserva, 'confirmado')"
                                [disabled]="servicioReserva.updating"
                                class="px-3 py-1 text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50">
                            <span *ngIf="!servicioReserva.updating">Confirmar</span>
                            <span *ngIf="servicioReserva.updating">...</span>
                        </button>
                        
                        <button *ngIf="servicioReserva.estado === 'confirmado'"
                                (click)="updateEstadoServicio(servicioReserva, 'completado')"
                                [disabled]="servicioReserva.updating"
                                class="px-3 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                            <span *ngIf="!servicioReserva.updating">Completar</span>
                            <span *ngIf="servicioReserva.updating">...</span>
                        </button>
                        
                        <button *ngIf="servicioReserva.estado === 'pendiente' || servicioReserva.estado === 'confirmado'"
                                (click)="updateEstadoServicio(servicioReserva, 'cancelado')"
                                [disabled]="servicioReserva.updating"
                                class="px-3 py-1 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50">
                            <span *ngIf="!servicioReserva.updating">Cancelar</span>
                            <span *ngIf="servicioReserva.updating">...</span>
                        </button>
                        </div>
                    </div>
                    </div>
                </div>

                <!-- Reserva Notes -->
                <div *ngIf="reserva.notas" class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <span class="text-gray-500 dark:text-gray-400 text-sm">Notas de la reserva:</span>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">{{ reserva.notas }}</p>
                </div>
                </div>
            </div>
            </div>

            <!-- Pagination -->
            <div *ngIf="reservasData && reservasData.last_page > 1" class="mt-8 flex items-center justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-300">
                Mostrando {{ reservasData.from }} a {{ reservasData.to }} de {{ reservasData.total }} reservas
            </div>
            <div class="flex items-center space-x-2">
                <button
                (click)="loadPage(currentPage - 1)"
                [disabled]="currentPage <= 1 || loading"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                Anterior
                </button>
                
                <span class="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Página {{ currentPage }} de {{ reservasData.last_page }}
                </span>
                
                <button
                (click)="loadPage(currentPage + 1)"
                [disabled]="currentPage >= (reservasData.last_page || 1) || loading"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                Siguiente
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
  `]
})
export class ReservasListComponent implements OnInit {
  private emprendimientoAdminService = inject(EmprendimientoAdminService);
  private route = inject(ActivatedRoute);

  emprendimientoId!: number;
  emprendimiento?: Emprendimiento;
  reservasData?: PaginatedResponse<ReservaWithUpdating>;
  loading = true;
  error = '';
  currentPage = 1;

  filters = {
    estado: '',
    fecha_inicio: '',
    fecha_fin: '',
    servicio_id: undefined as number | undefined,
    usuario_id: undefined as number | undefined
  };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.emprendimientoId = +params['id'];
      this.loadData();
    });
  }

  private loadData(): void {
    this.loadEmprendimiento();
    this.loadReservas();
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

  loadReservas(page: number = 1): void {
    this.loading = true;
    this.error = '';
    this.currentPage = page;

    const filters = this.getActiveFilters();
    filters.page = page;

    this.emprendimientoAdminService.filterReservas(this.emprendimientoId, filters).subscribe({
      next: (data) => {
        // Transformar los datos para incluir la propiedad updating
        this.reservasData = {
          ...data,
          data: data.data.map(reserva => ({
            ...reserva,
            servicios: reserva.servicios.map(servicio => ({
              ...servicio,
              updating: false
            }))
          }))
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.error = err.error?.message || 'Error al cargar las reservas';
        this.loading = false;
      }
    });
  }

  private getActiveFilters(): any {
    const activeFilters: any = {};
    
    if (this.filters.estado) activeFilters.estado = this.filters.estado;
    if (this.filters.fecha_inicio) activeFilters.fecha_inicio = this.filters.fecha_inicio;
    if (this.filters.fecha_fin) activeFilters.fecha_fin = this.filters.fecha_fin;
    if (this.filters.servicio_id) activeFilters.servicio_id = this.filters.servicio_id;
    if (this.filters.usuario_id) activeFilters.usuario_id = this.filters.usuario_id;

    return activeFilters;
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadReservas(1);
  }

  clearFilters(): void {
    this.filters = {
      estado: '',
      fecha_inicio: '',
      fecha_fin: '',
      servicio_id: undefined,
      usuario_id: undefined
    };
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.estado || this.filters.fecha_inicio || this.filters.fecha_fin || 
              this.filters.servicio_id || this.filters.usuario_id);
  }

  refreshData(): void {
    this.loadReservas(this.currentPage);
  }

  loadPage(page: number): void {
    if (page >= 1 && page <= (this.reservasData?.last_page || 1)) {
      this.loadReservas(page);
    }
  }

  getEstadoBadgeClass(estado: string): string {
    const classes = {
      'pendiente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'confirmada': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'confirmado': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'cancelada': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'completada': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'completado': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }

  getReservasByEstado(estado: string): ReservaWithUpdating[] {
    if (!this.reservasData?.data) return [];
    return this.reservasData.data.filter(reserva => reserva.estado === estado);
  }

  calculateTotalIngresos(): number {
    if (!this.reservasData?.data) return 0;
    
    return this.reservasData.data.reduce((total, reserva) => {
      if (reserva.estado === 'confirmada' || reserva.estado === 'completada') {
        const reservaTotal = reserva.servicios?.reduce((servicioTotal, servicio) => {
          return servicioTotal + (parseFloat(servicio.precio.toString()) || 0);
        }, 0) || 0;
        return total + reservaTotal;
      }
      return total;
    }, 0);
  }

  async updateEstadoServicio(servicioReserva: ReservaServicioWithUpdating, nuevoEstado: string): Promise<void> {
    if (servicioReserva.updating) return;

    const confirmMessage = `¿Estás seguro de que quieres ${nuevoEstado === 'confirmado' ? 'confirmar' : 
                            nuevoEstado === 'completado' ? 'completar' : 'cancelar'} este servicio?`;
    
    if (!confirm(confirmMessage)) return;

    servicioReserva.updating = true;

    try {
      const updateData: UpdateEstadoServicioRequest = {
        estado: nuevoEstado as any
      };

      await this.emprendimientoAdminService.updateEstadoServicioReserva(
        servicioReserva.id, 
        updateData
      ).toPromise();

      // Update local state
      servicioReserva.estado = nuevoEstado as any;
      
      // Show success message
      const actionText = nuevoEstado === 'confirmado' ? 'confirmado' : 
                        nuevoEstado === 'completado' ? 'completado' : 'cancelado';
      alert(`Servicio ${actionText} correctamente`);
      
    } catch (err: any) {
      console.error('Error al actualizar estado del servicio:', err);
      alert(err.error?.message || 'Error al actualizar el estado del servicio');
    } finally {
      servicioReserva.updating = false;
    }
  }

  async exportToCSV(): Promise<void> {
    if (!this.reservasData?.data?.length) return;

    try {
      const filters = this.getActiveFilters();
      const blob = await this.emprendimientoAdminService.exportReservasCSV(
        this.emprendimientoId, 
        filters
      ).toPromise();

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reservas-${this.emprendimiento?.nombre}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      console.error('Error al exportar CSV:', err);
      alert('Error al exportar los datos');
    }
  }

  // Track by functions for performance
  trackByReserva(index: number, reserva: ReservaWithUpdating): number {
    return reserva.id;
  }

  trackByServicioReserva(index: number, servicio: ReservaServicioWithUpdating): number {
    return servicio.id;
  }
}