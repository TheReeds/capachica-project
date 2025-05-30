import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxChartsModule} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-reporte-asociaciones',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
      <!-- Header Mejorado -->
      <div class="mb-8 bg-white rounded-2xl shadow-lg p-8">
        <div class="flex items-center justify-between">
          <div>
            <h1
              class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Dashboard de Asociaciones
            </h1>
            <p class="text-xl text-gray-600 font-medium">
              Red de Turismo Comunitario
            </p>
            <p class="text-gray-500 mt-2">
              Análisis integral de asociaciones turísticas comunitarias en la región
            </p>
          </div>
          <div class="hidden lg:block">
            <div
              class="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Métricas principales con diseño moderno -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Asociaciones -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Total Asociaciones</p>
              <p class="text-3xl font-bold text-gray-900">{{ metrics.total }}</p>
              <div class="flex items-center mt-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-indigo-500 h-2 rounded-full" style="width: 100%"></div>
                </div>
              </div>
            </div>
            <div class="p-3 bg-indigo-100 rounded-xl">
              <svg class="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Asociaciones Activas -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Asociaciones Activas</p>
              <p class="text-3xl font-bold text-green-600">{{ metrics.activas }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ (metrics.activas / metrics.total * 100).toFixed(1) }}% del
                total</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div class="bg-green-500 h-2 rounded-full transition-all duration-500"
                     [style.width.%]="(metrics.activas / metrics.total * 100)"></div>
              </div>
            </div>
            <div class="p-3 bg-green-100 rounded-xl">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Emprendedores -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Total Emprendedores</p>
              <p class="text-3xl font-bold text-yellow-600">{{ metrics.totalEmprendedores }}</p>
              <p class="text-xs text-gray-500 mt-1">Promedio: {{ metrics.promedioEmprendedores }} por asociación</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div class="bg-yellow-500 h-2 rounded-full transition-all duration-500" style="width: 85%"></div>
              </div>
            </div>
            <div class="p-3 bg-yellow-100 rounded-xl">
              <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Servicios -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Total Servicios</p>
              <p class="text-3xl font-bold text-purple-600">{{ metrics.totalServicios }}</p>
              <p class="text-xs text-gray-500 mt-1">Promedio: {{ metrics.promedioServicios }} por asociación</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div class="bg-purple-500 h-2 rounded-full transition-all duration-500" style="width: 75%"></div>
              </div>
            </div>
            <div class="p-3 bg-purple-100 rounded-xl">
              <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Métricas secundarias mejoradas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Reservas Totales -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium mb-1">Reservas Totales</p>
              <p class="text-4xl font-bold">{{ metrics.totalReservas }}</p>
              <p class="text-blue-100 text-xs mt-1">Todas las asociaciones</p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Municipalidades -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium mb-1">Municipalidades</p>
              <p class="text-4xl font-bold">{{ municipalidadData.length }}</p>
              <p class="text-green-100 text-xs mt-1">Con asociaciones activas</p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Promedio Calificación -->
        <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-indigo-100 text-sm font-medium mb-1">Calificación Promedio</p>
              <p class="text-4xl font-bold">{{ metrics.calificacionPromedio }}</p>
              <p class="text-indigo-100 text-xs mt-1">Basado en reseñas</p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos principales mejorados -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Gráfico de Radar - Comparación de Asociaciones -->
        <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Comparación de Asociaciones</h3>
            <div class="p-2 bg-indigo-100 rounded-lg">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <div class="h-80">
            <ngx-charts-line-chart
              [view]="[400, 300]"
              [results]="radarData"
              [xAxis]="true"
              [yAxis]="true"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxisLabel]="'Métricas'"
              [yAxisLabel]="'Valores'"
              [timeline]="false"
              [legend]="true"
              [gradient]="true">
            </ngx-charts-line-chart>
          </div>
        </div>

        <!-- Distribución por Municipalidad -->
        <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Asociaciones por Municipalidad</h3>
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              </svg>
            </div>
          </div>
          <div class="h-80">
            <ngx-charts-bar-vertical
              [view]="[400, 300]"
              [results]="municipalidadData"
              [xAxis]="true"
              [yAxis]="true"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxisLabel]="'Municipalidad'"
              [yAxisLabel]="'Cantidad'"
              [gradient]="true"
              [showDataLabel]="true"
              [barPadding]="8"
              [roundDomains]="true">
            </ngx-charts-bar-vertical>
          </div>
        </div>

        <!-- Ranking por Servicios -->
        <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Ranking por Servicios</h3>
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            </div>
          </div>
          <div class="h-80">
            <ngx-charts-bar-horizontal
              [view]="[400, 300]"
              [results]="rankingServiciosData"
              [xAxis]="true"
              [yAxis]="true"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxisLabel]="'Número de Servicios'"
              [yAxisLabel]="'Asociación'"
              [gradient]="true"
              [showDataLabel]="true">
            </ngx-charts-bar-horizontal>
          </div>
        </div>

        <!-- Emprendedores por Asociación -->
        <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Emprendedores por Asociación</h3>
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
          </div>
          <div class="h-80">
            <ngx-charts-pie-chart
              [view]="[400, 300]"
              [results]="emprendedoresData"
              [legend]="true"
              [labels]="true"
              [doughnut]="true"
              [arcWidth]="0.4"
              [explodeSlices]="false"
              [gradient]="true"
              [tooltipDisabled]="false">
            </ngx-charts-pie-chart>
          </div>
        </div>
      </div>

      <!-- Estado de Asociaciones -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Estado de Asociaciones</h3>
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Gráfico de dona para estados -->
          <div class="h-64">
            <ngx-charts-pie-chart
              [view]="[350, 250]"
              [results]="estadoAsociacionesData"
              [legend]="true"
              [labels]="true"
              [doughnut]="true"
              [arcWidth]="0.5"
              [tooltipDisabled]="false">
            </ngx-charts-pie-chart>
          </div>

          <!-- Estadísticas detalladas -->
          <div class="grid grid-cols-1 gap-3">
            <div
              class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span class="font-semibold text-green-800">Activas</span>
              </div>
              <span class="text-2xl font-bold text-green-600">{{ metrics.activas }}</span>
            </div>
            <div
              class="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-l-4 border-red-500">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span class="font-semibold text-red-800">Inactivas</span>
              </div>
              <span class="text-2xl font-bold text-red-600">{{ metrics.inactivas }}</span>
            </div>
            <div
              class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span class="font-semibold text-blue-800">Tasa de Actividad</span>
              </div>
              <span class="text-2xl font-bold text-blue-600">
                {{ (metrics.activas / metrics.total * 100).toFixed(1) }}%
              </span>
            </div>
            <div
              class="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border-l-4 border-indigo-500">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-indigo-500 rounded-full mr-3"></div>
                <span class="font-semibold text-indigo-800">Crecimiento Mensual</span>
              </div>
              <span class="text-2xl font-bold text-indigo-600">+12%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla detallada -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Listado General de Asociaciones</h3>
          <div class="relative">
            <input type="text" placeholder="Buscar asociación..."
                   class="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   (input)="filtrarAsociaciones($event)">
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  (click)="ordenarPor('nombre')">
                <div class="flex items-center">
                  Asociación
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  (click)="ordenarPor('ubicacion')">
                Ubicación
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  (click)="ordenarPor('emprendedores_count')">
                Emprendedores
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  (click)="ordenarPor('servicios_count')">
                Servicios
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  (click)="ordenarPor('reservas_mes')">
                Reservas/Mes
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  (click)="ordenarPor('estado')">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (asoc of asociacionesFiltradas; track asoc.id) {
                <tr class="hover:bg-gray-50 transition-colors duration-200">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span class="text-indigo-600 font-medium">{{ asoc.nombre.charAt(0) }}</span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ asoc.nombre }}</div>
                        <div class="text-sm text-gray-500">{{ asoc.descripcion | slice:0:30 }}...</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ asoc.ubicacion }}</div>
                    <div class="text-sm text-gray-500">{{ asoc.municipalidad }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ asoc.telefono }}</div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">{{ asoc.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
              <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                {{ asoc.emprendedores_count }}
              </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
              <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                {{ asoc.servicios_count }}
              </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
              <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800">
                {{ asoc.reservas_mes }}
              </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    @if (asoc.estado) {
                      <span
                        class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  Activa
                </span>
                    } @else {
                      <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
                  Inactiva
                </span>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex space-x-2">
                      <button class="text-indigo-600 hover:text-indigo-900" title="Editar">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button class="text-green-600 hover:text-green-900" title="Ver emprendedores">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button class="text-red-600 hover:text-red-900" title="Eliminar">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
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
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando
                <span class="font-medium">{{ (paginaActual - 1) * itemsPorPagina + 1 }}</span>
                a
                <span class="font-medium">{{ getMinPagina() }}</span>
                de
                <span class="font-medium">{{ asociacionesFiltradas.length }}</span>
                resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button (click)="paginaAnterior()"
                        [disabled]="paginaActual === 1"
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <span class="sr-only">Anterior</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clip-rule="evenodd"></path>
                  </svg>
                </button>
                @for (pagina of getPaginas(); track pagina) {
                  <button (click)="irAPagina(pagina)"
                          [class.bg-indigo-50]="pagina === paginaActual"
                          class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    {{ pagina }}
                  </button>
                }
                <button (click)="paginaSiguiente()"
                        [disabled]="paginaActual === getTotalPaginas()"
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <span class="sr-only">Siguiente</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clip-rule="evenodd"></path>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})

