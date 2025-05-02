import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from './servicio.model'; // tu modelo
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.API_URL);
  }

  

}
