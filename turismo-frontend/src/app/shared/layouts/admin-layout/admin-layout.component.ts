import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <div 
        class="fixed inset-y-0 left-0 z-30 w-64 transform bg-primary-800 transition duration-300 lg:translate-x-0"
        [ngClass]="{'translate-x-0': sidebarOpen(), '-translate-x-full': !sidebarOpen()}"
      >
        <div class="flex h-16 items-center justify-between bg-primary-900 px-4">
          <div class="flex items-center">
            <span class="text-xl font-bold text-white">Admin Panel</span>
          </div>
          <button 
            class="text-white focus:outline-none lg:hidden"
            (click)="toggleSidebar()"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="h-[calc(100vh-4rem)] overflow-y-auto py-4 px-3">
          <ul class="space-y-2">
            <li>
              <a 
                routerLink="/dashboard" 
                routerLinkActive="bg-primary-700" 
                [routerLinkActiveOptions]="{exact: true}"
                class="flex items-center rounded-lg px-4 py-2 text-base font-normal text-white hover:bg-primary-700"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
                <span class="ml-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/users" 
                routerLinkActive="bg-primary-700"
                class="flex items-center rounded-lg px-4 py-2 text-base font-normal text-white hover:bg-primary-700"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <span class="ml-3">Usuarios</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/roles" 
                routerLinkActive="bg-primary-700"
                class="flex items-center rounded-lg px-4 py-2 text-base font-normal text-white hover:bg-primary-700"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span class="ml-3">Roles</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/permissions" 
                routerLinkActive="bg-primary-700"
                class="flex items-center rounded-lg px-4 py-2 text-base font-normal text-white hover:bg-primary-700"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
                <span class="ml-3">Permisos</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/profile" 
                routerLinkActive="bg-primary-700"
                class="flex items-center rounded-lg px-4 py-2 text-base font-normal text-white hover:bg-primary-700"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="ml-3">Mi Perfil</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/emprendedores" 
                routerLinkActive="bg-primary-700"
                class="flex items-center rounded-lg px-4 py-2 text-base font-normal text-white hover:bg-primary-700"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="ml-3">Emprendedores</span>
              </a>
            </li>



            <li>
              <a 
                routerLink="/categorias" 
                routerLinkActive="bg-primary-700"
                class="flex items-center rounded-lg px-4 py-2 text-base font-normal text-white hover:bg-primary-700"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
                <span class="ml-3">Categorias</span>
              </a>
            </li>



            <li class="border-t border-primary-700 pt-4 mt-4">
              <button 
                (click)="logout()" 
                class="flex w-full items-center rounded-lg px-4 py-2 text-base font-normal text-white hover:bg-primary-700"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span class="ml-3">Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="flex flex-1 flex-col lg:pl-64">
        <!-- Top Navbar -->
        <header class="z-10 py-4 bg-white shadow-sm">
          <div class="px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between">
              <div class="flex items-center lg:hidden">
                <button 
                  (click)="toggleSidebar()" 
                  class="text-gray-500 focus:outline-none"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
              </div>
              
              <div class="hidden md:flex md:items-center md:space-x-4">
                <div class="relative">
                  <span class="text-sm font-medium text-gray-700">
                    {{ user?.name || 'Usuario' }}
                  </span>
                </div>
                <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-primary-800 font-medium">{{ userInitials() }}</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent implements OnInit{
  private authService = inject(AuthService);
  
  user = this.authService.currentUser();
  sidebarOpen = signal(true);
  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      console.log('AdminLayout: Intentando cargar perfil de usuario...');
      this.authService.loadUserProfile().subscribe({
        next: user => {
          console.log('AdminLayout: Perfil cargado correctamente:', user);
        },
        error: err => {
          console.error('AdminLayout: Error al cargar perfil:', err);
        }
      });
    }
  }
  
  userInitials(): string {
    if (!this.user) return '';
    
    const firstName = this.user.first_name || '';
    const lastName = this.user.last_name || '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
  
  toggleSidebar() {
    this.sidebarOpen.update(value => !value);
  }
  
  logout() {
    this.authService.logout().subscribe();
  }
}