export class ReporteAsociacionesComponent implements OnInit {
  // Datos de ejemplo para asociaciones
  asociaciones = [
    {
      id: 1,
      nombre: "Asociación Turística Llachon",
      descripcion: "Asociación dedicada al turismo comunitario en la península de Llachon",
      ubicacion: "Llachon",
      municipalidad: "Capachica",
      telefono: "+51 987 654 321",
      email: "info@llachonturismo.com",
      estado: true,
      emprendedores_count: 12,
      servicios_count: 24,
      reservas_mes: 45,
      calificacion: 4.8,
      fecha_creacion: "2018-05-15"
    },
    {
      id: 2,
      nombre: "Asociación Gastronómica Paramis",
      descripcion: "Promoción de la gastronomía tradicional de la zona",
      ubicacion: "Paramis",
      municipalidad: "Capachica",
      telefono: "+51 987 123 456",
      email: "contacto@paramisgastronomia.pe",
      estado: true,
      emprendedores_count: 8,
      servicios_count: 15,
      reservas_mes: 32,
      calificacion: 4.5,
      fecha_creacion: "2019-03-20"
    },
    {
      id: 3,
      nombre: "Asociación Artesanal Ticonata",
      descripcion: "Artesanías y tejidos tradicionales de la comunidad",
      ubicacion: "Ticonata",
      municipalidad: "Puno",
      telefono: "+51 987 789 123",
      email: "artesania@ticonata.org",
      estado: true,
      emprendedores_count: 6,
      servicios_count: 10,
      reservas_mes: 18,
      calificacion: 4.2,
      fecha_creacion: "2020-01-10"
    },
    {
      id: 4,
      nombre: "Asociación Ecoturística Escallani",
      descripcion: "Turismo sostenible y experiencias culturales",
      ubicacion: "Escallani",
      municipalidad: "Puno",
      telefono: "+51 987 456 789",
      email: "escallani.ecoturismo@gmail.com",
      estado: false,
      emprendedores_count: 5,
      servicios_count: 8,
      reservas_mes: 0,
      calificacion: 3.9,
      fecha_creacion: "2021-07-05"
    },
    {
      id: 5,
      nombre: "Asociación de Guías Chifron",
      descripcion: "Servicios de guiado turístico profesional",
      ubicacion: "Chifron",
      municipalidad: "Atuncolla",
      telefono: "+51 987 321 654",
      email: "guias@chifron.com",
      estado: true,
      emprendedores_count: 9,
      servicios_count: 14,
      reservas_mes: 28,
      calificacion: 4.7,
      fecha_creacion: "2022-02-18"
    }
  ];

