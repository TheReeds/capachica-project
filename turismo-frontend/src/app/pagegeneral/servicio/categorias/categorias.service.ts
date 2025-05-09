import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = 'http://localhost:8000/api/categorias'; // actualiza esta URL

  constructor(private http: HttpClient) {}

  obtenerCategorias(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
