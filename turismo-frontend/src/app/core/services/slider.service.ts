import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  private apiUrl = 'http://localhost:8000/api/sliders'; // Ajusta la URL

  constructor(private http: HttpClient) { }

  // Crear un nuevo slider con imagen
  createSlider(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  // Otros métodos de tu CRUD (editar, listar, eliminar, etc.)
}
