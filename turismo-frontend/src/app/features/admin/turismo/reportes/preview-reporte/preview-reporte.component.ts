import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import {PreviewReporte} from '../../../../../core/services/reportes.service';

@Component({
  selector: "app-preview-reporte",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="preview" class="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900 flex items-center">
          <svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          Previsualización del Reporte
        </h3>

        <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          {{ preview.total_registros }} registros encontrados
        </span>
      </div>

      <!-- Estadísticas Resumidas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border-l-4 border-blue-500">
          <div class="text-2xl font-bold text-blue-600">{{ preview.estadisticas.total }}</div>
          <div class="text-sm text-blue-700">Total Emprendedores</div>
        </div>

        <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border-l-4 border-green-500">
          <div class="text-2xl font-bold text-green-600">{{ preview.estadisticas.capacidad_total }}</div>
          <div class="text-sm text-green-700">Capacidad Total</div>
        </div>

        <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border-l-4 border-purple-500">
          <div class="text-2xl font-bold text-purple-600">{{ preview.estadisticas.promedio_reservas }}</div>
          <div class="text-sm text-purple-700">Promedio Reservas/Mes</div>
        </div>

        <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 border-l-4 border-yellow-500">
          <div class="text-2xl font-bold text-yellow-600">{{ preview.estadisticas.porcentaje_certificaciones }}%</div>
          <div class="text-sm text-yellow-700">Con Certificaciones</div>
        </div>
      </div>

      <!-- Distribución por Categoría -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Por Categoría</h4>
          <div class="space-y-2">
            <div *ngFor="let item of getCategorias()"
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium text-gray-700">{{ item.categoria }}</span>
              <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {{ item.cantidad }}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Por Municipalidad</h4>
          <div class="space-y-2">
            <div *ngFor="let item of getMunicipalidades()"
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium text-gray-700">{{ item.municipalidad }}</span>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {{ item.cantidad }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Muestra de Datos -->
      <div>
        <h4 class="text-lg font-semibold text-gray-800 mb-3">Muestra de Datos (Primeros 5 registros)</h4>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reservas/Mes
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let emprendedor of preview.muestra">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ emprendedor.nombre }}</div>
                  <div class="text-sm text-gray-500">{{ emprendedor.tipo_servicio }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {{ emprendedor.categoria }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ emprendedor.comunidad }}, {{ emprendedor.municipalidad }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ emprendedor.reservas_mes }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Nota informativa -->
      <div class="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
        <div class="flex">
          <svg class="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <p class="text-sm text-blue-700">
              Esta es una previsualización de los datos que se incluirán en el reporte.
              El reporte completo contendrá todos los {{ preview.total_registros }} registros encontrados.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PreviewReporteComponent {
  @Input() preview?: PreviewReporte

  getCategorias() {
    if (!this.preview?.estadisticas?.por_categoria) return []

    return Object.entries(this.preview.estadisticas.por_categoria).map(([categoria, cantidad]) => ({
      categoria,
      cantidad,
    }))
  }

  getMunicipalidades() {
    if (!this.preview?.estadisticas?.por_municipalidad) return []

    return Object.entries(this.preview.estadisticas.por_municipalidad).map(([municipalidad, cantidad]) => ({
      municipalidad,
      cantidad,
    }))
  }
}
