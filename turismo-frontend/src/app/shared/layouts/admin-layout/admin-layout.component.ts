import { Component, inject, OnInit, signal, computed, effect, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { User } from '../../../core/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Overlay de carga mientras se obtiene el perfil -->
      <div *ngIf="authService.isLoading()" 
           class="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-black dark:bg-opacity-60 z-50 flex items-center justify-center">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 dark:border-blue-500 border-r-transparent"></div>
          <span class="text-gray-800 dark:text-white">Cargando tu perfil...</span>
        </div>
      </div>
      
      <!-- Sidebar -->
      <div 
        class="fixed inset-y-0 left-0 z-30 transform transition-all duration-300 ease-in-out shadow-xl bg-gradient-to-b from-orange-700 to-orange-900 dark:from-blue-800 dark:to-blue-950"
        [ngClass]="{
          'w-64': !sidebarCollapsed(), 
          'w-20': sidebarCollapsed(),
          'translate-x-0': sidebarOpen(), 
          '-translate-x-full': !sidebarOpen(),
          'lg:translate-x-0': true
        }"
      >
        <div class="flex h-16 items-center justify-between px-4 bg-orange-900 dark:bg-blue-950">
          <div class="flex items-center space-x-2 overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-300 dark:text-blue-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span *ngIf="!sidebarCollapsed()" class="text-xl font-bold text-white truncate transition-opacity duration-200">Admin Panel</span>
          </div>
          
          <!-- Toggle sidebar on mobile -->
          <button 
            class="text-white focus:outline-none lg:hidden hover:text-orange-200 dark:hover:text-blue-200 transition-colors"
            (click)="toggleSidebar()"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- User Profile Section -->
        <div class="px-4 py-5 border-b border-orange-600/30 dark:border-blue-600/30">
          <div class="flex items-center">
            <!-- User Photo or Initials -->
            <div class="relative">
              <div *ngIf="profilePhotoUrl()" class="h-12 w-12 rounded-full overflow-hidden border-2 border-orange-300 dark:border-blue-300 shadow-md flex-shrink-0">
                <img [src]="profilePhotoUrl()" alt="Foto de perfil" class="h-full w-full object-cover" />
              </div>
              <div *ngIf="!profilePhotoUrl()" class="h-12 w-12 rounded-full bg-orange-100 dark:bg-blue-100 flex items-center justify-center shadow-md flex-shrink-0">
                <span class="text-orange-700 dark:text-blue-700 font-medium text-sm">{{ userInitials() }}</span>
              </div>
              <div class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border border-white dark:border-gray-800"></div>
            </div>
            
            <!-- User Info (only when not collapsed) -->
            <div *ngIf="!sidebarCollapsed()" class="ml-3 overflow-hidden transition-opacity duration-200">
              <p class="text-sm font-medium text-white truncate">{{ displayName() }}</p>
              <p class="text-xs text-orange-200 dark:text-blue-200 truncate">{{ userRole() }}</p>
            </div>
          </div>
          
          <!-- Toolbar (only when not collapsed) -->
          <div *ngIf="!sidebarCollapsed()" class="mt-4 flex justify-between transition-opacity duration-200">
            <button (click)="toggleSidebarCollapse()" class="text-orange-200 dark:text-blue-200 hover:text-white transition-colors" title="Minimizar menú">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button (click)="toggleDarkMode()" class="text-orange-200 dark:text-blue-200 hover:text-white transition-colors" [title]="darkMode() ? 'Modo claro' : 'Modo oscuro'">
              <svg *ngIf="!darkMode()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <svg *ngIf="darkMode()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </div>
          
          <!-- Collapsed Toolbar -->
          <div *ngIf="sidebarCollapsed()" class="mt-4 flex flex-col items-center space-y-4 transition-opacity duration-200">
            <button (click)="toggleSidebarCollapse()" class="text-orange-200 dark:text-blue-200 hover:text-white transition-colors" title="Expandir menú">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
            <button (click)="toggleDarkMode()" class="text-orange-200 dark:text-blue-200 hover:text-white transition-colors" [title]="darkMode() ? 'Modo claro' : 'Modo oscuro'">
              <svg *ngIf="!darkMode()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <svg *ngIf="darkMode()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="h-[calc(100vh-9rem)] overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-orange-400 dark:scrollbar-thumb-blue-400 scrollbar-track-orange-100 dark:scrollbar-track-blue-100/20">
          <ul class="space-y-1 text-white">
            <li>
              <a 
                routerLink="/dashboard" 
                routerLinkActive="bg-orange-600 dark:bg-blue-600 text-white shadow-md" 
                [routerLinkActiveOptions]="{exact: true}"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 dark:hover:bg-blue-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 dark:text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
                <span class="ml-3 transition-opacity duration-200" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Dashboard</span>
              </a>
            </li>

            <!-- Sección Usuarios y Acceso -->
            <li class="mt-5 pt-3 border-t border-orange-600/30 dark:border-blue-600/30" [class.text-center]="sidebarCollapsed()">
              <h3 class="px-4 text-xs font-bold text-orange-200 dark:text-blue-200 uppercase tracking-wider truncate" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Usuarios y Acceso</h3>
              <div *ngIf="sidebarCollapsed()" class="h-px w-10 bg-orange-600/30 dark:bg-blue-600/30 mx-auto"></div>
            </li>
            <li>
              <a 
                routerLink="/admin/users" 
                routerLinkActive="bg-orange-600 dark:bg-blue-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 dark:hover:bg-blue-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 dark:text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <span class="ml-3 transition-opacity duration-200" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Usuarios</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/roles" 
                routerLinkActive="bg-orange-600 dark:bg-blue-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 dark:hover:bg-blue-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 dark:text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span class="ml-3 transition-opacity duration-200" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Roles</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/permissions" 
                routerLinkActive="bg-orange-600 dark:bg-blue-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 dark:hover:bg-blue-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 dark:text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
                <span class="ml-3 transition-opacity duration-200" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Permisos</span>
              </a>
            </li>

            <!-- Sección Turismo -->
            <li class="mt-5 pt-3 border-t border-orange-600/30 dark:border-blue-600/30" [class.text-center]="sidebarCollapsed()">
              <h3 class="px-4 text-xs font-bold text-orange-200 dark:text-blue-200 uppercase tracking-wider truncate" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Sistema de Turismo</h3>
              <div *ngIf="sidebarCollapsed()" class="h-px w-10 bg-orange-600/30 dark:bg-blue-600/30 mx-auto"></div>
            </li>
            <li>
              <a 
                routerLink="/admin/municipalidad" 
                routerLinkActive="bg-orange-600 dark:bg-blue-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 dark:hover:bg-blue-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 dark:text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span class="ml-3 transition-opacity duration-200" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Municipalidad</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/asociaciones" 
                routerLinkActive="bg-orange-600 dark:bg-blue-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 dark:hover:bg-blue-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 dark:text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span class="ml-3 transition-opacity duration-200" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Asociaciones</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/emprendedores" 
                routerLinkActive="bg-orange-600 dark:bg-blue-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 dark:hover:bg-blue-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 dark:text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="ml-3 transition-opacity duration-200" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Emprendedores</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/servicios" 
                routerLinkActive="bg-orange-600 dark:bg-blue-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 dark:hover:bg-blue-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 dark:text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span class="ml-3 transition-opacity duration-200" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Servicios</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/categorias" 
                routerLinkActive="bg-orange-600 dark:bg-blue-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 dark:hover:bg-blue-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 dark:text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                <span class="ml-3 transition-opacity duration-200" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Categorías</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/reservas" 
                routerLinkActive="bg-orange-600 dark:bg-blue-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 dark:hover:bg-blue-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 dark:text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="ml-3 transition-opacity duration-200" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Reservas</span>
              </a>
            </li>

            <!-- Sección Usuario -->
            <li class="mt-5 pt-3 border-t border-orange-600/30 dark:border-blue-600/30" [class.text-center]="sidebarCollapsed()">
              <h3 class="px-4 text-xs font-bold text-orange-200 dark:text-blue-200 uppercase tracking-wider truncate" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Mi cuenta</h3>
              <div *ngIf="sidebarCollapsed()" class="h-px w-10 bg-orange-600/30 dark:bg-blue-600/30 mx-auto"></div>
            </li>
            <li>
              <a 
                routerLink="/profile" 
                routerLinkActive="bg-orange-600 dark:bg-blue-600 text-white shadow-md"
                class="flex items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 dark:hover:bg-blue-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 dark:text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="ml-3 transition-opacity duration-200" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Mi Perfil</span>
              </a>
            </li>
            
            <li class="mt-2">
              <button 
                (click)="logout()" 
                class="flex w-full items-center rounded-lg px-4 py-2.5 text-base font-medium text-white hover:bg-orange-600 dark:hover:bg-blue-600 transition-all duration-200 group"
              >
                <svg class="h-5 w-5 text-orange-300 dark:text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span class="ml-3 transition-opacity duration-200" [class.opacity-0]="sidebarCollapsed()" [class.hidden]="sidebarCollapsed()">Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="flex flex-1 flex-col transition-all duration-300 ease-in-out" [ngClass]="{'lg:pl-64': !sidebarCollapsed(), 'lg:pl-20': sidebarCollapsed()}">
        <!-- Top Navbar -->
        <header class="z-10 py-3 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
          <div class="px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between">
              <div class="flex items-center lg:hidden">
                <button 
                  (click)="toggleSidebar()" 
                  class="text-gray-700 dark:text-gray-200 focus:outline-none hover:text-orange-500 dark:hover:text-blue-500 transition-colors"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Breadcrumbs o título de página puede ir aquí -->
              <div class="hidden md:block">
                <h1 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  <!-- Dinamically show page title here -->
                </h1>
              </div>
              
              <div class="flex items-center space-x-4">
                <!-- Theme toggle on top bar for larger screens -->
                <button 
                  (click)="toggleDarkMode()" 
                  class="p-1 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                  [title]="darkMode() ? 'Modo claro' : 'Modo oscuro'"
                >
                  <svg *ngIf="!darkMode()" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <svg *ngIf="darkMode()" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </button>
                
                <!-- Notificaciones (ejemplo) -->
                <button class="p-1 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                
                <!-- Menú de Usuario con click en lugar de hover -->
                <div class="relative" #userMenuContainer>
                  <div 
                    class="flex items-center cursor-pointer"
                    (click)="toggleUserMenu($event)"
                  >
                    <span class="hidden md:block mr-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                      {{ displayName() }}
                    </span>
                    
                    <!-- User Avatar / Initials -->
                    <div *ngIf="profilePhotoUrl()" class="h-9 w-9 rounded-full overflow-hidden bg-orange-100 dark:bg-blue-100 shadow-sm hover:shadow transition-shadow">
                      <img [src]="profilePhotoUrl()" alt="Foto de perfil" class="h-full w-full object-cover" />
                    </div>
                    <div *ngIf="!profilePhotoUrl()" class="h-9 w-9 rounded-full bg-orange-100 dark:bg-blue-100 flex items-center justify-center shadow-sm hover:shadow transition-shadow">
                      <span class="text-orange-700 dark:text-blue-700 font-medium">{{ userInitials() }}</span>
                    </div>
                  </div>
                  
                  <!-- Dropdown Menu - Ahora con visibilidad controlada mediante click -->
                  <div 
                    *ngIf="userMenuOpen"
                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 max-h-80 overflow-y-auto"
                  >
                    <a routerLink="/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Mi Perfil</a>
                    <a routerLink="/settings" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Configuración</a>
                    <div class="border-t my-1 border-gray-100 dark:border-gray-700"></div>
                    <button 
                      (click)="logout()" 
                      class="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 mb-1"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
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
    
    .dark .scrollbar-thin::-webkit-scrollbar-track {
      background: rgba(59, 130, 246, 0.1);
    }
    
    .dark .scrollbar-thin::-webkit-scrollbar-thumb {
      background: rgba(59, 130, 246, 0.5);
      border-radius: 5px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: rgba(251, 146, 60, 0.7);
    }
    
    .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: rgba(59, 130, 246, 0.7);
    }
    
    /* Active menu item styling */
    .router-link-active {
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
    
    /* Transitions */
    .transition-opacity {
      transition: opacity 150ms ease-in-out;
    }
    
    /* Avatar hover effect */
    .avatar-hover:hover {
      transform: scale(1.05);
    }
  `]
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  @ViewChild('userMenuContainer') userMenuContainer!: ElementRef;
  
  // Signals para controlar estados de la UI
  sidebarOpen = signal(true);
  sidebarCollapsed = signal(false);
  darkMode = signal(false);
  userMenuOpen = false;
  
  // Subscription management
  private themeSubscription: Subscription | null = null;
  
  // Computed property para el nombre a mostrar
  displayName = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return 'Usuario';
    return user.name || `${user.first_name} ${user.last_name}` || 'Usuario';
  });
  
  // Computed property para obtener la URL de la foto de perfil
  profilePhotoUrl = computed(() => {
    const user = this.authService.currentUser();
    if (!user || !user['foto_perfil']) return null;
    return user['foto_perfil'];
  });
  
  // Computed property para obtener el rol principal del usuario
  userRole = computed(() => {
    const user = this.authService.currentUser();
    // Verificar si el usuario existe
    if (!user) return 'Usuario';
    
    // Obtener los roles desde el servicio de autenticación
    const roles = this.authService.userRoles();
    
    if (roles && roles.length > 0) {
      // Si hay roles disponibles, mostrar el primero capitalizado
      return this.capitalize(roles[0]);
    } else if (user.roles && user.roles.length > 0) {
      // Fallback al modelo de usuario si está disponible
      const role = user.roles[0].name || user.roles[0];
      return this.capitalize(role.toString());
    }
    
    return 'Usuario';
  });
  
  // Efecto para aplicar cambios de tema
  private themeEffect = effect(() => {
    if (this.darkMode()) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
    
    // Para debuggear
    console.log('Modo oscuro:', this.darkMode());
  });
  
  constructor() {
    // Manejar clics fuera del menú de usuario
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  ngOnInit() {
    // Subscribe to theme service for dark mode updates
    this.themeSubscription = this.themeService.darkMode$.subscribe(isDark => {
      console.log('Dark mode subscription update:', isDark);
      this.darkMode.set(isDark);
    });
    
    // Initialize theme on component start
    this.themeService.initializeTheme();
    
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
    
    // Load saved sidebar collapse state
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed === 'true') {
      this.sidebarCollapsed.set(true);
    }
  }
  
  ngOnDestroy() {
    // Clean up all subscriptions
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    
    // Remove document event listener
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
  }
  
  // Método para manejar clics fuera del menú de usuario
  handleDocumentClick(event: MouseEvent) {
    if (this.userMenuOpen && !this.userMenuContainer.nativeElement.contains(event.target)) {
      this.userMenuOpen = false;
    }
  }
  
  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }
  
  userInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return '';
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    
    if (!firstName && !lastName) {
      return user.name?.substring(0, 2).toUpperCase() || '';
    }
    
    return (firstName.charAt(0) + (lastName ? lastName.charAt(0) : firstName.charAt(1))).toUpperCase();
  }
  
  toggleSidebar() {
    this.sidebarOpen.update(value => !value);
  }
  
  toggleSidebarCollapse() {
    this.sidebarCollapsed.update(value => !value);
    localStorage.setItem('sidebarCollapsed', this.sidebarCollapsed().toString());
  }
  
  toggleDarkMode() {
    console.log('Toggle dark mode, current:', this.darkMode());
    this.themeService.toggleDarkMode();
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
  
  // Utility para capitalizar texto
  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}