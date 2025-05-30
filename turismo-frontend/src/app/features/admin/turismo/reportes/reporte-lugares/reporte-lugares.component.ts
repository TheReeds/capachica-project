import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {NgxChartsModule} from '@swimlane/ngx-charts';


interface LugarTuristico {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  municipalidad: string;
  distrito: string;
  visitas: number;
  calificacion: number;
  activo: boolean;
}

interface SerieTemporal {
  name: string;
  value: number;
}

@Component({
  selector: 'app-reporte-lugares',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <!-- Header Mejorado -->
      <div class="mb-8 bg-white rounded-2xl shadow-lg p-8">
        <div class="flex items-center justify-between">
          <div>
            <h1
              class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Dashboard de Lugares Turísticos
            </h1>
            <p class="text-xl text-gray-600 font-medium">
              Patrimonio Natural y Cultural
            </p>
            <p class="text-gray-500 mt-2">
              Análisis integral de destinos turísticos en la región
            </p>
          </div>
          <div class="hidden lg:block">
            <div
              class="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Métricas principales con diseño moderno -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Lugares -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Total Lugares</p>
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Lugares Culturales -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Lugares Culturales</p>
              <p class="text-3xl font-bold text-purple-600">{{ metrics.culturales }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ (metrics.culturales / metrics.total * 100).toFixed(1) }}% del
                total</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div class="bg-purple-500 h-2 rounded-full transition-all duration-500"
                     [style.width.%]="(metrics.culturales / metrics.total * 100)"></div>
              </div>
            </div>
            <div class="p-3 bg-purple-100 rounded-xl">
              <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Lugares Naturales -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Lugares Naturales</p>
              <p class="text-3xl font-bold text-green-600">{{ metrics.naturales }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ (metrics.naturales / metrics.total * 100).toFixed(1) }}% del
                total</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div class="bg-green-500 h-2 rounded-full transition-all duration-500"
                     [style.width.%]="(metrics.naturales / metrics.total * 100)"></div>
              </div>
            </div>
            <div class="p-3 bg-green-100 rounded-xl">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Visitas -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Total Visitas</p>
              <p class="text-3xl font-bold text-orange-600">{{ metrics.totalVisitas }}</p>
              <p class="text-xs text-gray-500 mt-1">Promedio: {{ metrics.promedioVisitas }} por lugar</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div class="bg-orange-500 h-2 rounded-full transition-all duration-500" style="width: 90%"></div>
              </div>
            </div>
            <div class="p-3 bg-orange-100 rounded-xl">
              <svg class="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Métricas secundarias mejoradas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Reservas del Mes -->
        <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-indigo-100 text-sm font-medium mb-1">Reservas del Mes</p>
              <p class="text-4xl font-bold">{{ metrics.reservasMes }}</p>
              <p class="text-indigo-100 text-xs mt-1">+{{ metrics.crecimientoReservas }}% vs mes anterior</p>
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
        <div class="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-teal-100 text-sm font-medium mb-1">Municipalidades</p>
              <p class="text-4xl font-bold">{{ municipalidadData.length }}</p>
              <p class="text-teal-100 text-xs mt-1">Con lugares turísticos</p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Calificación Promedio -->
        <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-yellow-100 text-sm font-medium mb-1">Calificación Promedio</p>
              <p class="text-4xl font-bold">{{ metrics.calificacionPromedio }}</p>
              <p class="text-yellow-100 text-xs mt-1">Basado en {{ metrics.totalResenas }} reseñas</p>
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
        <!-- Top 5 Lugares Más Visitados -->
        <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Top 5 Lugares Más Visitados</h3>
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <div class="h-80">
            <ngx-charts-bar-horizontal
              [view]="[400, 300]"
              [results]="topLugaresData"
              [xAxis]="true"
              [yAxis]="true"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxisLabel]="'Número de Visitas'"
              [yAxisLabel]="'Lugar Turístico'"
              [gradient]="true"
              [showDataLabel]="true">
            </ngx-charts-bar-horizontal>
          </div>
        </div>

        <!-- Distribución por Categoría -->
        <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Distribución por Categoría</h3>
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
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
              [tooltipDisabled]="false">
            </ngx-charts-pie-chart>
          </div>
        </div>

        <!-- Lugares por Municipalidad -->
        <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Lugares por Municipalidad</h3>
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              [yAxisLabel]="'Cantidad de Lugares'"
              [gradient]="true"
              [showDataLabel]="true"
              [barPadding]="8"
              [roundDomains]="true">
            </ngx-charts-bar-vertical>
          </div>
        </div>

        <!-- Tendencia de Reservas -->
        <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Tendencia de Reservas</h3>
            <div class="p-2 bg-indigo-100 rounded-lg">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
          <div class="h-80">
            <ngx-charts-line-chart
              [view]="[400, 300]"
              [results]="tendenciaReservasData"
              [xAxis]="true"
              [yAxis]="true"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxisLabel]="'Mes'"
              [yAxisLabel]="'Reservas'"
              [timeline]="false"
              [legend]="true"
              [gradient]="true">
            </ngx-charts-line-chart>
          </div>
        </div>
      </div>

      <!-- Análisis de Cobertura Turística -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Análisis de Cobertura Turística</h3>
          <div class="p-2 bg-teal-100 rounded-lg">
            <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Estadísticas de Cobertura -->
          <div class="grid grid-cols-1 gap-4">
            <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border-l-4 border-blue-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-blue-800">Densidad Turística</p>
                  <p class="text-2xl font-bold text-blue-600">{{ metrics.densidadTuristica }}</p>
                  <p class="text-xs text-blue-600">lugares por km²</p>
                </div>
                <div class="p-2 bg-blue-200 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border-l-4 border-green-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-green-800">Cobertura Regional</p>
                  <p class="text-2xl font-bold text-green-600">{{ metrics.coberturaRegional }}%</p>
                  <p class="text-xs text-green-600">de la región cubierta</p>
                </div>
                <div class="p-2 bg-green-200 rounded-lg">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 border-l-4 border-yellow-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-yellow-800">Potencial de Expansión</p>
                  <p class="text-2xl font-bold text-yellow-600">{{ metrics.potencialExpansion }}</p>
                  <p class="text-xs text-yellow-600">nuevas oportunidades</p>
                </div>
                <div class="p-2 bg-yellow-200 rounded-lg">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Mapa de Cobertura (Simulado) -->
          <div class="lg:col-span-2">
            <div
              class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 h-64 flex items-center justify-center">
              <div class="text-center">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
                <h4 class="text-lg font-semibold text-gray-600 mb-2">Mapa de Cobertura Turística</h4>
                <p class="text-sm text-gray-500">Visualización interactiva de lugares turísticos</p>
                <p class="text-xs text-gray-400 mt-2">Integración con mapas disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla detallada -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Listado General de Lugares Turísticos</h3>
          <div class="flex space-x-4">
            <select
              class="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              (change)="filtrarPorCategoria($event)">
              <option value="">Todas las categorías</option>
              <option value="Natural">Natural</option>
              <option value="Cultural">Cultural</option>
              <option value="Gastronómico">Gastronómico</option>
              <option value="Aventura">Aventura</option>
            </select>
            <div class="relative">
              <input
                type="text"
                placeholder="Buscar lugar turístico..."
                class="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                (input)="filtrarLugares($event)">
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th (click)="ordenarLugares('nombre')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                <div class="flex items-center">
                  Lugar Turístico
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th (click)="ordenarLugares('municipalidad')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Municipalidad
              </th>
              <th (click)="ordenarLugares('visitas')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Visitas
              </th>
              <th (click)="ordenarLugares('calificacion')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Calificación
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let lugar of lugaresFiltrados" class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
                    {{ lugar.nombre.charAt(0) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ lugar.nombre }}</div>
                    <div class="text-sm text-gray-500">{{ lugar.descripcion | slice: 0:30 }}...</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
            <span *ngIf="lugar.categoria === 'Natural'"
                  class="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
              {{ lugar.categoria }}
            </span>
                <span *ngIf="lugar.categoria === 'Cultural'"
                      class="px-2 inline-flex text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
              {{ lugar.categoria }}
            </span>
                <span *ngIf="lugar.categoria !== 'Natural' && lugar.categoria !== 'Cultural'"
                      class="px-2 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
              {{ lugar.categoria }}
            </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ lugar.municipalidad }}</div>
                <div class="text-sm text-gray-500">{{ lugar.distrito }}</div>
              </td>
              <td class="px-6 py-4 text-center">
            <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800">
              {{ lugar.visitas }}
            </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-1">
                  <ng-container *ngFor="let star of [1, 2, 3, 4, 5]">
                    <svg [ngClass]="star <= lugar.calificacion ? 'text-yellow-400' : 'text-gray-300'"
                         class="w-4 h-4 fill-current"
                         viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  </ng-container>
                  <span class="text-sm text-gray-600">{{ lugar.calificacion.toFixed(1) }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
            <span *ngIf="lugar.activo"
                  class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
              Activo
            </span>
                <span *ngIf="!lugar.activo"
                      class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
              Inactivo
            </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex space-x-2">
                  <button class="text-blue-600 hover:text-blue-900" title="Editar">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button class="text-green-600 hover:text-green-900" title="Ver detalles">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button class="text-red-600 hover:text-red-900" title="Eliminar">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})

