// core/services/theme.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeKey = 'darkMode';
  private darkModeSubject = new BehaviorSubject<boolean>(this.getInitialDarkModeState());
  
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    // Escuchar cambios del sistema si es posible
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem(this.darkModeKey) === null) {
          this.setDarkMode(e.matches);
        }
      });
    }
    
    // Aplicar el tema inicial cuando se crea el servicio
    this.initializeTheme();
  }

  private getInitialDarkModeState(): boolean {
    const savedMode = localStorage.getItem(this.darkModeKey);
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    
    // Si no hay preferencia guardada, usar la preferencia del sistema o la configuración predeterminada
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    
    return environment.defaultDarkMode;
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this.darkModeSubject.value);
  }

  setDarkMode(value: boolean): void {
    localStorage.setItem(this.darkModeKey, String(value));
    this.darkModeSubject.next(value);
    this.updateBodyClass(value);
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  // Actualizar clase en el body para aplicar estilos globales
  private updateBodyClass(isDarkMode: boolean): void {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Inicializar el tema al arrancar la aplicación
  initializeTheme(): void {
    this.updateBodyClass(this.darkModeSubject.value);
  }
}