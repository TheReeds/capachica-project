// src/app/features/admin-empredimientos/seleccion-panel/seleccion-panel.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-seleccion-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full max-w-4xl overflow-hidden">
        <div class="p-6 sm:p-8">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Bienvenido, {{ userName }}</h2>
            <p class="text-gray-600 dark:text-gray-300 mt-2">Selecciona dónde quieres ir</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Opción Panel de Administración -->
            <div 
              class="bg-white hover:bg-orange-400 dark:hover:bg-orange-800 dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              (click)="navigateTo('/dashboard')">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
              </div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white text-center mb-2">Panel de Administración</h3>
              <p class="text-gray-600 dark:text-gray-300 text-center">Accede a las funciones completas de administración con todas las herramientas del sistema.</p>
            </div>
            
            <!-- Opción Gestión de Emprendimientos -->
            <div 
              class="bg-white hover:bg-blue-400 dark:hover:bg-blue-800 dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              (click)="navigateTo('/mis-emprendimientos')">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white text-center mb-2">Gestión de Emprendimientos</h3>
              <p class="text-gray-600 dark:text-gray-300 text-center">Administra tus emprendimientos, servicios y reservas de forma fácil y eficiente.</p>
            </div>
          </div>
          
          <div class="mt-8 text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">Puedes cambiar entre paneles en cualquier momento desde el menú lateral</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SeleccionPanelComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  get userName(): string {
    return this.authService.currentUser()?.name || 'Usuario';
  }
  
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}