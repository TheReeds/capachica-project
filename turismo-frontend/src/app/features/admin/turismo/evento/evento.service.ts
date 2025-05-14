import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environments';

@Injectable({
  providedIn: 'root'  // Esto asegura que el servicio esté disponible a nivel global.
})
export class EventoService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método para obtener todos los eventos
  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  // Método para obtener un evento específico por su ID
  getEventoById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  // Método para crear un nuevo evento
  createEvento(evento: any): Observable<any> {
    return this.http.post<any>(this.API_URL, evento);
  }

  // Método para actualizar un evento
  updateEvento(id: string, evento: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, evento);
  }

  // Método para eliminar un evento
  deleteEvento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
