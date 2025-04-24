// src/app/core/services/emprendedor.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Emprendedor, EmprendedorDTO } from './emprendedor.model';
import { PaginatedResponse } from '../../core/services/admin.service';

@Injectable({
  providedIn: 'root'
})
export class EmprendedorService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  getEmprendedores(page: number = 1, perPage: number = 10, search?: string): Observable<PaginatedResponse<Emprendedor>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<{success: boolean, data: PaginatedResponse<Emprendedor>}>(`${this.API_URL}/emprendedores`, { params })
      .pipe(
        map(response => response.data)
      );
  }

  getEmprendedor(id: number): Observable<Emprendedor> {
    return this.http.get<{success: boolean, data: Emprendedor}>(`${this.API_URL}/emprendedores/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  createEmprendedor(emprendedor: EmprendedorDTO): Observable<Emprendedor> {
    return this.http.post<{success: boolean, data: Emprendedor}>(`${this.API_URL}/emprendedores`, emprendedor)
      .pipe(
        map(response => response.data)
      );
  }

  updateEmprendedor(id: number, emprendedor: EmprendedorDTO): Observable<Emprendedor> {
    return this.http.put<{success: boolean, data: Emprendedor}>(`${this.API_URL}/emprendedores/${id}`, emprendedor)
      .pipe(
        map(response => response.data)
      );
  }

  deleteEmprendedor(id: number): Observable<any> {
    return this.http.delete<{success: boolean, message: string}>(`${this.API_URL}/emprendedores/${id}`);
  }

  toggleEstado(id: number, estado: boolean): Observable<Emprendedor> {
    return this.http.patch<{success: boolean, data: Emprendedor}>(`${this.API_URL}/emprendedores/${id}/estado`, { estado })
      .pipe(
        map(response => response.data)
      );
  }
}