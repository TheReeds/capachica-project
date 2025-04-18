import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;
  }
  
  // Redirigir al usuario a la página de inicio de sesión si no está autenticado
  return router.createUrlTree(['/login']);
};

export const nonAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isLoggedIn()) {
    return true;
  }
  
  // Redirigir al usuario al dashboard si ya está autenticado
  return router.createUrlTree(['/dashboard']);
};