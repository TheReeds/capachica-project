// home.model.ts
export interface Home {
  id: number;
  nombre: string;
  tipo_servicio: string;
  descripcion: string;
  ubicacion: string;
  telefono: string;
  email: string;
  pagina_web: string;
  horario_atencion: string;
  precio_rango: string;
  metodos_pago: string[];
  capacidad_aforo: number;
  numero_personas_atiende: number;
  comentarios_resenas: string;
  imagenes: string[];
  categoria: string;
  certificaciones: string[];
  idiomas_hablados: string[];
  opciones_acceso: string;
  facilidades_discapacidad: boolean;
  created_at: string;
  updated_at: string;
  asociacion: number;
}

export interface HomeDTO {
  nombre: string;
  tipo_servicio: string;
  descripcion: string;
  ubicacion: string;
  telefono: string;
  email: string;
  pagina_web: string;
  horario_atencion: string;
  precio_rango: string;
  metodos_pago: string[];
  capacidad_aforo: number;
  numero_personas_atiende: number;
  comentarios_resenas: string;
  imagenes: string[];
  categoria: string;
  certificaciones: string[];
  idiomas_hablados: string[];
  opciones_acceso: string;
  facilidades_discapacidad: boolean;
  created_at: string;
  updated_at: string;
  asociacion: number;
}

export interface Municipalidad {
  id: number;
  nombre: string;
  descripcion: string;
  red_facebook: string;
  red_instagram: string;
  red_youtube: string;
  coordenadas_x: number;
  coordenadas_y: number;
  frase: string;
  comunidades: string;
  historiafamilias: string;
  historiacapachica: string;
  comite: string;
  mision: string;
  vision: string;
  valores: string;
  ordenanzamunicipal: string;
  alianzas: string;
  correo: string;
  horariodeatencion: string;
  created_at: string;
  updated_at: string;
}

export interface Reserva {
  id: number;
  nombre: string;
  fecha: string;
  descripcion: string;
  redes_url: string;
  created_at: string;
  updated_at: string;
}

export interface ReservaDTO {
  id: number;
  nombre: string;
  fecha: string;
  descripcion: string;
  redes_url: string;
  created_at: string;
  updated_at: string;
}