  // Métricas calculadas
  metrics = {
    total: this.asociaciones.length,
    activas: this.asociaciones.filter(a => a.estado).length,
    inactivas: this.asociaciones.filter(a => !a.estado).length,
    totalEmprendedores: this.asociaciones.reduce((sum, a) => sum + a.emprendedores_count, 0),
    totalServicios: this.asociaciones.reduce((sum, a) => sum + a.servicios_count, 0),
    totalReservas: this.asociaciones.reduce((sum, a) => sum + a.reservas_mes, 0),
    calificacionPromedio: (this.asociaciones.reduce((sum, a) => sum + a.calificacion, 0) / this.asociaciones.length).toFixed(1),
    get promedioEmprendedores() {
      return (this.totalEmprendedores / this.total).toFixed(1);
    },
    get promedioServicios() {
      return (this.totalServicios / this.total).toFixed(1);
    }
  };

  // Esquemas de color
  colorScheme = {
    domain: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']
  };

  estadoColorScheme = {
    domain: ['#10B981', '#EF4444'] // Verde para activas, Rojo para inactivas
  };

  // Agrega estas propiedades a tu componente
  asociacionesFiltradas: any[] = [];
  filtroBusqueda: string = '';
  paginaActual: number = 1;
  itemsPorPagina: number = 5;

// Métodos para la funcionalidad de la tabla
  ngOnInit() {
    this.asociacionesFiltradas = [...this.asociaciones];
  }

