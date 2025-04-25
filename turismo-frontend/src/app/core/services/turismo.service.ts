import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface Municipalidad {
  id?: number;
  nombre: string;
  descripcion: string;
  red_facebook?: string;
  red_instagram?: string;
  red_youtube?: string;
  coordenadas_x?: number;
  coordenadas_y?: number;
  frase?: string;
  comunidades?: string;
  historiafamilias?: string;
  historiacapachica?: string;
  comite?: string;
  mision?: string;
  vision?: string;
  valores?: string;
  ordenanzamunicipal?: string;
  alianzas?: string;
  correo?: string;
  horariodeatencion?: string;
  created_at?: string;
  updated_at?: string;
  asociaciones?: Asociacion[];
}

export interface Asociacion {
  id?: number;
  nombre: string;
  descripcion: string;
  ubicacion?: string;
  telefono?: string;
  email?: string;
  municipalidad_id: number;
  estado?: boolean;
  created_at?: string;
  updated_at?: string;
  municipalidad?: Municipalidad;
  emprendedores?: Emprendedor[];
}

export interface Emprendedor {
  id?: number;
  nombre: string;
  tipo_servicio: string;
  descripcion: string;
  ubicacion: string;
  telefono: string;
  email: string;
  pagina_web?: string;
  horario_atencion?: string;
  precio_rango?: string;
  metodos_pago?: string[];
  capacidad_aforo?: number;
  numero_personas_atiende?: number;
  comentarios_resenas?: string;
  imagenes?: string[];
  categoria: string;
  certificaciones?: string[];
  idiomas_hablados?: string[];
  opciones_acceso?: string;
  facilidades_discapacidad?: boolean;
  asociacion_id?: number;
  created_at?: string;
  updated_at?: string;
  asociacion?: Asociacion;
  servicios?: Servicio[];
}

export interface Servicio {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio_referencial?: number;
  emprendedor_id: number;
  estado?: boolean;
  created_at?: string;
  updated_at?: string;
  emprendedor?: Emprendedor;
  categorias?: Categoria[];
}

export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  icono_url?: string;
  created_at?: string;
  updated_at?: string;
  servicios?: Servicio[];
}

export interface Reserva {
  id?: number;
  nombre: string;
  fecha: string;
  descripcion?: string;
  redes_url?: string;
  tipo: string;
  created_at?: string;
  updated_at?: string;
  emprendedores?: Emprendedor[];
}

export interface ReservaDetalle {
  id?: number;
  reserva_id: number;
  emprendedor_id: number;
  descripcion: string;
  cantidad: number;
  created_at?: string;
  updated_at?: string;
  reserva?: Reserva;
  emprendedor?: Emprendedor;
}

