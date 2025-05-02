import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';

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
  imagenes: string[];
  categoria: string;
  certificaciones: string[];
  idiomas_hablados: string[];
  opciones_acceso: string[];
  facilidades_discapacidad: boolean;
  asociacion_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmprendedorService {
  private readonly API_URL = `${environment.apiUrl}/emprendedores`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }

  getAll(): Observable<Emprendedor[]> {
    return this.http.get<{ data: Emprendedor[] }>(this.API_URL, { headers: this.getHeaders() })
      .pipe(map(response => response.data));
  }

  getById(id: number): Observable<Emprendedor> {
    return this.http.get<Emprendedor>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }

  getWithRelations(id: number): Observable<Emprendedor> {
    return this.http.get<Emprendedor>(`${this.API_URL}/${id}/with-relations`, { headers: this.getHeaders() });
  }

  getByCategory(category: string): Observable<Emprendedor[]> {
    return this.http.get<{ data: Emprendedor[] }>(`${this.API_URL}/category/${category}`, { headers: this.getHeaders() })
      .pipe(map(response => response.data));
  }

  create(data: Emprendedor): Observable<Emprendedor> {
    return this.http.post<Emprendedor>(this.API_URL, data, { headers: this.getHeaders() });
  }

  update(id: number, data: Emprendedor): Observable<Emprendedor> {
    return this.http.put<Emprendedor>(`${this.API_URL}/${id}`, data, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }
}