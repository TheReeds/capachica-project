import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  obtenerServicios(): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:8000/api/servicios');
  }
 

  obtenerCategorias(): Observable<any> {
    return this.http.get(`${this.API_URL}/categorias`);
  }

  obtenerMunicipalidad(): Observable<any> {
    return this.http.get(`${this.API_URL}/municipalidad`);
  }
  obtenerServiciosDeAlojamiento(): Observable<any> {
    return this.http.get('/api/servicios/categoria/1'); // 1 = ID de Alojamiento
  }
  obtenerServiciosPorCategoria(categoriaId: number): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/api/servicios/categoria/${categoriaId}`);
  }
  
  
}
