import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environments';
import {BehaviorSubject, catchError, Observable, tap} from 'rxjs';
import {map} from 'rxjs/operators';

export interface FiltrosReporte {
  categoria?: string
  municipalidad?: string
  comunidad?: string
  asociacion_id?: number
  fecha_desde?: string
  fecha_hasta?: string
  facilidades_discapacidad?: boolean
  tipo_servicio?: string
  precio_min?: number
  precio_max?: number
}

export interface OpcionesReporte {
  formato?: "pdf" | "excel"
  incluir_estadisticas?: boolean
  incluir_graficos?: boolean
  orientacion?: "portrait" | "landscape"
}

export interface DatosFiltros {
  categorias: string[]
  municipalidades: string[]
  comunidades: string[]
}

export interface PreviewReporte {
  total_registros: number
  estadisticas: any
  muestra: any[]
  filtros_aplicados: FiltrosReporte
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  errors?: any
}

@Injectable({
  providedIn: "root",
})
export class ReportesService {
  private readonly baseUrl = `${environment.apiUrl}/reportes/emprendedores`
  private loadingSubject = new BehaviorSubject<boolean>(false)
  public loading$ = this.loadingSubject.asObservable()

  constructor(private http: HttpClient) {}

  /**
   * Generar reporte PDF
   */
  generarReportePDF(filtros: FiltrosReporte = {}, opciones: OpcionesReporte = {}): Observable<Blob> {
    this.setLoading(true)

    const body = {
      ...filtros,
      ...opciones,
      formato: "pdf",
    }

    const headers = new HttpHeaders({
      Accept: "application/pdf",
    })

    return this.http
      .post(`${this.baseUrl}/pdf`, body, {
        headers,
        responseType: "blob",
      })
      .pipe(
        map((response: Blob) => {
          this.setLoading(false)
          return response
        }),
        catchError((error) => {
          this.setLoading(false)
          throw error
        }),
      )
  }

  /**
   * Obtener datos para filtros
   */
  obtenerDatosFiltros(): Observable<DatosFiltros> {
    return this.http.get<ApiResponse<DatosFiltros>>(`${this.baseUrl}/filtros`).pipe(map((response) => response.data))
  }

  /**
   * Previsualizar reporte
   */
  previsualizarReporte(filtros: FiltrosReporte = {}): Observable<PreviewReporte> {
    this.setLoading(true)

    return this.http.post<ApiResponse<PreviewReporte>>(`${this.baseUrl}/preview`, filtros).pipe(
      map((response) => {
        this.setLoading(false)
        return response.data
      }),
      catchError((error) => {
        this.setLoading(false)
        throw error
      }),
    )
  }

  /**
   * Generar reporte Excel (futuro)
   */
  generarReporteExcel(filtros: FiltrosReporte = {}): Observable<Blob> {
    this.setLoading(true)

    const body = {
      ...filtros,
      formato: "excel",
    }

    return this.http
      .post(`${this.baseUrl}/excel`, body, {
        responseType: "blob",
      })
      .pipe(
        map((response: Blob) => {
          this.setLoading(false)
          return response
        }),
        catchError((error) => {
          this.setLoading(false)
          throw error
        }),
      )
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading)
  }
}
