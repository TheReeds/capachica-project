import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Overlay de carga mientras se obtiene el perfil -->
      <div *ngIf="authService.isLoading()" 
           class="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
          <span>Cargando tu perfil...</span>
        </div>
      </div>
      
      <!-- Sidebar -->
      <div 
        class="fixed inset-y-0 left-0 z-30 w-64 transform bg-gradient-to-b from-orange-700 to-orange-900 transition-all duration-300 ease-in-out shadow-xl lg:translate-x-0"
        [ngClass]="{'translate-x-0': sidebarOpen(), '-translate-x-full': !sidebarOpen()}"
      >
        <div class="flex h-16 items-center justify-between bg-orange-900 px-4">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span class="text-xl font-bold text-white">Admin Panel</span>
          </div>
          <button 
            class="text-white focus:outline-none lg:hidden hover:text-orange-200 transition-colors"
            (click)="toggleSidebar()"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="h-[calc(100vh-4rem)] overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100">
          <ul class="space-y-1 text-white">
            <li>
              <a 
                routerLink="/dashboard" 
                routerLinkActive="bg-orange-600 text-white shadow-md" 
                [routerLinkActiveOptions]="{exact: true}"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
                <span class="ml-3">Dashboard</span>
              </a>
            </li>

            <!-- Sección Usuarios y Acceso -->
            <li class="mt-5 pt-3 border-t border-orange-600/30">
              <h3 class="px-4 text-xs font-bold text-orange-200 uppercase tracking-wider">Usuarios y Acceso</h3>
            </li>
            <li>
              <a 
                routerLink="/admin/users" 
                routerLinkActive="bg-orange-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <span class="ml-3">Usuarios</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/roles" 
                routerLinkActive="bg-orange-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span class="ml-3">Roles</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/permissions" 
                routerLinkActive="bg-orange-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
                <span class="ml-3">Permisos</span>
              </a>
            </li>

            <!-- Sección Turismo -->
            <li class="mt-5 pt-3 border-t border-orange-600/30">
              <h3 class="px-4 text-xs font-bold text-orange-200 uppercase tracking-wider">Sistema de Turismo</h3>
            </li>
            <li>
              <a 
                routerLink="/admin/municipalidad" 
                routerLinkActive="bg-orange-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span class="ml-3">Municipalidad</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/asociaciones" 
                routerLinkActive="bg-orange-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span class="ml-3">Asociaciones</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/emprendedores" 
                routerLinkActive="bg-orange-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="ml-3">Emprendedores</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/servicios" 
                routerLinkActive="bg-orange-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span class="ml-3">Servicios</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/categorias" 
                routerLinkActive="bg-orange-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                <span class="ml-3">Categorías</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/reservas" 
                routerLinkActive="bg-orange-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="ml-3">Reservas</span>
              </a>
            </li>

            <!-- Sección Usuario -->
            <li class="mt-5 pt-3 border-t border-orange-600/30">
              <h3 class="px-4 text-xs font-bold text-orange-200 uppercase tracking-wider">Mi cuenta</h3>
            </li>
            <li>
              <a 
                routerLink="/profile" 
                routerLinkActive="bg-orange-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="ml-3">Mi Perfil</span>
              </a>
            </li>
            
            <li class="mt-2">
              <button 
                (click)="logout()" 
                class="flex w-full items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <header class="z-10 py-3 bg-white shadow-sm">
          <div class="px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between">
              <div class="flex items-center lg:hidden">
                <button 
                  (click)="toggleSidebar()" 
                  class="text-gray-700 focus:outline-none hover:text-orange-500 transition-colors"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
              </div>
              
              <div class="hidden md:flex md:items-center md:space-x-4">
                <div class="relative">
                  <span class="text-sm font-medium text-gray-700">
                    {{ displayName() }}
                  </span>
                </div>
                <div class="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center shadow-sm hover:shadow transition-shadow">
                  <span class="text-orange-700 font-medium">{{ userInitials() }}</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div class="container mx-auto max-w-7xl">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* Custom scrollbar for sidebar */
    .scrollbar-thin::-webkit-scrollbar {
      width: 5px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-track {
      background: rgba(251, 146, 60, 0.1);
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: rgba(251, 146, 60, 0.5);
      border-radius: 5px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: rgba(251, 146, 60, 0.7);
    }
    
    /* Soft transitions for better UX */
    a, button {
      transition: all 0.2s ease-in-out;
    }
    
    /* Active menu item styling */
    .router-link-active {
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
    
    /* Avatar hover effect */
    .avatar-hover:hover {
      transform: scale(1.05);
    }
  `]
})
export class AdminLayoutComponent implements OnInit {
  authService = inject(AuthService);
  
  sidebarOpen = signal(true);
  
  // Computed property para el nombre a mostrar
  displayName = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return 'Usuario';
    return user.name || `${user.first_name} ${user.last_name}` || 'Usuario';
  });
  
  ngOnInit() {
    console.log('AdminLayout: Iniciando componente...');
    
    // Verificar si el usuario está autenticado
    if (this.authService.isLoggedIn()) {
      console.log('AdminLayout: Usuario está autenticado, verificando perfil...');
      
      // Verificar si el perfil ya está cargado
      if (!this.authService.currentUser()) {
        console.log('AdminLayout: Perfil no cargado, intentando cargar...');
        
        this.authService.loadUserProfile(true).subscribe({
          next: user => {
            console.log('AdminLayout: Perfil cargado correctamente:', user);
          },
          error: err => {
            console.error('AdminLayout: Error al cargar perfil:', err);
          }
        });
      } else {
        console.log('AdminLayout: Perfil ya está cargado:', this.authService.currentUser());
      }
    } else {
      console.log('AdminLayout: Usuario no está autenticado');
    }
    
    // Ajustar sidebar en dispositivos móviles
    this.adjustSidebarForMobile();
  }
  
  userInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return '';
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    
    if (!firstName && !lastName) {
      return user.name?.substring(0, 2).toUpperCase() || '';
    }
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
  
  toggleSidebar() {
    this.sidebarOpen.update(value => !value);
  }
  
  logout() {
    this.authService.logout().subscribe();
  }
  
  // Cerrar sidebar automáticamente en dispositivos móviles
  private adjustSidebarForMobile() {
    if (window.innerWidth < 1024) {
      this.sidebarOpen.set(false);
    }
  }
}