export class ReporteLugaresComponent implements OnInit {

  // Métricas generales
  metrics = {
    total: 0,
    culturales: 0,
    naturales: 0,
    totalVisitas: 0,
    promedioVisitas: 0,
    reservasMes: 1250,
    crecimientoReservas: 12.5,
    calificacionPromedio: 0,
    totalResenas: 3420,
    densidadTuristica: 2.3,
    coberturaRegional: 78.5,
    potencialExpansion: 23
  };

  // Datos para gráficos
  readonly topLugaresData = [
    { name: 'Machu Picchu', value: 4500 },
    { name: 'Sacsayhuamán', value: 3200 },
    { name: 'Valle Sagrado', value: 2800 },
    { name: 'Pisaq', value: 2100 },
    { name: 'Ollantaytambo', value: 1900 }
  ];

  readonly categoriaData = [
    { name: 'Natural', value: 73 },
    { name: 'Cultural', value: 58 },
    { name: 'Gastronómico', value: 12 },
    { name: 'Aventura', value: 4 }
  ];

  readonly municipalidadData = [
    { name: 'Cusco', value: 45 },
    { name: 'Urubamba', value: 28 },
    { name: 'Ollantaytambo', value: 22 },
    { name: 'Pisaq', value: 18 },
    { name: 'Chinchero', value: 15 },
    { name: 'Maras', value: 12 },
    { name: 'Calca', value: 7 }
  ];

