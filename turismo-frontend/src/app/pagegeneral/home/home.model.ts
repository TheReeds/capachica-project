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
