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

      <!-- Footer -->
      <footer class="bg-amber-800 text-white py-8">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 class="text-lg font-semibold mb-4">Emprendedores Capachica</h3>
              <p class="text-amber-200 mb-2">Descubre la magia del Lago Titicaca</p>
              <p class="text-sm">Turismo vivencial y comunitario en las orillas del lago más alto del mundo.</p>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold mb-4">Enlaces rápidos</h3>
              <ul class="space-y-2">
                <li><a routerLink="/home" class="text-amber-200 hover:text-white transition">Inicio</a></li>
                <li><a routerLink="/familias" class="text-amber-200 hover:text-white transition">Familias</a></li>
                <li><a routerLink="/servicios" class="text-amber-200 hover:text-white transition">Servicios</a></li>
                <li><a routerLink="/sobrenosotros" class="text-amber-200 hover:text-white transition">Sobre nosotros</a></li>
                <li><a routerLink="/contactos" class="text-amber-200 hover:text-white transition">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold mb-4">Contáctanos</h3>
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>+51 123 456 789</span>
              </div>
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>infoemprendedorescapachica.com</span>
              </div>
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>Península de Capachica, Puno, Perú</span>
              </div>
            </div>
          </div>
          
          <div class="mt-8 pt-6 border-t border-amber-700 flex flex-col sm:flex-row justify-between items-center">
            <p class="text-sm mb-4 sm:mb-0">&copy; {{ currentYear() }} Emprendedores Capachica. Todos los derechos reservados.</p>
            <div class="flex space-x-4">
              <a href="#" class="text-amber-200 hover:text-white transition">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a href="#" class="text-amber-200 hover:text-white transition">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.014-.627.961-.69 1.8-1.56 2.46-2.548z"/>
                </svg>
              </a>
              <a href="#" class="text-amber-200 hover:text-white transition">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
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