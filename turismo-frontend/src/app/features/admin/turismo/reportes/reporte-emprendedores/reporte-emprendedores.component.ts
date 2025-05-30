
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-reporte-emprendedores',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <!-- Header Mejorado -->
      <div class="mb-8 bg-white rounded-2xl shadow-lg p-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Dashboard de Emprendedores
            </h1>
            <p class="text-xl text-gray-600 font-medium">
              {{ asociacion?.nombre || 'Asociación' }}
            </p>
            <p class="text-gray-500 mt-2">
              Análisis integral del turismo comunitario en {{ asociacion?.comunidad || 'la asociación' }}
            </p>
          </div>
          <div class="hidden lg:block">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Métricas principales con diseño moderno -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Emprendedores -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Total Emprendedores</p>
              <p class="text-3xl font-bold text-gray-900">{{ metrics.total }}</p>
              <div class="flex items-center mt-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 100%"></div>
                </div>
              </div>
            </div>
            <div class="p-3 bg-blue-100 rounded-xl">
              <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Emprendedores Activos -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Emprendedores Activos</p>
              <p class="text-3xl font-bold text-green-600">{{ metrics.activos }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ (metrics.activos / metrics.total * 100).toFixed(1) }}% del total</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div class="bg-green-500 h-2 rounded-full transition-all duration-500"
                     [style.width.%]="(metrics.activos / metrics.total * 100)"></div>
              </div>
            </div>
            <div class="p-3 bg-green-100 rounded-xl">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Con Certificaciones -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Con Certificaciones</p>
              <p class="text-3xl font-bold text-yellow-600">{{ metrics.conCertificaciones }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ (metrics.conCertificaciones / metrics.total * 100).toFixed(1) }}% del total</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div class="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                     [style.width.%]="(metrics.conCertificaciones / metrics.total * 100)"></div>
              </div>
            </div>
            <div class="p-3 bg-yellow-100 rounded-xl">
              <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Accesibles -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Accesibles</p>
              <p class="text-3xl font-bold text-purple-600">{{ metrics.conFacilidadesDiscapacidad }}</p>
              <p class="text-xs text-gray-500 mt-1">Facilidades para discapacidad</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div class="bg-purple-500 h-2 rounded-full transition-all duration-500"
                     [style.width.%]="(metrics.conFacilidadesDiscapacidad / metrics.total * 100)"></div>
              </div>
            </div>
            <div class="p-3 bg-purple-100 rounded-xl">
              <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Métricas secundarias mejoradas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total de Servicios -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium mb-1">Total de Servicios</p>
              <p class="text-4xl font-bold">{{ metrics.totalServicios }}</p>
              <p class="text-blue-100 text-xs mt-1">Promedio: {{ metrics.promedioServicios }} por emprendedor</p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Reservas del Mes -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium mb-1">Reservas del Mes</p>
              <p class="text-4xl font-bold">{{ metrics.totalReservas }}</p>
              <p class="text-green-100 text-xs mt-1">Promedio: {{ metrics.promedioReservas }} por emprendedor</p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Comunidades Activas -->
        <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-indigo-100 text-sm font-medium mb-1">Comunidades Activas</p>
              <p class="text-4xl font-bold">{{ comunidadData.length }}</p>
              <p class="text-indigo-100 text-xs mt-1">En distrito de {{ asociacion?.municipalidad || 'la zona' }}</p>
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
      </div>

      <!-- Gráficos principales mejorados -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Emprendedores por Categoría -->
        <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Emprendedores por Categoría</h3>
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <div class="h-80">
            <ngx-charts-pie-chart
              [view]="[400, 300]"
              [results]="categoriaData"
              [legend]="true"
              [labels]="true"
              [doughnut]="true"
              [arcWidth]="0.4"
              [explodeSlices]="false"
              [gradient]="true"
              [tooltipDisabled]="false"
            >
            </ngx-charts-pie-chart>
          </div>
        </div>

        <!-- Emprendedores por Comunidad -->
        <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Distribución por Comunidad</h3>
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              </svg>
            </div>
          </div>
          <div class="h-80">
            <ngx-charts-bar-vertical
              [view]="[400, 300]"
              [results]="comunidadData"
              [xAxis]="true"
              [yAxis]="true"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxisLabel]="'Comunidad'"
              [yAxisLabel]="'Cantidad'"
              [gradient]="true"
              [showDataLabel]="true"
              [barPadding]="8"
              [roundDomains]="true">
            </ngx-charts-bar-vertical>
          </div>
        </div>

        <!-- Rangos de Precios -->
        <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Distribución por Rangos de Precio</h3>
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
          <div class="h-80">
            <ngx-charts-bar-horizontal
              [view]="[400, 300]"
              [results]="rangosPrecioData"
              [xAxis]="true"
              [yAxis]="true"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxisLabel]="'Cantidad'"
              [yAxisLabel]="'Rango de Precio'"
              [gradient]="true"
              [showDataLabel]="true">
            </ngx-charts-bar-horizontal>
          </div>
        </div>

        <!-- Métodos de Pago -->
        <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Métodos de Pago Aceptados</h3>
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
          </div>
          <div class="h-80">
            <ngx-charts-bar-vertical
              [view]="[400, 300]"
              [results]="metodosPagoData"
              [xAxis]="true"
              [yAxis]="true"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxisLabel]="'Método de Pago'"
              [yAxisLabel]="'Cantidad'"
              [gradient]="true"
              [showDataLabel]="true"
              [barPadding]="8">
            </ngx-charts-bar-vertical>
          </div>
        </div>
      </div>

      <!-- Análisis de Reservas mejorado -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Reservas por Categoría - CORREGIDO -->
        <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Reservas por Categoría</h3>
            <div class="p-2 bg-indigo-100 rounded-lg">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          <div class="h-80">
            <ngx-charts-bar-vertical
              [view]="[400, 300]"
              [results]="reservasPorCategoriaData"
              [xAxis]="true"
              [yAxis]="true"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxisLabel]="'Categoría'"
              [yAxisLabel]="'Reservas'"
              [gradient]="true"
              [showDataLabel]="true"
              [barPadding]="8">
            </ngx-charts-bar-vertical>
          </div>
        </div>

        <!-- Estado de Emprendedores mejorado -->
        <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Estado de Emprendedores</h3>
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <div class="space-y-6">
            <!-- Gráfico de dona para estados -->
            <div class="h-64">
              <ngx-charts-pie-chart
                [view]="[350, 250]"
                [results]="estadoEmprendedoresData"
                [legend]="true"
                [labels]="true"
                [doughnut]="true"
                [arcWidth]="0.5"
                [tooltipDisabled]="false">
              </ngx-charts-pie-chart>
            </div>

            <!-- Estadísticas detalladas -->
            <div class="grid grid-cols-1 gap-3">
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span class="font-semibold text-green-800">Activos</span>
                </div>
                <span class="text-2xl font-bold text-green-600">{{ metrics.activos }}</span>
              </div>
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-l-4 border-red-500">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span class="font-semibold text-red-800">Inactivos</span>
                </div>
                <span class="text-2xl font-bold text-red-600">{{ metrics.inactivos }}</span>
              </div>
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span class="font-semibold text-blue-800">Tasa de Actividad</span>
                </div>
                <span class="text-2xl font-bold text-blue-600">
                  {{ (metrics.activos / metrics.total * 100).toFixed(1) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla detallada -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Listado Detallado de Emprendedores</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Emprendedor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comunidad
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Servicios
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reservas/Mes
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accesible
              </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (emp of emprendedores; track emp.id) {
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ emp.nombre }}</div>
                      <div class="text-sm text-gray-500">{{ emp.tipo_servicio }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {{ emp.categoria }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ emp.comunidad }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ emp.servicios_count }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ emp.reservas_mes }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    @if (emp.estado) {
                      <span
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Activo
                      </span>
                    } @else {
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Inactivo
                      </span>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    @if (emp.facilidades_discapacidad) {
                      <span class="text-green-600">✓</span>
                    } @else {
                      <span class="text-gray-400">-</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer con información adicional -->
      <div class="mt-8 bg-blue-50 rounded-lg p-6">
        <h4 class="font-semibold text-blue-900 mb-2">Acerca del Turismo Comunitario
          en {{ asociacion?.municipalidad || 'la zona' }}</h4>
        <p class="text-blue-800 text-sm">
          El distrito de {{ asociacion?.municipalidad || 'esta zona' }}, ubicado en la provincia y departamento de Puno,
          es considerado como uno de los
          principales distritos en desarrollar el turismo comunitario a nivel regional. Su localización a orillas del
          lago Titicaca y sus Organizaciones de Base Comunitaria han permitido el crecimiento del turismo desde 1990,
          expandiéndose por comunidades como {{ asociacion?.comunidad || 'esta comunidad' }}.
        </p>
      </div>
    </div>
  `,
})

export class ReporteEmprendedoresComponent {
  // Datos de ejemplo para la asociación
  asociacion = {
    nombre: "Asociación Turística Capachica",
    comunidad: "Capachica",
    municipalidad: "Puno"
  };

  // Datos de ejemplo para emprendedores
  emprendedores = [
    {
      id: 1,
      nombre: "Hospedaje Familiar Ticani",
      tipo_servicio: "Alojamiento",
      descripcion: "Hospedaje familiar con vista al lago Titicaca",
      ubicacion: "Llachon",
      telefono: "+51 951 234 567",
      email: "ticani@gmail.com",
      pagina_web: "www.ticani-llachon.com",
      horario_atencion: "24 horas",
      precio_rango: "S/. 30-50",
      metodos_pago: ["Efectivo", "Transferencia"],
      capacidad_aforo: 20,
      numero_personas_atiende: 8,
      categoria: "Alojamiento",
      certificaciones: ["MINCETUR"],
      idiomas_hablados: ["Español", "Quechua", "Inglés básico"],
      facilidades_discapacidad: true,
      estado: true,
      created_at: "2023-01-15",
      asociacion_id: 1,
      municipalidad: "Capachica",
      comunidad: "Llachon",
      servicios_count: 3,
      reservas_mes: 15
    },
    {
      id: 2,
      nombre: "Restaurante Sumak Kausay",
      tipo_servicio: "Gastronomía",
      descripcion: "Comida típica del lago Titicaca",
      ubicacion: "Paramis",
      telefono: "+51 951 345 678",
      email: "sumakkausay@gmail.com",
      horario_atencion: "6:00 - 20:00",
      precio_rango: "S/. 15-25",
      metodos_pago: ["Efectivo", "Yape"],
      capacidad_aforo: 40,
      numero_personas_atiende: 6,
      categoria: "Gastronomía",
      certificaciones: ["Buenas Prácticas"],
      idiomas_hablados: ["Español", "Quechua"],
      facilidades_discapacidad: false,
      estado: true,
      created_at: "2023-03-20",
      asociacion_id: 2,
      municipalidad: "Capachica",
      comunidad: "Paramis",
      servicios_count: 2,
      reservas_mes: 22
    },
    {
      id: 3,
      nombre: "Kayak Titicaca Adventures",
      tipo_servicio: "Deportes Acuáticos",
      descripcion: "Alquiler de kayaks y paseos por el lago",
      ubicacion: "Ccotos",
      telefono: "+51 951 456 789",
      email: "kayaktiticaca@gmail.com",
      pagina_web: "www.kayaktiticaca.pe",
      horario_atencion: "7:00 - 17:00",
      precio_rango: "S/. 20-40",
      metodos_pago: ["Efectivo", "Transferencia", "Visa"],
      capacidad_aforo: 15,
      numero_personas_atiende: 4,
      categoria: "Aventura",
      certificaciones: ["Certificado de Seguridad Acuática"],
      idiomas_hablados: ["Español", "Inglés"],
      facilidades_discapacidad: false,
      estado: true,
      created_at: "2023-02-10",
      asociacion_id: 3,
      municipalidad: "Capachica",
      comunidad: "Ccotos",
      servicios_count: 4,
      reservas_mes: 18
    },
    {
      id: 4,
      nombre: "Textiles Mama Juana",
      tipo_servicio: "Artesanías",
      descripcion: "Tejidos tradicionales y souvenirs",
      ubicacion: "Ticonata",
      telefono: "+51 951 567 890",
      email: "mamajuana@gmail.com",
      horario_atencion: "8:00 - 18:00",
      precio_rango: "S/. 10-80",
      metodos_pago: ["Efectivo"],
      capacidad_aforo: 10,
      numero_personas_atiende: 3,
      categoria: "Artesanías",
      certificaciones: [],
      idiomas_hablados: ["Español", "Quechua"],
      facilidades_discapacidad: false,
      estado: true,
      created_at: "2023-04-05",
      asociacion_id: 4,
      municipalidad: "Capachica",
      comunidad: "Ticonata",
      servicios_count: 1,
      reservas_mes: 8
    },
    {
      id: 5,
      nombre: "Pesca Tradicional Don Carlos",
      tipo_servicio: "Experiencias Culturales",
      descripcion: "Experiencia de pesca tradicional en totora",
      ubicacion: "Escallani",
      telefono: "+51 951 678 901",
      email: "doncarlos@gmail.com",
      horario_atencion: "5:00 - 12:00",
      precio_rango: "S/. 25-35",
      metodos_pago: ["Efectivo", "Yape"],
      capacidad_aforo: 8,
      numero_personas_atiende: 2,
      categoria: "Experiencias",
      certificaciones: ["Guía Local Certificado"],
      idiomas_hablados: ["Español", "Quechua", "Inglés básico"],
      facilidades_discapacidad: true,
      estado: true,
      created_at: "2023-01-30",
      asociacion_id: 5,
      municipalidad: "Capachica",
      comunidad: "Escallani",
      servicios_count: 2,
      reservas_mes: 12
    }
  ];
  // Esquema de colores específico para el gráfico de estado
  estadoColorScheme = {
    domain: ['#10B981', '#EF4444', '#3B82F6'] // Verde para activos, Rojo para inactivos, Azul para tasa
  };

  // Métricas calculadas
  metrics = {
    total: this.emprendedores.length,
    activos: this.emprendedores.filter(e => e.estado).length,
    inactivos: this.emprendedores.filter(e => !e.estado).length,
    conCertificaciones: this.emprendedores.filter(e => e.certificaciones && e.certificaciones.length > 0).length,
    conFacilidadesDiscapacidad: this.emprendedores.filter(e => e.facilidades_discapacidad).length,
    totalServicios: this.emprendedores.reduce((sum, e) => sum + (e.servicios_count || 0), 0),
    totalReservas: this.emprendedores.reduce((sum, e) => sum + (e.reservas_mes || 0), 0),
    get promedioServicios() { return (this.totalServicios / this.total).toFixed(1); },
    get promedioReservas() { return (this.totalReservas / this.total).toFixed(1); }
  };

  // Datos para gráficos
  colorScheme = {
    domain: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']
  };
  // Datos para el gráfico de estado de emprendedores
  get estadoEmprendedoresData() {
    return [
      {
        name: 'Activos',
        value: this.metrics.activos
      },
      {
        name: 'Inactivos',
        value: this.metrics.inactivos
      }
    ];
  }


  get categoriaData() {
    const categorias: Record<string, number> = {};
    this.emprendedores.forEach(emp => {
      categorias[emp.categoria] = (categorias[emp.categoria] || 0) + 1;
    });
    return Object.entries(categorias).map(([name, value]) => ({
      name,
      value,
      extra: { porcentaje: ((value / this.metrics.total) * 100).toFixed(1) + '%' }
    }));
  }

  get comunidadData() {
    const comunidades: Record<string, number> = {};
    this.emprendedores.forEach(emp => {
      comunidades[emp.comunidad] = (comunidades[emp.comunidad] || 0) + 1;
    });
    return Object.entries(comunidades).map(([name, value]) => ({ name, value }));
  }

  get rangosPrecioData() {
    const rangos = {
      'S/. 1-20': 0,
      'S/. 21-40': 0,
      'S/. 41-60': 0,
      'S/. 61-80': 0,
      'S/. 81+': 0
    };

    this.emprendedores.forEach(emp => {
      const precio = emp.precio_rango;
      if (precio?.includes('5-15') || precio?.includes('10-')) rangos['S/. 1-20']++;
      else if (precio?.includes('15-25') || precio?.includes('20-40') || precio?.includes('25-35')) rangos['S/. 21-40']++;
      else if (precio?.includes('30-50')) rangos['S/. 41-60']++;
      else if (precio?.includes('10-80')) rangos['S/. 61-80']++;
    });

    return Object.entries(rangos).map(([name, value]) => ({ name, value }));
  }

  get metodosPagoData() {
    const metodos: Record<string, number> = {};
    this.emprendedores.forEach(emp => {
      emp.metodos_pago?.forEach(metodo => {
        metodos[metodo] = (metodos[metodo] || 0) + 1;
      });
    });
    return Object.entries(metodos).map(([name, value]) => ({ name, value }));
  }

  get reservasPorCategoriaData() {
    const reservasPorCategoria: Record<string, number> = {};
    this.emprendedores.forEach(emp => {
      if (!reservasPorCategoria[emp.categoria]) {
        reservasPorCategoria[emp.categoria] = 0;
      }
      reservasPorCategoria[emp.categoria] += emp.reservas_mes || 0;
    });

    return Object.entries(reservasPorCategoria).map(([name, value]) => ({ name, value }));
  }
}
