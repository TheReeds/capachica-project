import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white shadow">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex">
            <div class="flex flex-shrink-0 items-center">
              <span class="text-xl font-bold text-primary-600">Mi Aplicación</span>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a 
                routerLink="/dashboard" 
                routerLinkActive="border-primary-500 text-gray-900"
                [routerLinkActiveOptions]="{exact: true}"
                class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Dashboard
              </a>
              <a 
                routerLink="/profile" 
                routerLinkActive="border-primary-500 text-gray-900"
                class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Mi Perfil
              </a>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <div class="relative ml-3">
              <div class="flex items-center">
                <button 
                  (click)="toggleDropdown()" 
                  type="button" 
                  class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span class="sr-only">Abrir menú de usuario</span>
                  <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="text-primary-800 font-medium">{{ userInitials() }}</span>
                  </div>
                </button>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-700">{{ user?.name }}</div>
                  <div class="text-xs text-gray-500">{{ user?.email }}</div>
                </div>
              </div>
              
              @if (dropdownOpen()) {
                <div class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <a 
                    routerLink="/profile" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    (click)="toggleDropdown()"
                  >
                    Tu Perfil
                  </a>
                  <button 
                    (click)="logout()" 
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </div>
              }
            </div>
          </div>
          
          <div class="-mr-2 flex items-center sm:hidden">
            <button 
              (click)="toggleMobileMenu()" 
              type="button" 
              class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span class="sr-only">Abrir menú principal</span>
              @if (mobileMenuOpen()) {
                <!-- Icono X para cerrar -->
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              } @else {
                <!-- Icono de menú hamburguesa -->
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              }
            </button>
          </div>
        </div>
      </nav>
      
      <!-- Menú móvil -->
      @if (mobileMenuOpen()) {
        <div class="sm:hidden">
          <div class="space-y-1 pb-3 pt-2">
            <a 
              routerLink="/dashboard" 
              routerLinkActive="bg-primary-50 border-primary-500 text-primary-700"
              [routerLinkActiveOptions]="{exact: true}"
              class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
              (click)="mobileMenuOpen.set(false)"
            >
              Dashboard
            </a>
            <a 
              routerLink="/profile" 
              routerLinkActive="bg-primary-50 border-primary-500 text-primary-700"
              class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
              (click)="mobileMenuOpen.set(false)"
            >
              Mi Perfil
            </a>
          </div>
          <div class="border-t border-gray-200 pb-3 pt-4">
            <div class="flex items-center px-4">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-primary-800 font-medium">{{ userInitials() }}</span>
                </div>
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-gray-800">{{ user?.name }}</div>
                <div class="text-sm font-medium text-gray-500">{{ user?.email }}</div>
              </div>
            </div>
            <div class="mt-3 space-y-1">
              <a 
                routerLink="/profile" 
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                (click)="mobileMenuOpen.set(false)"
              >
                Tu Perfil
              </a>
              <button 
                (click)="logout()" 
                class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  private authService = inject(AuthService);
  
  user = this.authService.currentUser();
  dropdownOpen = signal(false);
  mobileMenuOpen = signal(false);
  
  userInitials(): string {
    if (!this.user) return '';
    
    const firstName = this.user.first_name || '';
    const lastName = this.user.last_name || '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
  
  toggleDropdown() {
    this.dropdownOpen.update(value => !value);
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen.update(value => !value);
  }
  
  logout() {
    this.authService.logout().subscribe();
  }
}