  filtrarAsociaciones(event: any) {
    this.filtroBusqueda = event.target.value.toLowerCase();
    this.paginaActual = 1;

    this.asociacionesFiltradas = this.asociaciones.filter(asoc =>
      asoc.nombre.toLowerCase().includes(this.filtroBusqueda) ||
      asoc.ubicacion.toLowerCase().includes(this.filtroBusqueda) ||
      asoc.municipalidad.toLowerCase().includes(this.filtroBusqueda) ||
      asoc.email.toLowerCase().includes(this.filtroBusqueda)
    );
  }

  ordenarPor(campo: string) {
    this.asociacionesFiltradas.sort((a, b) => {
      if (a[campo] < b[campo]) return -1;
      if (a[campo] > b[campo]) return 1;
      return 0;
    });
  }

  getPaginas(): number[] {
    const totalPaginas = this.getTotalPaginas();
    return Array.from({length: totalPaginas}, (_, i) => i + 1);
  }

  getTotalPaginas(): number {
    return Math.ceil(this.asociacionesFiltradas.length / this.itemsPorPagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.getTotalPaginas()) {
      this.paginaActual++;
    }
  }

  irAPagina(pagina: number) {
    this.paginaActual = pagina;
  }

  // Datos para gráficos
  get municipalidadData() {
    const municipios: Record<string, number> = {};
    this.asociaciones.forEach(a => {
      municipios[a.municipalidad] = (municipios[a.municipalidad] || 0) + 1;
    });
    return Object.entries(municipios).map(([name, value]) => ({name, value}));
  }

  get rankingServiciosData() {
    return this.asociaciones
      .sort((a, b) => b.servicios_count - a.servicios_count)
      .map(a => ({
        name: a.nombre,
        value: a.servicios_count
      }));
  }

  get emprendedoresData() {
    return this.asociaciones.map(a => ({
      name: a.nombre,
      value: a.emprendedores_count
    }));
  }

  get estadoAsociacionesData() {
    return [
      {
        name: 'Activas',
        value: this.metrics.activas
      },
      {
        name: 'Inactivas',
        value: this.metrics.inactivas
      }
    ];
  }

  get radarData() {
    return this.asociaciones.map(a => ({
      name: a.nombre,
      series: [
        {
          name: 'Emprendedores',
          value: a.emprendedores_count
        },
        {
          name: 'Servicios',
          value: a.servicios_count
        },
        {
          name: 'Reservas',
          value: a.reservas_mes
        },
        {
          name: 'Calificación',
          value: a.calificacion * 5 // Ajuste para escala visual
        }
      ]
    }));
  }

  getMinPagina(): number {
    return Math.min(this.paginaActual * this.itemsPorPagina, this.asociacionesFiltradas.length);
  }



}
//
// // Función auxiliar para el gráfico de radar
// function d3() {
//   return {
//     curveCardinal: {
//       tension: () => ({
//         tension: (t: number) => ({tension: t})
//       })
//     }
//   };
// }
