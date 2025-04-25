import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface Municipalidad {
  id?: number;
  nombre: string;
  descripcion: string;
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
  red_facebook?: string;
  red_instagram?: string;
  red_youtube?: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class MunicipalidadService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/municipalidad`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }

  getAll(): Observable<Municipalidad[]> {
    return this.http.get<{ data: Municipalidad[] }>(this.API_URL, { headers: this.getHeaders() })
      .pipe(map(response => response.data)); // Solo enviamos el array
  }

  getById(id: number): Observable<Municipalidad> {
    return this.http.get<Municipalidad>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }

  getWithRelations(id: number): Observable<Municipalidad> {
    return this.http.get<Municipalidad>(`${this.API_URL}/${id}/with-relations`, { headers: this.getHeaders() });
  }

  create(data: Municipalidad): Observable<Municipalidad> {
    return this.http.post<Municipalidad>(this.API_URL, data, { headers: this.getHeaders() });
  }

  update(id: number, data: Municipalidad): Observable<Municipalidad> {
    return this.http.put<Municipalidad>(`${this.API_URL}/${id}`, data, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }
}