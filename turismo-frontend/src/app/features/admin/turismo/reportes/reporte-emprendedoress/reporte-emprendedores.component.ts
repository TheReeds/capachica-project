import { Component, OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import {
  ReportesService,
  type FiltrosReporte,
  type OpcionesReporte,
  type DatosFiltros,
  type PreviewReporte,
}from '../../../../../core/services/reportes.service';
import { LoadingSpinnerComponent } from "../../../../../shared/components/loading-spinner/loading-spinner.component"
import { FiltrosReporteComponent } from "../filtros-reporte/filtros-reporte.component"
import { PreviewReporteComponent } from "../preview-reporte/preview-reporte.component"
import { saveAs } from "file-saver"

@Component({
  selector: "app-reporte-emprendedores",
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, FiltrosReporteComponent, PreviewReporteComponent],
  templateUrl: "./reporte-emprendedores.component.html",
})
export class ReporteEmprendedoresComponent implements OnInit {
  private reportesService = inject(ReportesService)

  // Estados del componente
  loading$ = this.reportesService.loading$
  datosFiltros?: DatosFiltros
  filtrosActuales: FiltrosReporte = {}
  previewReporte?: PreviewReporte
  previsualizando = false
  generandoPDF = false
  errorMessage = ""

  // Opciones de reporte
  opcionesReporte: OpcionesReporte = {
    incluir_estadisticas: true,
    incluir_graficos: false,
    orientacion: "portrait",
  }

  // Información de la asociación (esto vendría del contexto de la aplicación)
  asociacion = {
    nombre: "Asociación Turística Capachica",
    comunidad: "Capachica",
    municipalidad: "Puno",
  }

  ngOnInit() {
    this.cargarDatosFiltros()
  }

  /**
   * Cargar datos para los filtros
   */
  async cargarDatosFiltros() {
    try {
      this.datosFiltros = await this.reportesService.obtenerDatosFiltros().toPromise()
    } catch (error) {
      console.error("Error al cargar datos de filtros:", error)
      this.mostrarError("Error al cargar los datos de filtros")
    }
  }

  /**
   * Manejar cambio de filtros
   */
  onFiltrosChange(filtros: FiltrosReporte) {
    this.filtrosActuales = filtros
    this.previewReporte = undefined // Limpiar preview anterior
  }

  /**
   * Previsualizar reporte
   */
  async onPrevisualizar(filtros: FiltrosReporte) {
    this.previsualizando = true
    this.errorMessage = ""

    try {
      this.previewReporte = await this.reportesService.previsualizarReporte(filtros).toPromise()
    } catch (error) {
      console.error("Error al previsualizar reporte:", error)
      this.mostrarError("Error al generar la previsualización")
    } finally {
      this.previsualizando = false
    }
  }

  /**
   * Generar y descargar PDF
   */
  async generarPDF() {
    if (!this.previewReporte || this.previewReporte.total_registros === 0) {
      this.mostrarError("No hay datos para generar el reporte. Aplique filtros y previsualice primero.")
      return
    }

    this.generandoPDF = true
    this.errorMessage = ""

    try {
      const pdfBlob = await this.reportesService
        .generarReportePDF(this.filtrosActuales, this.opcionesReporte)
        .toPromise()

      if (pdfBlob) {
        const fileName = this.generarNombreArchivo("pdf")
        saveAs(pdfBlob, fileName)
        this.mostrarExito("Reporte PDF generado exitosamente")
      }
    } catch (error) {
      console.error("Error al generar PDF:", error)
      this.mostrarError("Error al generar el reporte PDF")
    } finally {
      this.generandoPDF = false
    }
  }

  /**
   * Imprimir reporte
   */
  async imprimirReporte() {
    if (!this.previewReporte || this.previewReporte.total_registros === 0) {
      this.mostrarError("No hay datos para imprimir. Aplique filtros y previsualice primero.")
      return
    }

    try {
      const pdfBlob = await this.reportesService
        .generarReportePDF(this.filtrosActuales, { ...this.opcionesReporte, incluir_graficos: false })
        .toPromise()

      if (pdfBlob) {
        const pdfUrl = URL.createObjectURL(pdfBlob)
        const iframe = document.createElement("iframe")
        iframe.style.display = "none"
        iframe.src = pdfUrl

        iframe.onload = () => {
          setTimeout(() => {
            iframe.contentWindow?.print()
            setTimeout(() => {
              document.body.removeChild(iframe)
              URL.revokeObjectURL(pdfUrl)
            }, 100)
          }, 500)
        }

        document.body.appendChild(iframe)
      }
    } catch (error) {
      console.error("Error al imprimir:", error)
      this.mostrarError("Error al preparar el reporte para impresión")
    }
  }

  /**
   * Exportar a Excel (placeholder para futura implementación)
   */
  async exportarExcel() {
    this.mostrarError("La exportación a Excel estará disponible próximamente")
  }

  /**
   * Exportar a CSV (implementación básica)
   */
  exportarCSV() {
    if (!this.previewReporte?.muestra) {
      this.mostrarError("No hay datos para exportar")
      return
    }

    const csvData = this.previewReporte.muestra.map((emp) => ({
      Nombre: emp.nombre,
      "Tipo de Servicio": emp.tipo_servicio,
      Categoría: emp.categoria,
      Comunidad: emp.comunidad,
      Municipalidad: emp.municipalidad,
      Teléfono: emp.telefono || "",
      Email: emp.email || "",
      Precio: emp.precio_rango || "",
      Capacidad: emp.capacidad_aforo || 0,
      "Reservas/Mes": emp.reservas_mes || 0,
      Estado: emp.estado ? "Activo" : "Inactivo",
      Accesible: emp.facilidades_discapacidad ? "Sí" : "No",
    }))

    this.downloadAsCSV(csvData, this.generarNombreArchivo("csv"))
  }

  /**
   * Cambiar opciones del reporte
   */
  onOpcionesChange(opciones: Partial<OpcionesReporte>) {
    this.opcionesReporte = { ...this.opcionesReporte, ...opciones };
  }

  onIncluirEstadisticasChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.onOpcionesChange({ incluir_estadisticas: input.checked });
  }

  onIncluirGraficosChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.onOpcionesChange({ incluir_graficos: input.checked });
  }

  onOrientacionChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.onOpcionesChange({ orientacion: select.value as 'portrait' | 'landscape' });
  }

  /**
   * Utilidades privadas
   */
  private generarNombreArchivo(extension: string): string {
    const fecha = new Date().toISOString().split("T")[0]
    const asociacionSlug = this.asociacion.nombre.toLowerCase().replace(/\s+/g, "-")
    return `reporte-emprendedores-${asociacionSlug}-${fecha}.${extension}`
  }

  private downloadAsCSV(data: any[], filename: string): void {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header] || ""
            return typeof value === "string" && (value.includes(",") || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, filename)
  }

  private mostrarError(mensaje: string) {
    this.errorMessage = mensaje
    setTimeout(() => (this.errorMessage = ""), 5000)
  }

  private mostrarExito(mensaje: string) {
    // Implementar notificación de éxito (toast, snackbar, etc.)
    console.log("Éxito:", mensaje)
  }
}
