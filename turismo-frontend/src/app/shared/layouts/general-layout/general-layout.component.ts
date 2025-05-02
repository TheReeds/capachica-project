// general-layout.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-general-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="flex flex-col min-h-screen bg-cream-50">
      <!-- Header -->
      <header class="bg-cream-100 shadow-sm border-b border-amber-200">
        <div class="container mx-auto px-4 py-3">
          <div class="flex items-center justify-between">
            <!-- Logo y título -->
            <div class="flex items-center">
              <a routerLink="/home" class="flex items-center">
                <img src="img/logo.png" alt="Logo Capachica" class="h-16 w-auto mr-3">
                <div class="flex flex-col">
                  <h1 class="text-xl font-bold text-amber-800">Emprendedores</h1>
                  <h2 class="text-lg font-semibold text-amber-700">Capachica</h2>
                </div>
              </a>
            </div>

            <!-- Navegación principal - Versión escritorio -->
            <nav class="hidden md:flex items-center space-x-6">
              <a routerLink="/home" routerLinkActive="text-blue-600 font-medium border-b-2 border-blue-600" [routerLinkActiveOptions]="{exact: true}" class="flex items-center text-gray-700 hover:text-blue-600 py-1">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span>Inicio</span>
              </a>
              <a routerLink="/familias" routerLinkActive="text-blue-600 font-medium border-b-2 border-blue-600" class="flex items-center text-gray-700 hover:text-blue-600 py-1">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span>Familias</span>
              </a>
              <a routerLink="/servicios" routerLinkActive="text-blue-600 font-medium border-b-2 border-blue-600" [routerLinkActiveOptions]="{exact: false}" class="flex items-center text-gray-700 hover:text-blue-600 py-1">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span>Servicios</span>
              </a>
              <a routerLink="/sobrenosotros" routerLinkActive="text-blue-600 font-medium border-b-2 border-blue-600" class="flex items-center text-gray-700 hover:text-blue-600 py-1">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Sobre nosotros</span>
              </a>
              <a routerLink="/contactos" routerLinkActive="text-blue-600 font-medium border-b-2 border-blue-600" class="flex items-center text-gray-700 hover:text-blue-600 py-1">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>Contacto</span>
              </a>
              
            </nav>

            <!-- Botones de autenticación -->
            <div class="flex items-center space-x-2">
              <button *ngIf="!isLoggedIn()" routerLink="/login" class="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium transition">
                Iniciar sesión
              </button>
              <button *ngIf="!isLoggedIn()" routerLink="/register" class="bg-amber-500 hover:bg-amber-600 text-white rounded-md px-4 py-2 text-sm font-medium transition">
                Registrarse
              </button>
              <button *ngIf="isLoggedIn()" routerLink="/dashboard" class="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2 text-sm font-medium transition">
                Mi panel
              </button>
              <button *ngIf="isLoggedIn()" (click)="logout()" class="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 text-sm font-medium transition">
                Salir
              </button>
            </div>

            <!-- Botón de menú móvil -->
            <button 
              class="md:hidden flex items-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              (click)="toggleMobileMenu()"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="!mobileMenuOpen()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                <path *ngIf="mobileMenuOpen()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Menú móvil -->
          <div *ngIf="mobileMenuOpen()" class="md:hidden mt-3 pt-3 border-t border-amber-200">
            <nav class="flex flex-col space-y-3">
              <a routerLink="/home" routerLinkActive="text-blue-600 font-medium" [routerLinkActiveOptions]="{exact: true}" class="flex items-center text-gray-700 hover:text-blue-600 py-2 px-1" (click)="closeMobileMenu()">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span>Inicio</span>
              </a>
              <a routerLink="/familias" routerLinkActive="text-blue-600 font-medium" class="flex items-center text-gray-700 hover:text-blue-600 py-2 px-1" (click)="closeMobileMenu()">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span>Familias</span>
              </a>
              <a routerLink="/servicios" routerLinkActive="text-blue-600 font-medium" [routerLinkActiveOptions]="{exact: false}" class="flex items-center text-gray-700 hover:text-blue-600 py-2 px-1" (click)="closeMobileMenu()">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span>Servicios</span>
              </a>
              <a routerLink="/sobrenosotros" routerLinkActive="text-blue-600 font-medium" class="flex items-center text-gray-700 hover:text-blue-600 py-2 px-1" (click)="closeMobileMenu()">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Sobre nosotros</span>
              </a>
              <a routerLink="/contactos" routerLinkActive="text-blue-600 font-medium" class="flex items-center text-gray-700 hover:text-blue-600 py-2 px-1" (click)="closeMobileMenu()">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>Contacto</span>
              </a>
            </nav>

            <!-- Botones de autenticación móvil -->
            <div class="flex flex-col space-y-2 mt-4 pt-3 border-t border-amber-200">
              <button *ngIf="!isLoggedIn()" routerLink="/login" class="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium transition w-full" (click)="closeMobileMenu()">
                Iniciar sesión
              </button>
              <button *ngIf="!isLoggedIn()" routerLink="/register" class="bg-amber-500 hover:bg-amber-600 text-white rounded-md px-4 py-2 text-sm font-medium transition w-full" (click)="closeMobileMenu()">
                Registrarse
              </button>
              <button *ngIf="isLoggedIn()" routerLink="/dashboard" class="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2 text-sm font-medium transition w-full" (click)="closeMobileMenu()">
                Mi panel
              </button>
              <button *ngIf="isLoggedIn()" (click)="logout()" class="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 text-sm font-medium transition w-full">
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Contenido principal -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      
    </div>
  `,
  styles: [`
    /* Estilos adicionales si son necesarios */
    .bg-cream-50 {
      background-color: #FFFDF5;
    }
    .bg-cream-100 {
      background-color: #FFF8E1;
    }
  `]
})
export class GeneralLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  
  mobileMenuOpen = signal(false);
  
  ngOnInit() {
    // Si es necesario, cargar datos al iniciar el componente
  }
  
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen.update(value => !value);
  }
  
  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
  
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Redirigir al inicio o a la página de login después de cerrar sesión
        window.location.href = '/home'; // Opción básica
        // O utilizar el router para navegar
        // this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
      }
    });
  }
  
  currentYear(): number {
    return new Date().getFullYear();
  }
}