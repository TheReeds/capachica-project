import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, map, of, BehaviorSubject, filter, take, switchMap, finalize } from 'rxjs';

import { User, RegisterRequest, LoginRequest, AuthResponse, Role } from '../models/user.model';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../models/api.model';

interface ProfileApiResponse {
  success: boolean;
  data: {
    user: User;
    roles?: string[];
    permissions?: string[];
  };
  message?: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';

  // Usar signals para manejar el estado de autenticación y usuario
  private readonly _isLoggedIn = signal<boolean>(this.hasToken());
  private readonly _currentUser = signal<User | null>(null);

  // Exponer los signals como readonly
  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();

  private userLoadAttempted = false;
  private userLoading = new BehaviorSubject<boolean>(false);


  constructor() {
    // Si hay un token, intenta cargar el perfil del usuario
    if (this.hasToken()) {
      this.loadInitialUser();
    }
  }
  loadUserProfile(forceReload = false): Observable<User | null> {
    // Si ya estamos cargando, devuelve un observable que emite cuando termine
    if (this.userLoading.value) {
      return this.userLoading.pipe(
        filter(loading => !loading),
        take(1),
        switchMap(() => of(this.currentUser()))
      );
    }

    // Si ya intentamos cargar y no queremos forzar recarga, devuelve el usuario actual
    if (this.userLoadAttempted && !forceReload) {
      return of(this.currentUser());
    }

    // Si no hay token, no hay usuario autenticado
    if (!this.hasToken()) {
      this.userLoadAttempted = true;
      return of(null);
    }

    // Marcamos que estamos cargando
    this.userLoading.next(true);
    
    console.log('Realizando petición para cargar perfil de usuario...');
    
    // Realiza la petición HTTP
    return this.http.get<any>(`${this.API_URL}/profile`).pipe(
      tap(response => console.log('Respuesta de perfil:', response)),
      map(response => {
        // Extraer usuario de la respuesta según la estructura
        let user: User | null = null;
        
        if (response && response.success && response.data) {
          if (response.data.user) {
            user = response.data.user;
          } else {
            user = response.data;
          }
        } else if (response && !('success' in response)) {
          // Si la respuesta es directamente el usuario
          user = response;
        }
        
        return user;
      }),
      tap(user => {
        // Actualiza el estado
        this.userLoadAttempted = true;
        if (user) {
          this._currentUser.set(user);
          this._isLoggedIn.set(true);
        } else {
          // Si no hay usuario en la respuesta, limpiar datos de auth
          this.clearAuthData();
        }
      }),
      catchError(error => {
        console.error('Error al cargar perfil de usuario:', error);
        this.userLoadAttempted = true;
        this.clearAuthData();
        return of(null);
      }),
      finalize(() => {
        // Marcar que ya no estamos cargando
        this.userLoading.next(false);
      })
    );
  }

  private loadInitialUser() {
    console.log('Cargando perfil de usuario inicial...');
    this.loadUserProfile().subscribe({
      next: user => {
        console.log('Perfil de usuario cargado:', user);
      },
      error: err => {
        console.error('Error inesperado al cargar perfil:', err);
      }
    });
  }
  // Método auxiliar para limpiar datos de autenticación
  private clearAuthData() {
    localStorage.removeItem(this.TOKEN_KEY);
    this._isLoggedIn.set(false);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/register`, data)
      .pipe(
        map(response => response.data as AuthResponse),
        tap(response => this.handleAuthResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/login`, data)
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error("No data in response");
          }
        
          return {
            access_token: response.data.access_token,
            token_type: response.data.token_type,
            expires_in: 0,
            user: response.data.user
          };
        }),
        tap(authResponse => this.handleAuthResponse(authResponse)),
        catchError(error => this.handleError(error))
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/logout`, {})
      .pipe(
        tap(() => {
          this.clearAuthData();
        }),
        catchError(error => {
          this.clearAuthData();
          return throwError(() => error);
        })
      );
  }

  getProfile(): Observable<User> {
    return this.http.get<ProfileApiResponse>(`${this.API_URL}/profile`)
      .pipe(
        map(response => {
          if (response.success && response.data && response.data.user) {
            return response.data.user;
          }
          throw new Error('Formato de respuesta no válido');
        }),
        tap(user => {
          this._currentUser.set(user);
        }),
        catchError(error => this.handleError(error))
      );
  }
  

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (response && response.access_token) {
      localStorage.setItem(this.TOKEN_KEY, response.access_token);
      this._isLoggedIn.set(true);
      this._currentUser.set(response.user);
    } else {
      console.warn('Formato de respuesta de autenticación no válido:', response);
    }
  }
  

  private handleError(error: any): Observable<never> {
    console.error('Error en AuthService:', error);
    
    if (error.status === 401) {
      this.clearAuthData();
    }
    
    return throwError(() => error);
  }
}