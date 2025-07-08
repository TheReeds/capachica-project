import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Verifica si la ruta es de autenticación o broadcasting
  const isAuthRequest =
    req.url.includes('/login') ||
    req.url.includes('/register') ||
    req.url.includes('/forgot-password');

  const isBroadcasting = req.url.includes('/broadcasting/auth');

  let modifiedReq = req.clone({
    withCredentials: true // 🔥 clave para enviar cookies a Laravel Sanctum
  });

  // Si NO es solicitud de login/register y NO es broadcasting, añade Bearer
  if (token && !isAuthRequest && !isBroadcasting) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('AuthInterceptor: Error 401', req.url);

        if (
          window.location.pathname.startsWith('/dashboard') ||
          window.location.pathname.startsWith('/admin') ||
          window.location.pathname.startsWith('/profile')
        ) {
          authService['clearAuthData']();
          router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    })
  );
};