  readonly tendenciaReservasData = [
    {
      name: 'Reservas',
      series: [
        { name: 'Ene', value: 890 },
        { name: 'Feb', value: 1020 },
        { name: 'Mar', value: 1150 },
        { name: 'Abr', value: 980 },
        { name: 'May', value: 1250 },
        { name: 'Jun', value: 1380 },
        { name: 'Jul', value: 1520 },
        { name: 'Ago', value: 1420 },
        { name: 'Sep', value: 1180 },
        { name: 'Oct', value: 1350 },
        { name: 'Nov', value: 1250 },
        { name: 'Dic', value: 1480 }
      ]
    }
  ];

  readonly lugaresTuristicos: LugarTuristico[] = [
    {
      id: 1,
      nombre: 'Machu Picchu',
      descripcion: 'Ciudadela inca ubicada en las montañas.',
      categoria: 'Cultural',
      municipalidad: 'Machu Picchu',
      distrito: 'Urubamba',
      visitas: 4500,
      calificacion: 4.8,
      activo: true
    },
    {
      id: 2,
      nombre: 'Sacsayhuamán',
      descripcion: 'Complejo arqueológico inca.',
      categoria: 'Cultural',
      municipalidad: 'Cusco',
      distrito: 'Cusco',
      visitas: 3200,
      calificacion: 4.6,
      activo: true
    },
    {
      id: 3,
      nombre: 'Valle Sagrado',
      descripcion: 'Zona agrícola y espiritual de los incas.',
      categoria: 'Natural',
      municipalidad: 'Urubamba',
      distrito: 'Urubamba',
      visitas: 2800,
      calificacion: 4.5,
      activo: true
    },
    {
      id: 4,
      nombre: 'Pisaq',
      descripcion: 'Ruinas incas en terrazas.',
      categoria: 'Cultural',
      municipalidad: 'Pisaq',
      distrito: 'Calca',
      visitas: 2100,
      calificacion: 4.3,
      activo: true
    },
    {
      id: 5,
      nombre: 'Ollantaytambo',
      descripcion: 'Centro militar y religioso inca.',
      categoria: 'Cultural',
      municipalidad: 'Ollantaytambo',
      distrito: 'Urubamba',
      visitas: 1900,
      calificacion: 4.4,
      activo: true
    },
    {
      id: 6,
      nombre: 'Laguna Humantay',
      descripcion: 'Lago glacial en la región andina.',
      categoria: 'Natural',
      municipalidad: 'Mollepata',
      distrito: 'Anta',
      visitas: 1650,
      calificacion: 4.7,
      activo: true
    },
    {
      id: 7,
      nombre: 'Chinchero',
      descripcion: 'Pueblo conocido por su mercado y ruinas.',
      categoria: 'Cultural',
      municipalidad: 'Chinchero',
      distrito: 'Urubamba',
      visitas: 1400,
      calificacion: 4.2,
      activo: true
    },
    {
      id: 8,
      nombre: 'Salinas de Maras',
      descripcion: 'Minas de sal en terrazas.',
      categoria: 'Natural',
      municipalidad: 'Maras',
      distrito: 'Urubamba',
      visitas: 1250,
      calificacion: 4.1,
      activo: true
    }
  ];

