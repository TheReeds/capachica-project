export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

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
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

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

export interface Emprendedor {
  id: number;
  nombre: string;
  tipo_servicio: string;
  descripcion: string;
  ubicacion: string;
  telefono: string;
  email: string;
  pagina_web?: string;
  horario_atencion: string;
  precio_rango: string;
  metodos_pago: string[];
  capacidad_aforo: number;
  numero_personas_atiende: number;
  categoria: string;
  certificaciones: string[];
  idiomas_hablados: string[];
  facilidades_discapacidad: boolean;
  estado: boolean;
  created_at: string;
  asociacion_id: number;
  municipalidad: string;
  comunidad: string;
  servicios_count: number;
  reservas_mes: number;
}

export interface Asociacion {
  nombre: string;
  comunidad: string;
  municipalidad: string;
}
