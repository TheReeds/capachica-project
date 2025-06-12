import {Component, EventEmitter, Input, Output, OnInit} from "@angular/core"
import {CommonModule} from "@angular/common"
import {FormsModule, ReactiveFormsModule,  FormBuilder,  FormGroup} from "@angular/forms"
import {DatosFiltros, FiltrosReporte} from '../../../../../core/services/reportes.service';

@Component({
  selector: "app-filtros-reporte",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900 flex items-center">
          <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
          </svg>
          Filtros de Búsqueda
        </h3>

        <div class="flex gap-2">
          <button
            type="button"
            (click)="limpiarFiltros()"
            class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Limpiar
          </button>
          <button
            type="button"
            (click)="aplicarFiltros()"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Aplicar Filtros
          </button>
        </div>
      </div>

      <form [formGroup]="filtrosForm" class="space-y-6">
        <!-- Fila 1: Ubicación -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select formControlName="categoria"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todas las categorías</option>
              <option *ngFor="let categoria of datosFiltros?.categorias" [value]="categoria">
                {{ categoria }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Municipalidad</label>
            <select formControlName="municipalidad"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todas las municipalidades</option>
              <option *ngFor="let municipalidad of datosFiltros?.municipalidades" [value]="municipalidad">
                {{ municipalidad }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Comunidad</label>
            <select formControlName="comunidad"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todas las comunidades</option>
              <option *ngFor="let comunidad of datosFiltros?.comunidades" [value]="comunidad">
                {{ comunidad }}
              </option>
            </select>
          </div>
        </div>

        <!-- Fila 2: Fechas y Servicios -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Desde</label>
            <input type="date" formControlName="fecha_desde"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Hasta</label>
            <input type="date" formControlName="fecha_hasta"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Servicio</label>
            <input type="text" formControlName="tipo_servicio" placeholder="Ej: Alojamiento, Gastronomía..."
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>

        <!-- Fila 3: Precios y Opciones -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Precio Mínimo (S/.)</label>
            <input type="number" formControlName="precio_min" min="0" placeholder="0"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Precio Máximo (S/.)</label>
            <input type="number" formControlName="precio_max" min="0" placeholder="1000"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Facilidades de Discapacidad</label>
            <select formControlName="facilidades_discapacidad"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todos</option>
              <option value="true">Solo con facilidades</option>
              <option value="false">Sin facilidades</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              type="button"
              (click)="previsualizarReporte()"
              [disabled]="previsualizando"
              class="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <span *ngIf="!previsualizando">👁️ Previsualizar</span>
              <span *ngIf="previsualizando">Cargando...</span>
            </button>
          </div>
        </div>

        <!-- Filtros activos -->
        <div *ngIf="filtrosActivos.length > 0" class="mt-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Filtros Activos:</h4>
          <div class="flex flex-wrap gap-2">
            <span *ngFor="let filtro of filtrosActivos"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ filtro.label }}: {{ filtro.value }}
              <button type="button" (click)="removerFiltro(filtro.key)" class="ml-2 text-blue-600 hover:text-blue-800">
                ×
              </button>
            </span>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class FiltrosReporteComponent implements OnInit {
  @Input() datosFiltros?: DatosFiltros
  @Input() previsualizando = false
  @Output() filtrosChange = new EventEmitter<FiltrosReporte>()
  @Output() previsualizar = new EventEmitter<FiltrosReporte>()

  filtrosForm: FormGroup
  filtrosActivos: Array<{ key: string; label: string; value: string }> = []

  constructor(private fb: FormBuilder) {
    this.filtrosForm = this.fb.group({
      categoria: [""],
      municipalidad: [""],
      comunidad: [""],
      fecha_desde: [""],
      fecha_hasta: [""],
      tipo_servicio: [""],
      precio_min: [null],
      precio_max: [null],
      facilidades_discapacidad: [""],
    })
  }

  ngOnInit() {
    this.filtrosForm.valueChanges.subscribe(() => {
      this.actualizarFiltrosActivos()
    })
  }

  aplicarFiltros() {
    const filtros = this.obtenerFiltrosLimpios()
    this.filtrosChange.emit(filtros)
  }

  previsualizarReporte() {
    const filtros = this.obtenerFiltrosLimpios()
    this.previsualizar.emit(filtros)
  }

  limpiarFiltros() {
    this.filtrosForm.reset()
    this.filtrosActivos = []
    this.filtrosChange.emit({})
  }

  removerFiltro(key: string) {
    this.filtrosForm.patchValue({[key]: key === "facilidades_discapacidad" ? "" : null})
    this.aplicarFiltros()
  }

  private obtenerFiltrosLimpios(): FiltrosReporte {
    const formValue = this.filtrosForm.value
    const filtros: FiltrosReporte = {}

    Object.keys(formValue).forEach((key) => {
      const value = formValue[key]
      if (value !== null && value !== "" && value !== undefined) {
        if (key === "facilidades_discapacidad") {
          filtros[key] = value === "true"
        } else {
          // @ts-ignore
          filtros[key] = value
        }
      }
    })

    return filtros
  }

  private actualizarFiltrosActivos() {
    const formValue = this.filtrosForm.value
    this.filtrosActivos = []

    const labels: Record<string, string> = {
      categoria: "Categoría",
      municipalidad: "Municipalidad",
      comunidad: "Comunidad",
      fecha_desde: "Fecha Desde",
      fecha_hasta: "Fecha Hasta",
      tipo_servicio: "Tipo de Servicio",
      precio_min: "Precio Mínimo",
      precio_max: "Precio Máximo",
      facilidades_discapacidad: "Facilidades Discapacidad",
    }

    Object.keys(formValue).forEach((key) => {
      const value = formValue[key]
      if (value !== null && value !== "" && value !== undefined) {
        let displayValue = value
        if (key === "facilidades_discapacidad") {
          displayValue = value === "true" ? "Sí" : "No"
        }

        this.filtrosActivos.push({
          key,
          label: labels[key] || key,
          value: displayValue,
        })
      }
    })
  }
}