  lugaresFiltrados: LugarTuristico[] = [];

  ngOnInit(): void {
    this.lugaresFiltrados = [...this.lugaresTuristicos];
    this.calcularMetricas();
  }

  ordenarPor: string = '';
  ordenarLugares(campo: keyof LugarTuristico): void {
    this.ordenarPor = campo;
    this.lugaresFiltrados.sort((a, b) => {
      if (typeof a[campo] === 'string') {
        return (a[campo] as string).localeCompare(b[campo] as string);
      }
      return (a[campo] as number) - (b[campo] as number);
    });
  }

  private calcularMetricas(): void {
    const total = this.lugaresTuristicos.length;
    const totalVisitas = this.lugaresTuristicos.reduce((acc, lugar) => acc + lugar.visitas, 0);
    const sumaCalificaciones = this.lugaresTuristicos.reduce((acc, lugar) => acc + lugar.calificacion, 0);
    const culturales = this.lugaresTuristicos.filter(l => l.categoria === 'Cultural').length;
    const naturales = this.lugaresTuristicos.filter(l => l.categoria === 'Natural').length;

    this.metrics.total = total;
    this.metrics.totalVisitas = totalVisitas;
    this.metrics.promedioVisitas = total ? Math.round(totalVisitas / total) : 0;
    this.metrics.calificacionPromedio = total ? parseFloat((sumaCalificaciones / total).toFixed(1)) : 0;
    this.metrics.culturales = culturales;
    this.metrics.naturales = naturales;
  }

  filtrarPorCategoria(event: Event): void {
    const categoria = (event.target as HTMLSelectElement).value;
    this.lugaresFiltrados = categoria
      ? this.lugaresTuristicos.filter(lugar => lugar.categoria === categoria)
      : [...this.lugaresTuristicos];
  }

  filtrarLugares(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase().trim();

    this.lugaresFiltrados = !searchTerm
      ? [...this.lugaresTuristicos]
      : this.lugaresTuristicos.filter(lugar =>
        lugar.nombre.toLowerCase().includes(searchTerm) ||
        lugar.categoria.toLowerCase().includes(searchTerm) ||
        lugar.municipalidad.toLowerCase().includes(searchTerm)
      );
  }
}
