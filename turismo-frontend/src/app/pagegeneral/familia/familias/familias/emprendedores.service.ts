import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environments";
import { Observable, of, catchError, tap, map } from "rxjs";
import { Emprendedor } from "./emprendedor.model";

@Injectable({
  providedIn: 'root'
})
export class EmprendedorService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;
  private useMockDataIfError = true; // Usa datos mock en caso de error

  // Verificar conexión a la base de datos
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
    return this.http.get<any>(`${this.API_URL}/emprendedores`)
      .pipe(
        tap(response => {
          console.log('Respuesta original de la API:', response);
        }),
        map(response => this.procesarRespuestaAPI(response)),
        catchError(error => {
          console.error('Error al obtener emprendedores:', error);
          
          // Si hay error y está habilitado usar datos mock
          if (this.useMockDataIfError) {
            console.log('Usando datos mock debido al error');
            return of(EMPRENDEDORES_MOCK);
          }
          
          return of([]);
        })
      );
  }

  // Obtener un emprendedor único (como objeto)
  getEmprendedores(): Observable<Emprendedor[]> {
    return this.http.get<any>('URL_BACKEND/emprendedores').pipe(
      map(res => {
        return res.data || []; // Asume que viene como { data: [ ... ] }
      })
    );
  }
  

  // Procesar la respuesta de la API para manejar diferentes formatos
  private procesarRespuestaAPI(response: any): Emprendedor[] {
    if (!response) {
      console.log('La respuesta está vacía');
      return [];
    }

    if (Array.isArray(response)) {
      console.log('La respuesta ya es un array con', response.length, 'elementos');
      return response;
    }

    if (typeof response === 'object') {
      console.log('La respuesta es un objeto, intentando extraer array');
      const posiblesPropiedades = ['data', 'emprendedores', 'results', 'items', 'content'];
      for (const prop of posiblesPropiedades) {
        if (response[prop] && Array.isArray(response[prop])) {
          console.log(`Array encontrado en la propiedad '${prop}' con ${response[prop].length} elementos`);
          return response[prop];
        }
      }

      if ('nombre' in response) {
        console.log('La respuesta es un único emprendedor');
        return [response];
      }

      const values = Object.values(response);
      if (values.length > 0 && values.every(v => typeof v === 'object' && v !== null)) {
        console.log('La respuesta parece un diccionario de objetos');
        return values as Emprendedor[];
      }
    }

    console.log('No se pudo determinar el formato de la respuesta');
    return [];
  }

  // Obtener un emprendedor por ID
  getEmprendedorById(id: number): Observable<Emprendedor | null> {
    return this.http.get<any>(`${this.API_URL}/emprendedores/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error al obtener emprendedor con ID ${id}:`, error);
          
          if (this.useMockDataIfError) {
            const mockEmprendedor = EMPRENDEDORES_MOCK.find(e => e.id === id);
            return of(mockEmprendedor || null);
          }
          
          return of(null);
        })
      );
  }
}
