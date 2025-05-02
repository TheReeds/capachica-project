export interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    precio_referencial: string;
    emprendedor_id: number; 
    [key: string]: any;
  }
  