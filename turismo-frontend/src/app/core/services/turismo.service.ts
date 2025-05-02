import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
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

export interface Slider {
  id?: number;
  url?: string;
  url_completa?: string;
  nombre: string;
  es_principal: boolean;
  tipo_entidad: string;
  entidad_id: number;
  orden: number;
  activo?: boolean;
  titulo?: string;
  descripcion?: string | {
    id?: number;
    slider_id?: number;
    titulo?: string;
    descripcion?: string;
    created_at?: string;
    updated_at?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface SliderDescription {
  id?: number;
  slider_id: number;
  titulo: string;
  descripcion: string;
  created_at?: string;
  updated_at?: string;
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
  sliders_principales?: Slider[];
  sliders_secundarios?: Slider[];
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
  opciones_acceso?: string[];
  facilidades_discapacidad?: boolean;
  asociacion_id?: number;
  created_at?: string;
  updated_at?: string;
  asociacion?: Asociacion;
  servicios?: Servicio[];
  slidersPrincipales?: Slider[];
  slidersSecundarios?: Slider[];
  // Añadir propiedades en snake_case para compatibilidad con la API
  sliders_principales?: Slider[];
  sliders_secundarios?: Slider[];
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
  sliders?: Slider[];
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

  // Método privado para manejar FormData con imágenes - corregido
  private prepareFormData(data: any): FormData {
    const formData = new FormData();
    
    // Añadir campos regulares
    Object.keys(data).forEach(key => {
      // Ignorar sliders, deleted_sliders, categorías, etc. que se manejarán por separado
      if (key !== 'sliders_principales' && key !== 'sliders_secundarios' && key !== 'sliders' && 
          key !== 'imagenes' && key !== 'categorias' && key !== 'deleted_sliders') {
        
        // Solo enviar campo si tiene un valor válido
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
          // Si es un array, añadir cada elemento con notación de array
          if (Array.isArray(data[key])) {
            data[key].forEach((item: any, index: number) => {
              formData.append(`${key}[]`, item.toString());
            });
          } else {
            formData.append(key, data[key]);
          }
        }
      }
    });
  
  // Manejar categorías (para servicios)
  if (data.categorias && Array.isArray(data.categorias) && data.categorias.length > 0) {
    data.categorias.forEach((cat: number) => {
      formData.append('categorias[]', cat.toString());
    });
  }
  
  // Manejar IDs de sliders eliminados
  if (data.deleted_sliders && Array.isArray(data.deleted_sliders) && data.deleted_sliders.length > 0) {
    data.deleted_sliders.forEach((id: number) => {
      formData.append('deleted_sliders[]', id.toString());
    });
  }
  
  // Manejar sliders principales
  if (data.sliders_principales && Array.isArray(data.sliders_principales) && data.sliders_principales.length > 0) {
    data.sliders_principales.forEach((slider: any, index: number) => {
      // Si tiene ID, incluirlo para actualización
      if (slider.id) {
        formData.append(`sliders_principales[${index}][id]`, slider.id.toString());
      }
      
      // Siempre incluir nombre y orden - campos obligatorios
      if (slider.nombre) {
        formData.append(`sliders_principales[${index}][nombre]`, slider.nombre);
      }
      
      if (slider.orden) {
        formData.append(`sliders_principales[${index}][orden]`, slider.orden.toString());
      }
      
      // Incluir imagen solo si es un archivo nuevo
      if (slider.imagen instanceof File) {
        formData.append(`sliders_principales[${index}][imagen]`, slider.imagen);
      }
      
      // Asegurar que el campo es_principal esté establecido correctamente
      formData.append(`sliders_principales[${index}][es_principal]`, 'true');
    });
  }
  
  // Manejar sliders secundarios
  if (data.sliders_secundarios && Array.isArray(data.sliders_secundarios) && data.sliders_secundarios.length > 0) {
    data.sliders_secundarios.forEach((slider: any, index: number) => {
      // Si tiene ID, incluirlo para actualización
      if (slider.id) {
        formData.append(`sliders_secundarios[${index}][id]`, slider.id.toString());
      }
      
      // Siempre incluir nombre y orden - campos obligatorios
      if (slider.nombre) {
        formData.append(`sliders_secundarios[${index}][nombre]`, slider.nombre);
      }
      
      if (slider.orden) {
        formData.append(`sliders_secundarios[${index}][orden]`, slider.orden.toString());
      }
      
      // Incluir imagen solo si es un archivo nuevo
      if (slider.imagen instanceof File) {
        formData.append(`sliders_secundarios[${index}][imagen]`, slider.imagen);
      }
      
      // Asegurar que el campo es_principal esté establecido correctamente
      formData.append(`sliders_secundarios[${index}][es_principal]`, 'false');
      
      // SIEMPRE incluir título y descripción para sliders secundarios, aunque sean cadenas vacías
      // Esto es necesario para la validación del backend
      formData.append(`sliders_secundarios[${index}][titulo]`, slider.titulo || '');
      formData.append(`sliders_secundarios[${index}][descripcion]`, slider.descripcion || '');
    });
  }
  
  // Manejar sliders genéricos (para servicios)
  if (data.sliders && Array.isArray(data.sliders) && data.sliders.length > 0) {
    data.sliders.forEach((slider: any, index: number) => {
      // Si tiene ID, incluirlo para actualización
      if (slider.id) {
        formData.append(`sliders[${index}][id]`, slider.id.toString());
      }
      
      // Campos obligatorios
      if (slider.nombre) {
        formData.append(`sliders[${index}][nombre]`, slider.nombre);
      }
      
      if (slider.orden) {
        formData.append(`sliders[${index}][orden]`, slider.orden.toString());
      }
      
      // Incluir es_principal si existe
      if (slider.es_principal !== undefined) {
        formData.append(`sliders[${index}][es_principal]`, slider.es_principal.toString());
      }
      
      // Incluir imagen solo si es un archivo nuevo
      if (slider.imagen instanceof File) {
        formData.append(`sliders[${index}][imagen]`, slider.imagen);
      }
      
      // Incluir título y descripción si existen
      if (slider.titulo !== undefined) {
        formData.append(`sliders[${index}][titulo]`, slider.titulo || '');
      }
      
      if (slider.descripcion !== undefined) {
        formData.append(`sliders[${index}][descripcion]`, slider.descripcion || '');
      }
    });
  }
  
    return formData;
  }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }
  