@Injectable({
  providedIn: 'root'
})
export class TurismoService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  // Municipalidad
  getMunicipalidades(): Observable<Municipalidad[]> {
    return this.http.get<{ success: boolean, data: Municipalidad[] }>(`${this.API_URL}/municipalidad`)
      .pipe(map(response => response.data));
  }

  getMunicipalidad(id: number): Observable<Municipalidad> {
    return this.http.get<{ success: boolean, data: Municipalidad }>(`${this.API_URL}/municipalidad/${id}`)
      .pipe(map(response => response.data));
  }

  getMunicipalidadWithAsociaciones(id: number): Observable<Municipalidad> {
    return this.http.get<{ success: boolean, data: Municipalidad }>(`${this.API_URL}/municipalidad/${id}/asociaciones`)
      .pipe(map(response => response.data));
  }

  getMunicipalidadWithAsociacionesAndEmprendedores(id: number): Observable<Municipalidad> {
    return this.http.get<{ success: boolean, data: Municipalidad }>(`${this.API_URL}/municipalidad/${id}/asociaciones/emprendedores`)
      .pipe(map(response => response.data));
  }

  createMunicipalidad(municipalidad: Municipalidad): Observable<Municipalidad> {
    return this.http.post<{ success: boolean, data: Municipalidad }>(`${this.API_URL}/municipalidad`, municipalidad)
      .pipe(map(response => response.data));
  }

  updateMunicipalidad(id: number, municipalidad: Municipalidad): Observable<Municipalidad> {
    return this.http.put<{ success: boolean, data: Municipalidad }>(`${this.API_URL}/municipalidad/${id}`, municipalidad)
      .pipe(map(response => response.data));
  }

  deleteMunicipalidad(id: number): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.API_URL}/municipalidad/${id}`);
  }

  // Asociaciones
  getAsociaciones(page: number = 1, perPage: number = 10): Observable<PaginatedResponse<Asociacion>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<{ success: boolean, data: PaginatedResponse<Asociacion> }>(`${this.API_URL}/asociaciones`, { params })
      .pipe(map(response => response.data));
  }

  getAsociacion(id: number): Observable<Asociacion> {
    return this.http.get<{ success: boolean, data: Asociacion }>(`${this.API_URL}/asociaciones/${id}`)
      .pipe(map(response => response.data));
  }

  getAsociacionesByMunicipalidad(municipalidadId: number): Observable<Asociacion[]> {
    return this.http.get<{ success: boolean, data: Asociacion[] }>(`${this.API_URL}/asociaciones/municipalidad/${municipalidadId}`)
      .pipe(map(response => response.data));
  }

  getEmprendedoresByAsociacion(asociacionId: number): Observable<Emprendedor[]> {
    return this.http.get<{ success: boolean, data: Emprendedor[] }>(`${this.API_URL}/asociaciones/${asociacionId}/emprendedores`)
      .pipe(map(response => response.data));
  }

  createAsociacion(asociacion: Asociacion): Observable<Asociacion> {
    return this.http.post<{ success: boolean, data: Asociacion, message: string }>(`${this.API_URL}/asociaciones`, asociacion)
      .pipe(map(response => response.data));
  }

  updateAsociacion(id: number, asociacion: Asociacion): Observable<Asociacion> {
    return this.http.put<{ success: boolean, data: Asociacion, message: string }>(`${this.API_URL}/asociaciones/${id}`, asociacion)
      .pipe(map(response => response.data));
  }

  deleteAsociacion(id: number): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.API_URL}/asociaciones/${id}`);
  }

  // Emprendedores
  getEmprendedores(page: number = 1, perPage: number = 10): Observable<PaginatedResponse<Emprendedor>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<{ status: string, data: PaginatedResponse<Emprendedor> }>(`${this.API_URL}/emprendedores`, { params })
      .pipe(map(response => response.data));
  }

  getEmprendedor(id: number): Observable<Emprendedor> {
    return this.http.get<{ status: string, data: Emprendedor }>(`${this.API_URL}/emprendedores/${id}`)
      .pipe(map(response => response.data));
  }

  getEmprendedoresByCategoria(categoria: string): Observable<Emprendedor[]> {
    return this.http.get<{ status: string, data: Emprendedor[] }>(`${this.API_URL}/emprendedores/categoria/${categoria}`)
      .pipe(map(response => response.data));
  }

  searchEmprendedores(query: string): Observable<Emprendedor[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<{ status: string, data: Emprendedor[] }>(`${this.API_URL}/emprendedores/search`, { params })
      .pipe(map(response => response.data));
  }

  getServiciosByEmprendedor(emprendedorId: number): Observable<Servicio[]> {
    return this.http.get<{ status: string, data: Servicio[] }>(`${this.API_URL}/emprendedores/${emprendedorId}/servicios`)
      .pipe(map(response => response.data));
  }

  getReservasByEmprendedor(emprendedorId: number): Observable<Reserva[]> {
    return this.http.get<{ status: string, data: Reserva[] }>(`${this.API_URL}/emprendedores/${emprendedorId}/reservas`)
      .pipe(map(response => response.data));
  }

  createEmprendedor(emprendedor: Emprendedor): Observable<Emprendedor> {
    return this.http.post<{ success: boolean, data: Emprendedor, message: string }>(`${this.API_URL}/emprendedores`, emprendedor)
      .pipe(map(response => response.data));
  }

  updateEmprendedor(id: number, emprendedor: Emprendedor): Observable<Emprendedor> {
    return this.http.put<{ success: boolean, data: Emprendedor, message: string }>(`${this.API_URL}/emprendedores/${id}`, emprendedor)
      .pipe(map(response => response.data));
  }

  deleteEmprendedor(id: number): Observable<any> {
    return this.http.delete<{ status: string, message: string }>(`${this.API_URL}/emprendedores/${id}`);
  }

  // Servicios
  getServicios(page: number = 1, perPage: number = 10): Observable<PaginatedResponse<Servicio>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<{ success: boolean, data: PaginatedResponse<Servicio> }>(`${this.API_URL}/servicios`, { params })
      .pipe(map(response => response.data));
  }

  getServicio(id: number): Observable<Servicio> {
    return this.http.get<{ success: boolean, data: Servicio }>(`${this.API_URL}/servicios/${id}`)
      .pipe(map(response => response.data));
  }

  getServiciosByCategoria(categoriaId: number): Observable<Servicio[]> {
    return this.http.get<{ success: boolean, data: Servicio[] }>(`${this.API_URL}/servicios/categoria/${categoriaId}`)
      .pipe(map(response => response.data));
  }

  createServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.post<{ success: boolean, data: Servicio, message: string }>(`${this.API_URL}/servicios`, servicio)
      .pipe(map(response => response.data));
  }

  updateServicio(id: number, servicio: Servicio): Observable<Servicio> {
    return this.http.put<{ success: boolean, data: Servicio, message: string }>(`${this.API_URL}/servicios/${id}`, servicio)
      .pipe(map(response => response.data));
  }

  deleteServicio(id: number): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.API_URL}/servicios/${id}`);
  }

  // Categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<{ success: boolean, data: Categoria[] }>(`${this.API_URL}/categorias`)
      .pipe(map(response => response.data));
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<{ success: boolean, data: Categoria }>(`${this.API_URL}/categorias/${id}`)
      .pipe(map(response => response.data));
  }

  createCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<{ success: boolean, data: Categoria, message: string }>(`${this.API_URL}/categorias`, categoria)
      .pipe(map(response => response.data));
  }

  updateCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<{ success: boolean, data: Categoria, message: string }>(`${this.API_URL}/categorias/${id}`, categoria)
      .pipe(map(response => response.data));
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.API_URL}/categorias/${id}`);
  }

  // Reservas
  getReservas(): Observable<Reserva[]> {
    return this.http.get<{ success: boolean, data: Reserva[] }>(`${this.API_URL}/reservas`)
      .pipe(map(response => response.data));
  }

  getReserva(id: number): Observable<Reserva> {
    return this.http.get<{ success: boolean, data: Reserva }>(`${this.API_URL}/reservas/${id}`)
      .pipe(map(response => response.data));
  }

  getEmprendedoresByReserva(reservaId: number): Observable<Emprendedor[]> {
    return this.http.get<{ success: boolean, data: Emprendedor[] }>(`${this.API_URL}/reservas/${reservaId}/emprendedores`)
      .pipe(map(response => response.data));
  }

  createReserva(reserva: Reserva): Observable<Reserva> {
    return this.http.post<{ success: boolean, data: Reserva, message: string }>(`${this.API_URL}reservas`, reserva)
      .pipe(map(response => response.data));
  }

  updateReserva(id: number, reserva: Reserva): Observable<Reserva> {
    return this.http.put<{ success: boolean, data: Reserva, message: string }>(`${this.API_URL}/reservas/${id}`, reserva)
      .pipe(map(response => response.data));
  }

  deleteReserva(id: number): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.API_URL}/reservas/${id}`);
  }

  // Detalles de Reserva
  getReservaDetalles(): Observable<ReservaDetalle[]> {
    return this.http.get<{ success: boolean, data: ReservaDetalle[] }>(`${this.API_URL}/reserva-detalles`)
      .pipe(map(response => response.data));
  }

  getReservaDetalle(id: number): Observable<ReservaDetalle> {
    return this.http.get<{ success: boolean, data: ReservaDetalle }>(`${this.API_URL}/reserva-detalles/${id}`)
      .pipe(map(response => response.data));
  }

  getReservaDetallesByReserva(reservaId: number): Observable<ReservaDetalle[]> {
    return this.http.get<{ success: boolean, data: ReservaDetalle[] }>(`${this.API_URL}/reserva-detalles/reserva/${reservaId}`)
      .pipe(map(response => response.data));
  }

  getReservaDetallesByEmprendedor(emprendedorId: number): Observable<ReservaDetalle[]> {
    return this.http.get<{ success: boolean, data: ReservaDetalle[] }>(`${this.API_URL}/reserva-detalles/emprendedor/${emprendedorId}`)
      .pipe(map(response => response.data));
  }

  createReservaDetalle(reservaDetalle: ReservaDetalle): Observable<ReservaDetalle> {
    return this.http.post<{ success: boolean, data: ReservaDetalle, message: string }>(`${this.API_URL}/reserva-detalles`, reservaDetalle)
      .pipe(map(response => response.data));
  }

  updateReservaDetalle(id: number, reservaDetalle: ReservaDetalle): Observable<ReservaDetalle> {
    return this.http.put<{ success: boolean, data: ReservaDetalle, message: string }>(`${this.API_URL}/reserva-detalles/${id}`, reservaDetalle)
      .pipe(map(response => response.data));
  }

  deleteReservaDetalle(id: number): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.API_URL}/reserva-detalles/${id}`);
  }
}