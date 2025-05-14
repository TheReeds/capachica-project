export interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    latitud: number | string;
    longitud: number | string;
    precio_referencial: number | string;
    ubicacion_referencia: string;
    emprendedor_id: number;
    estado?: boolean;
    created_at?: string;
    updated_at?: string;
    horarios?: Horario[];
    categorias?: any[];
    sliders?: any[];
}

export interface Horario {
  id: number;
  servicio_id: number;
  dia_semana: string;
  hora_inicio: string; 
  hora_fin: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}