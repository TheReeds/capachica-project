export interface Emprendedor {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    descripcion: string;
    estado: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface EmprendedorDTO {
    nombre: string;
    email: string;
    telefono: string;
    descripcion: string;
    estado: boolean;
  }