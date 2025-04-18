import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';

import { User, RegisterRequest, LoginRequest, AuthResponse, Role } from '../models/user.model';
import { environment } from '../../../environments/environments';

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

  constructor() {
    // Si hay un token, intenta cargar el perfil del usuario
    if (this.hasToken()) {
      this.getProfile().subscribe({
        next: (user) => this._currentUser.set(user),
        error: () => this.logout()
      });
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, data)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/logout`, {})
      .pipe(
        tap(() => {
          localStorage.removeItem(this.TOKEN_KEY);
          this._isLoggedIn.set(false);
          this._currentUser.set(null);
          this.router.navigate(['/login']);
        }),
        catchError(error => {
          // Incluso si hay un error, limpiar el estado de auth localmente
          localStorage.removeItem(this.TOKEN_KEY);
          this._isLoggedIn.set(false);
          this._currentUser.set(null);
          this.router.navigate(['/login']);
          return throwError(() => error);
        })
      );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/profile`)
      .pipe(
        tap(user => this._currentUser.set(user)),
        catchError(error => this.handleError(error))
      );
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.API_URL}/roles`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  createRole(data: { name: string, permissions: string[] }): Observable<Role> {
    return this.http.post<Role>(`${this.API_URL}/roles`, data)
      .pipe(
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
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    this._isLoggedIn.set(true);
    this._currentUser.set(response.user);
  }

  private handleError(error: any): Observable<never> {
    // Aquí puedes personalizar cómo quieres manejar los errores
    console.error('Error en AuthService:', error);
    
    // Si es un error 401, es un error de autenticación
    if (error.status === 401) {
      this.logout();
    }
    
    return throwError(() => error);
  }
}