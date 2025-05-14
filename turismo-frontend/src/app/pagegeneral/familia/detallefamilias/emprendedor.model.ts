// emprendedor.model.ts
export interface Emprendedor {
  id?: number;
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
  imagenes?: string;
  sliders_principales?: Slider[];
  sliders_secundarios?: Slider[];
  categoria: string;
  certificaciones: string | string[];
  idiomas_hablados: string[];
  opciones_acceso: string;
  facilidades_discapacidad: boolean;
  estado?: boolean;
  servicios?: Servicio[];
}

  
  export interface Slider {
    url: string;
    url_completa: string;
    nombre: string;
    es_principal: boolean;
    // otros campos según tu backend
  }

  export interface Servicio {
  nombre: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  precio_referencial: number;
  ubicacion_referencia: string;
  horarios?: Array<{
    id: number;
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
    activo: boolean;
  }>;
}

export interface Emprendedor {
  id?: number;
  nombre: string;
  descripcion: string;
  // ... otras propiedades ...
  servicios?: Servicio[]; 
  
}

  
  