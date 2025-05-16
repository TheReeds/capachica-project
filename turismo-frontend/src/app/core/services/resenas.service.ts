import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../models/api.model';
import { Resena } from './emprendimientos.service';

@Injectable({
  providedIn: 'root'
})
export class ResenasService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  crearResena(data: FormData): Observable<ApiResponse<Resena>> {
    return this.http.post<ApiResponse<Resena>>(`${this.API_URL}/resenas`, data);
  }
}
