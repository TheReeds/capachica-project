import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, of, catchError, tap, map } from "rxjs";
import { Emprendedor } from "./emprendedor.model";
import { environment } from "../../../../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class EmprendedorService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;
  private useMockDataIfError = true;

  // Verificar conexión
  verificarConexion(): Observable<boolean> {
    return this.http.get<any>(`${this.API_URL}/check-connection`)
      .pipe(
        map(() => true),
        catchError(error => {
          console.error('Error de conexión:', error);
          return of(false);
        })
      );
  }

  // Obtener todos los emprendedores
  getAllEmprendedores(): Observable<Emprendedor[]> {
    return this.http.get<any>(`${this.API_URL}/emprendedores`).pipe(
      map(response => {
        const data = response?.data || [];

        data.forEach((e: any) => {
          try {
            e.imagenes = JSON.parse(e.imagenes || '[]');
          } catch {
            e.imagenes = [];
          }

          if (!e.sliders_secundarios) {
            e.sliders_secundarios = [];
          }
        });

        return data;
      }),
      catchError(error => {
        console.error('Error al obtener emprendedores:', error);
        return of([]);
      })
    );
  }

  // Obtener un emprendedor por ID
  getEmprendedorById(id: number): Observable<Emprendedor> {
    return this.http.get<{ success: boolean; data: Emprendedor }>(`${this.API_URL}/emprendedores/${id}`)
    
      .pipe(
        map(response => {
          const emprendedor = response.data;

          // Asegurar que las imágenes estén en arreglo
          try {
            emprendedor.imagenes = JSON.parse(emprendedor.imagenes || '[]');
          } catch {
            //emprendedor.imagenes = [];
          }

          if (!emprendedor.sliders_secundarios) {
            emprendedor.sliders_secundarios = [];
          }

          return emprendedor;
        }),
        catchError(error => {
          console.error(`Error al obtener emprendedor con ID ${id}:`, error);
          return of(null as any); // o puedes lanzar un error si prefieres
        })
      );
  }

  // (Opcional) Método alternativo si tienes otra URL o estructura
  getEmprendedores(): Observable<Emprendedor[]> {
    return this.http.get<any>(`${this.API_URL}/emprendedores`).pipe(
      map(res => res.data || [])
    );
  }
}