  private getSimpleHeaders(): HttpHeaders {
    return this.getHeaders().set('Content-Type', 'application/json');
  }

  // Municipalidad
  getMunicipalidades(): Observable<Municipalidad[]> {
    return this.http.get<{ success: boolean, data: Municipalidad[] }>(`${this.API_URL}/municipalidad`, 
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getMunicipalidad(id: number): Observable<Municipalidad> {
    return this.http.get<{ success: boolean, data: Municipalidad }>(`${this.API_URL}/municipalidad/${id}`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getMunicipalidadWithAsociaciones(id: number): Observable<Municipalidad> {
    return this.http.get<{ success: boolean, data: Municipalidad }>(`${this.API_URL}/municipalidad/${id}/asociaciones`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getMunicipalidadWithAsociacionesAndEmprendedores(id: number): Observable<Municipalidad> {
    return this.http.get<{ success: boolean, data: Municipalidad }>(`${this.API_URL}/municipalidad/${id}/asociaciones/emprendedores`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  createMunicipalidad(municipalidad: Municipalidad): Observable<Municipalidad> {
    const formData = this.prepareFormData(municipalidad);
    return this.http.post<{ success: boolean, data: Municipalidad }>(`${this.API_URL}/municipalidad`, formData,
      { headers: this.getHeaders() })
      .pipe(map(response => response.data));
  }

  updateMunicipalidad(id: number, municipalidad: Municipalidad): Observable<Municipalidad> {
    const formData = this.prepareFormData(municipalidad);
    // Añadir el método PUT usando _method
    formData.append('_method', 'PUT');
    return this.http.post<{ success: boolean, data: Municipalidad }>(`${this.API_URL}/municipalidad/${id}`, formData,
      { headers: this.getHeaders() })
      .pipe(map(response => response.data));
  }

  deleteMunicipalidad(id: number): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.API_URL}/municipalidad/${id}`,
      { headers: this.getSimpleHeaders() });
  }

  // Asociaciones
  getAsociaciones(page: number = 1, perPage: number = 10): Observable<PaginatedResponse<Asociacion>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<{ success: boolean, data: PaginatedResponse<Asociacion> }>(`${this.API_URL}/asociaciones`, 
      { params, headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getAsociacion(id: number): Observable<Asociacion> {
    return this.http.get<{ success: boolean, data: Asociacion }>(`${this.API_URL}/asociaciones/${id}`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getAsociacionesByMunicipalidad(municipalidadId: number): Observable<Asociacion[]> {
    return this.http.get<{ success: boolean, data: Asociacion[] }>(`${this.API_URL}/asociaciones/municipalidad/${municipalidadId}`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getEmprendedoresByAsociacion(asociacionId: number): Observable<Emprendedor[]> {
    return this.http.get<{ success: boolean, data: Emprendedor[] }>(`${this.API_URL}/asociaciones/${asociacionId}/emprendedores`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  createAsociacion(asociacion: Asociacion): Observable<Asociacion> {
    const formData = this.prepareFormData(asociacion);
    return this.http.post<{ success: boolean, data: Asociacion, message: string }>(`${this.API_URL}/asociaciones`, formData,
      { headers: this.getHeaders() })
      .pipe(map(response => response.data));
  }

  updateAsociacion(id: number, asociacion: Asociacion): Observable<Asociacion> {
    const formData = this.prepareFormData(asociacion);
    formData.append('_method', 'PUT');
    return this.http.post<{ success: boolean, data: Asociacion, message: string }>(`${this.API_URL}/asociaciones/${id}`, formData,
      { headers: this.getHeaders() })
      .pipe(map(response => response.data));
  }

  deleteAsociacion(id: number): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.API_URL}/asociaciones/${id}`,
      { headers: this.getSimpleHeaders() });
  }

  // Emprendedores
  getEmprendedores(page: number = 1, perPage: number = 10): Observable<PaginatedResponse<Emprendedor>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<{ status: string, data: PaginatedResponse<Emprendedor> }>(`${this.API_URL}/emprendedores`, 
      { params, headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getEmprendedor(id: number): Observable<Emprendedor> {
    return this.http.get<{ status?: string, success?: boolean, data: any }>(`${this.API_URL}/emprendedores/${id}`,
      { headers: this.getSimpleHeaders() })
      .pipe(
        map(response => {
          const data = response.data;
          // Mapear propiedades snake_case a camelCase
          if (data.sliders_principales) {
            data.slidersPrincipales = data.sliders_principales;
          }
          if (data.sliders_secundarios) {
            data.slidersSecundarios = data.sliders_secundarios;
          }
          return data as Emprendedor;
        })
      );
  }

  getEmprendedoresByCategoria(categoria: string): Observable<Emprendedor[]> {
    return this.http.get<{ status: string, data: Emprendedor[] }>(`${this.API_URL}/emprendedores/categoria/${categoria}`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  searchEmprendedores(query: string): Observable<Emprendedor[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<{ status: string, data: Emprendedor[] }>(`${this.API_URL}/emprendedores/search`, 
      { params, headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getServiciosByEmprendedor(emprendedorId: number): Observable<Servicio[]> {
    return this.http.get<{ status: string, data: Servicio[] }>(`${this.API_URL}/emprendedores/${emprendedorId}/servicios`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getReservasByEmprendedor(emprendedorId: number): Observable<Reserva[]> {
    return this.http.get<{ status: string, data: Reserva[] }>(`${this.API_URL}/emprendedores/${emprendedorId}/reservas`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  createEmprendedor(emprendedor: Emprendedor): Observable<Emprendedor> {
    const formData = this.prepareFormData(emprendedor);
    return this.http.post<{ success: boolean, data: Emprendedor, message: string }>(`${this.API_URL}/emprendedores`, formData,
      { headers: this.getHeaders() })
      .pipe(map(response => response.data));
  }

  updateEmprendedor(id: number, emprendedor: Emprendedor): Observable<Emprendedor> {
    const formData = this.prepareFormData(emprendedor);
    formData.append('_method', 'PUT');
    return this.http.post<{ success: boolean, data: Emprendedor, message: string }>(`${this.API_URL}/emprendedores/${id}`, formData,
      { headers: this.getHeaders() })
      .pipe(map(response => response.data));
  }

  deleteEmprendedor(id: number): Observable<any> {
    return this.http.delete<{ status: string, message: string }>(`${this.API_URL}/emprendedores/${id}`,
      { headers: this.getSimpleHeaders() });
  }

  // Servicios
  getServicios(page: number = 1, perPage: number = 10): Observable<PaginatedResponse<Servicio>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<{ success: boolean, data: PaginatedResponse<Servicio> }>(`${this.API_URL}/servicios`, 
      { params, headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getServicio(id: number): Observable<Servicio> {
    return this.http.get<{ success: boolean, data: Servicio }>(`${this.API_URL}/servicios/${id}`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getServiciosByCategoria(categoriaId: number): Observable<Servicio[]> {
    return this.http.get<{ success: boolean, data: Servicio[] }>(`${this.API_URL}/servicios/categoria/${categoriaId}`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  createServicio(servicio: Servicio): Observable<Servicio> {
    const formData = this.prepareFormData(servicio);
    return this.http.post<{ success: boolean, data: Servicio, message: string }>(`${this.API_URL}/servicios`, formData,
      { headers: this.getHeaders() })
      .pipe(map(response => response.data));
  }

  updateServicio(id: number, servicio: Servicio): Observable<Servicio> {
    const formData = this.prepareFormData(servicio);
    formData.append('_method', 'PUT');
    return this.http.post<{ success: boolean, data: Servicio, message: string }>(`${this.API_URL}/servicios/${id}`, formData,
      { headers: this.getHeaders() })
      .pipe(map(response => response.data));
  }

  deleteServicio(id: number): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.API_URL}/servicios/${id}`,
      { headers: this.getSimpleHeaders() });
  }

  // Sliders
  getSliders(page: number = 1, perPage: number = 10, filters?: any): Observable<PaginatedResponse<Slider>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    
    if (filters) {
      if (filters.tipo_entidad) params = params.set('tipo_entidad', filters.tipo_entidad);
      if (filters.entidad_id) params = params.set('entidad_id', filters.entidad_id.toString());
      if (filters.es_principal !== undefined) params = params.set('es_principal', filters.es_principal.toString());
      if (filters.with_descripcion !== undefined) params = params.set('with_descripcion', filters.with_descripcion.toString());
    }

    return this.http.get<{ success: boolean, data: PaginatedResponse<Slider> }>(`${this.API_URL}/sliders`, 
      { params, headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getSlidersByEntidad(tipo: string, id: number, withDescripcion: boolean = true): Observable<{principales: Slider[], secundarios: Slider[]}> {
    const params = new HttpParams().set('with_descripcion', withDescripcion.toString());
    return this.http.get<{ success: boolean, data: {principales: Slider[], secundarios: Slider[]} }>(
      `${this.API_URL}/sliders/entidad/${tipo}/${id}`, { params, headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getSlider(id: number): Observable<Slider> {
    return this.http.get<{ success: boolean, data: Slider }>(`${this.API_URL}/sliders/${id}`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  createSlider(slider: Slider, file: File): Observable<Slider> {
    const formData = new FormData();
    Object.keys(slider).forEach(key => {
      if (key !== 'imagen') {
        formData.append(key, slider[key as keyof Slider]?.toString() || '');
      }
    });
    formData.append('imagen', file);

    return this.http.post<{ success: boolean, data: Slider, message: string }>(`${this.API_URL}/sliders`, formData,
      { headers: this.getHeaders() })
      .pipe(map(response => response.data));
  }

  updateSlider(id: number, slider: Slider, file?: File): Observable<Slider> {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    
    Object.keys(slider).forEach(key => {
      if (key !== 'imagen') {
        formData.append(key, slider[key as keyof Slider]?.toString() || '');
      }
    });
    
    if (file) {
      formData.append('imagen', file);
    }

    return this.http.post<{ success: boolean, data: Slider, message: string }>(`${this.API_URL}/sliders/${id}`, formData,
      { headers: this.getHeaders() })
      .pipe(map(response => response.data));
  }

  deleteSlider(id: number): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.API_URL}/sliders/${id}`,
      { headers: this.getSimpleHeaders() });
  }

  createMultipleSliders(tipo_entidad: string, entidad_id: number, sliders: any[]): Observable<Slider[]> {
    const formData = new FormData();
    formData.append('tipo_entidad', tipo_entidad);
    formData.append('entidad_id', entidad_id.toString());
    
    sliders.forEach((slider, index) => {
      Object.keys(slider).forEach(key => {
        if (key === 'imagen' && slider[key] instanceof File) {
          formData.append(`sliders[${index}][imagen]`, slider[key]);
        } else if (key !== 'imagen') {
          formData.append(`sliders[${index}][${key}]`, slider[key]?.toString() || '');
        }
      });
    });

    return this.http.post<{ success: boolean, data: Slider[], message: string }>(`${this.API_URL}/sliders/multiple`, formData,
      { headers: this.getHeaders() })
      .pipe(map(response => response.data));
  }

  // Categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<{ success: boolean, data: Categoria[] }>(`${this.API_URL}/categorias`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<{ success: boolean, data: Categoria }>(`${this.API_URL}/categorias/${id}`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  createCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<{ success: boolean, data: Categoria, message: string }>(`${this.API_URL}/categorias`, categoria,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  updateCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<{ success: boolean, data: Categoria, message: string }>(`${this.API_URL}/categorias/${id}`, categoria,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.API_URL}/categorias/${id}`,
      { headers: this.getSimpleHeaders() });
  }

  // Reservas
  getReservas(): Observable<Reserva[]> {
    return this.http.get<{ success: boolean, data: Reserva[] }>(`${this.API_URL}/reservas`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getReserva(id: number): Observable<Reserva> {
    return this.http.get<{ success: boolean, data: Reserva }>(`${this.API_URL}/reservas/${id}`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getEmprendedoresByReserva(reservaId: number): Observable<Emprendedor[]> {
    return this.http.get<{ success: boolean, data: Emprendedor[] }>(`${this.API_URL}/reservas/${reservaId}/emprendedores`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  createReserva(reserva: Reserva): Observable<Reserva> {
    return this.http.post<{ success: boolean, data: Reserva, message: string }>(`${this.API_URL}/reservas`, reserva,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  updateReserva(id: number, reserva: Reserva): Observable<Reserva> {
    return this.http.put<{ success: boolean, data: Reserva, message: string }>(`${this.API_URL}/reservas/${id}`, reserva,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  deleteReserva(id: number): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.API_URL}/reservas/${id}`,
      { headers: this.getSimpleHeaders() });
  }

  // Detalles de Reserva
  getReservaDetalles(): Observable<ReservaDetalle[]> {
    return this.http.get<{ success: boolean, data: ReservaDetalle[] }>(`${this.API_URL}/reserva-detalles`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getReservaDetalle(id: number): Observable<ReservaDetalle> {
    return this.http.get<{ success: boolean, data: ReservaDetalle }>(`${this.API_URL}/reserva-detalles/${id}`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getReservaDetallesByReserva(reservaId: number): Observable<ReservaDetalle[]> {
    return this.http.get<{ success: boolean, data: ReservaDetalle[] }>(`${this.API_URL}/reserva-detalles/reserva/${reservaId}`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  getReservaDetallesByEmprendedor(emprendedorId: number): Observable<ReservaDetalle[]> {
    return this.http.get<{ success: boolean, data: ReservaDetalle[] }>(`${this.API_URL}/reserva-detalles/emprendedor/${emprendedorId}`,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  createReservaDetalle(reservaDetalle: ReservaDetalle): Observable<ReservaDetalle> {
    return this.http.post<{ success: boolean, data: ReservaDetalle, message: string }>(`${this.API_URL}/reserva-detalles`, reservaDetalle,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  updateReservaDetalle(id: number, reservaDetalle: ReservaDetalle): Observable<ReservaDetalle> {
    return this.http.put<{ success: boolean, data: ReservaDetalle, message: string }>(`${this.API_URL}/reserva-detalles/${id}`, reservaDetalle,
      { headers: this.getSimpleHeaders() })
      .pipe(map(response => response.data));
  }

  deleteReservaDetalle(id: number): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.API_URL}/reserva-detalles/${id}`,
      { headers: this.getSimpleHeaders() });
  }
}