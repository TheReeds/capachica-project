import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmprendimientoAdminService } from '../../../core/services/emprendimiento-admin.service';
import { Emprendimiento, AdminRequest } from '../../../core/models/emprendimiento-admin.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-administradores-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen relative">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-[url('https://media-cdn.tripadvisor.com/media/photo-s/08/e7/29/52/capachica-peninsula.jpg')] bg-cover bg-center bg-no-repeat">
        <div class="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-900/95 backdrop-blur-sm"></div>
      </div>
      <!-- Content -->
      <div class="relative min-h-screen">
        <!-- Barra Superior -->
        <header class="backdrop-blur-lg bg-white/10 dark:bg-gray-800/20 border-b border-white/10 dark:border-gray-700/30 sticky top-0 z-50">
          <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <!-- Breadcrumb -->
            <nav class="flex mb-3" aria-label="Breadcrumb">
              <ol class="inline-flex items-center space-x-1 md:space-x-3">
                <li class="inline-flex items-center">
                  <a routerLink="/admin-emprendedores/mis-emprendimientos" 
                     class="text-gray-300 hover:text-orange-400 transition-colors duration-300">
                    Mis Emprendimientos
                  </a>
                </li>
                <li>
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <a [routerLink]="['/admin-emprendedores/emprendimiento', emprendimientoId]" 
                       class="text-gray-300 hover:text-orange-400 transition-colors duration-300">
                      {{ emprendimiento?.nombre || 'Emprendimiento' }}
                    </a>
                  </div>
                </li>
                <li>
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-gray-400">Administradores</span>
                  </div>
                </li>
              </ol>
            </nav>
            
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                  {{ emprendimiento ? 'Administradores: ' + emprendimiento.nombre : 'Cargando administradores...' }}
                </h1>
                <p class="text-sm text-gray-300 dark:text-gray-400 mt-1">Gestiona los administradores de tu emprendimiento</p>
              </div>
              <div class="flex items-center space-x-4">
                <button (click)="refreshData()" 
                        [disabled]="loading"
                        class="group flex items-center px-4 py-2 rounded-full bg-white/10 dark:bg-gray-800/30 text-white hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300 disabled:opacity-50">
                  <svg *ngIf="!loading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <div *ngIf="loading" class="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Actualizar
                </button>
                <a [routerLink]="['/admin-emprendedores/mis-emprendimientos']" class="group flex items-center px-4 py-2 rounded-full bg-white/10 dark:bg-gray-800/30 text-white hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Volver a Emprendimientos
                </a>
              </div>
            </div>
          </div>
        </header>
        
        <!-- Contenido Principal -->
        <main class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <!-- Estado de Carga -->
          <div *ngIf="loading && !emprendimiento" class="flex justify-center py-12 animate-fade-in">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-orange-200/30 dark:border-orange-800/30 rounded-full"></div>
              <div class="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
          </div>
          
          <!-- Error -->
          <div *ngIf="error" class="backdrop-blur-lg bg-red-500/10 dark:bg-red-900/20 border border-red-500/20 dark:border-red-800/30 rounded-2xl p-6 mb-6 shadow-2xl animate-fade-in">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-red-200">{{ error }}</h3>
                <div class="mt-4">
                  <button (click)="loadEmprendimiento()" class="inline-flex items-center px-4 py-2 rounded-full bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Formulario para Agregar Administrador -->
          <div class="backdrop-blur-lg bg-white/10 dark:bg-gray-800/20 shadow-2xl rounded-2xl mb-8 border border-gradient-to-r from-orange-400/40 to-orange-600/40 animate-fade-in">
            <div class="p-7">
              <h2 class="text-xl font-extrabold bg-gradient-to-r from-orange-400 to-orange-200 bg-clip-text text-transparent mb-4 tracking-tight animate-slide-in">Agregar Nuevo Administrador</h2>
              <form [formGroup]="adminForm" (ngSubmit)="addAdministrador()" class="space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <!-- Email -->
                  <div class="relative">
                    <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Email del Usuario *</label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-orange-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </span>
                      <input 
                        type="email" 
                        id="email" 
                        formControlName="email" 
                        class="mt-1 block w-full rounded-lg border border-gray-500/30 bg-white/20 dark:bg-gray-700/30 dark:text-white shadow-inner focus:border-orange-400 focus:ring-orange-400 focus:ring-2 px-10 py-2 placeholder-gray-400 transition-all duration-300 focus:shadow-orange-400/20"
                        placeholder="usuario@ejemplo.com">
                    </div>
                    <div *ngIf="adminForm.get('email')?.invalid && adminForm.get('email')?.touched" class="mt-1 text-sm text-red-400 animate-shake">
                      <span *ngIf="adminForm.get('email')?.errors?.['required']">El email es requerido</span>
                      <span *ngIf="adminForm.get('email')?.errors?.['email']">El formato del email no es válido</span>
                    </div>
                  </div>
                  
                  <!-- Rol -->
                  <div class="relative">
                    <label for="rol" class="block text-sm font-medium text-gray-300 mb-1">Rol *</label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-orange-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </span>
                      <select 
                        id="rol" 
                        formControlName="rol" 
                        class="mt-1 block w-full rounded-lg border border-gray-500/30 bg-white/20 dark:bg-gray-700/30 dark:text-white shadow-inner focus:border-orange-400 focus:ring-orange-400 focus:ring-2 px-10 py-2 transition-all duration-300 focus:shadow-orange-400/20">
                        <option value="">Seleccionar rol</option>
                        <option value="administrador">Administrador</option>
                        <option value="colaborador">Colaborador</option>
                        <option value="moderador">Moderador</option>
                      </select>
                    </div>
                    <div *ngIf="adminForm.get('rol')?.invalid && adminForm.get('rol')?.touched" class="mt-1 text-sm text-red-400 animate-shake">
                      <span *ngIf="adminForm.get('rol')?.errors?.['required']">El rol es requerido</span>
                    </div>
                  </div>
                </div>
                
                <!-- Es Principal -->
                <div class="flex items-center">
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      formControlName="es_principal"
                      class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-500/30 rounded bg-white/20 transition-all duration-300">
                    <span class="ml-2 text-sm text-gray-300 font-medium">
                      Administrador Principal
                    </span>
                  </label>
                  <div class="ml-2 group relative">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="absolute bottom-6 left-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
                      Los administradores principales no pueden ser eliminados
                    </div>
                  </div>
                </div>
                
                <div class="flex justify-end">
                  <button
                    type="submit"
                    [disabled]="adminForm.invalid || addingAdmin"
                    class="inline-flex justify-center rounded-xl border border-transparent bg-gradient-to-r from-orange-500 to-orange-400 py-2 px-6 text-sm font-bold text-white shadow-lg hover:from-orange-600 hover:to-orange-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span *ngIf="addingAdmin" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></span>
                    {{ addingAdmin ? 'Agregando...' : 'Agregar Administrador' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Lista de Administradores -->
          <div class="backdrop-blur-lg bg-white/10 dark:bg-gray-800/20 shadow-2xl rounded-2xl border border-white/10 dark:border-gray-700/30 animate-fade-in">
            <div class="p-7">
              <h2 class="text-xl font-extrabold bg-gradient-to-r from-orange-400 to-orange-200 bg-clip-text text-transparent mb-4 tracking-tight animate-slide-in">
                Administradores Actuales ({{ emprendimiento?.administradores?.length || 0 }})
              </h2>
              
              <!-- Sin Administradores -->
              <div *ngIf="!loading && !error && (!emprendimiento?.administradores?.length)" class="text-center py-8 animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 class="mt-2 text-lg font-bold text-white animate-fade-in">No hay administradores</h3>
                <p class="mt-1 text-sm text-gray-300">Este emprendimiento aún no tiene administradores registrados.</p>
              </div>
              
              <!-- Tabla de Administradores -->
              <div *ngIf="!loading && !error && (emprendimiento?.administradores ?? []).length > 0" class="overflow-x-auto animate-fade-in">
                <table class="min-w-full divide-y divide-gray-500/20 dark:divide-gray-700/40">
                  <thead class="bg-white/20 dark:bg-gray-800/30 sticky top-0 z-10 shadow-lg">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Usuario</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Email</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Rol</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Estado</th>
                      <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white/5 dark:bg-gray-800/10 divide-y divide-gray-500/20 dark:divide-gray-700/40">
                    <tr *ngFor="let admin of emprendimiento?.administradores; trackBy: trackByAdminId" class="transition-all duration-300 hover:bg-orange-400/10 hover:shadow-xl animate-fade-in">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-12 w-12 relative">
                            <div class="absolute -inset-1 rounded-full bg-gradient-to-br from-orange-400/40 to-orange-600/40 blur-md opacity-70 z-0"></div>
                            <img 
                              *ngIf="admin.foto_perfil_url" 
                              [src]="admin.foto_perfil_url" 
                              [alt]="admin.name"
                              class="h-12 w-12 rounded-full object-cover border-4 border-white/60 shadow-xl relative z-10">
                            <div 
                              *ngIf="!admin.foto_perfil_url" 
                              class="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400/40 to-orange-600/40 flex items-center justify-center border-4 border-white/60 shadow-xl relative z-10">
                              <span class="text-lg font-bold text-white">{{ getInitials(admin.name) }}</span>
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="text-base font-bold text-white">{{ admin.name }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-base text-gray-300">{{ admin.email }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-base text-gray-300 flex items-center gap-2">
                          <svg *ngIf="admin.pivot?.rol === 'administrador'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <svg *ngIf="admin.pivot?.rol === 'colaborador'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2m5-8a3 3 0 110-6 3 3 0 010 6z" />
                          </svg>
                          <svg *ngIf="admin.pivot?.rol === 'moderador'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                          </svg>
                          {{ admin.pivot?.rol | titlecase }}
                          <span *ngIf="admin.pivot?.es_principal" class="ml-1 bg-gradient-to-r from-yellow-400/80 to-yellow-300/80 text-yellow-900 text-xs px-2 py-0.5 rounded-full shadow flex items-center gap-1 animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l14 9-14 9V3z" />
                            </svg>
                            Principal
                          </span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-bold rounded-full shadow-md flex items-center gap-1" 
                              [ngClass]="admin.active ? 'bg-gradient-to-r from-green-500/80 to-green-400/80 text-white' : 'bg-gradient-to-r from-red-500/80 to-red-400/80 text-white'">
                          <svg *ngIf="admin.active" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <svg *ngIf="!admin.active" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          {{ admin.active ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-base font-bold">
                        <button 
                          *ngIf="!admin.pivot?.es_principal"
                          (click)="removeAdministrador(admin)"
                          [disabled]="adminStates[admin.id!].removing"
                          class="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-400 text-white shadow-lg hover:from-red-600 hover:to-red-500 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                          <div *ngIf="adminStates[admin.id!].removing" class="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          <svg *ngIf="!adminStates[admin.id!]?.removing" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          {{ adminStates[admin.id!].removing ? 'Eliminando...' : 'Eliminar' }}
                        </button>
                        <span *ngIf="admin.pivot?.es_principal" class="text-gray-400 dark:text-gray-500 cursor-not-allowed italic">
                          No removible
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    /* Animaciones personalizadas */
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slide-in {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes shake {
      0%, 20%, 50%, 80%, 100% { transform: translateX(0); }
      10%, 30%, 70%, 90% { transform: translateX(-2px); }
      40%, 60% { transform: translateX(2px); }
    }
    
    @keyframes pulse-once {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes gradient-x {
      0%, 100% { background-size: 200% 200%; background-position: left center; }
      50% { background-size: 200% 200%; background-position: right center; }
    }
    
    .animate-fade-in {
      animation: fade-in 0.6s ease-out;
    }
    
    .animate-slide-in {
      animation: slide-in 0.5s ease-out;
    }
    
    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
    
    .animate-pulse-once {
      animation: pulse-once 0.3s ease-in-out;
    }
    
    .animate-gradient-x {
      animation: gradient-x 3s ease infinite;
    }
    
    .animate-shake-on-hover:hover {
      animation: shake 0.3s ease-in-out;
    }
    
    /* Mejoras en el glassmorphism */
    .backdrop-blur-lg {
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    
    /* Efecto hover mejorado para las filas de la tabla */
    tbody tr:hover {
      background: linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(251, 146, 60, 0.05));
      box-shadow: 0 10px 25px rgba(251, 146, 60, 0.1);
      transform: translateY(-1px);
    }
    
    /* Mejoras en el formulario */
    .form-input-focus:focus {
      box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.2), 0 4px 14px rgba(251, 146, 60, 0.15);
    }
    
    /* Efectos en botones */
    button:active {
      transform: scale(0.98);
    }
    
    /* Scrollbar personalizado */
    .overflow-x-auto::-webkit-scrollbar {
      height: 8px;
    }
    
    .overflow-x-auto::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    
    .overflow-x-auto::-webkit-scrollbar-thumb {
      background: rgba(251, 146, 60, 0.5);
      border-radius: 4px;
    }
    
    .overflow-x-auto::-webkit-scrollbar-thumb:hover {
      background: rgba(251, 146, 60, 0.7);
    }
  `]
})
export class AdministradoresListComponent implements OnInit {
  private emprendimientoAdminService = inject(EmprendimientoAdminService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  
  // Estados para el control de cada administrador
  adminStates: { [key: number]: { removing?: boolean } } = {};
  
  // Propiedades principales
  emprendimientoId!: number;
  emprendimiento?: Emprendimiento;
  loading = true;
  error = '';
  addingAdmin = false;

  // Formulario reactivo
  adminForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    
    // Obtener el ID de la ruta padre
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('Administradores - ID recibido:', id); // Debug
      
      if (id && !isNaN(+id)) {
        this.emprendimientoId = +id;
        this.loadEmprendimiento(); // Este SÍ lo mantiene porque maneja estados específicos
      } else {
        console.error('Administradores - ID inválido:', id);
      }
    });
  }

  /**
   * Inicializa el formulario reactivo con validaciones
   */
  private initForm(): void {
    this.adminForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      es_principal: [false]
    });
  }

  /**
   * Carga los datos del emprendimiento y sus administradores
   */
  loadEmprendimiento(): void {
    this.loading = true;
    this.error = '';

    this.emprendimientoAdminService.getEmprendimiento(this.emprendimientoId).subscribe({
      next: (data) => {
        this.emprendimiento = data;
        this.loading = false;
        
        // Inicializar estados de administradores
        if (data.administradores) {
          data.administradores.forEach(admin => {
            if (admin.id) {
              this.adminStates[admin.id] = {};
            }
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar emprendimiento:', err);
        this.error = err.error?.message || 'Error al cargar el emprendimiento';
        this.loading = false;
      }
    });
  }

  /**
   * Refresca los datos del componente
   */
  refreshData(): void {
    this.loadEmprendimiento();
  }

  /**
   * Agrega un nuevo administrador al emprendimiento
   */
  async addAdministrador(): Promise<void> {
    if (this.adminForm.invalid || this.addingAdmin) return;

    this.addingAdmin = true;
    this.error = '';

    try {
      const adminData: AdminRequest = this.adminForm.value;
      
      await this.emprendimientoAdminService.addAdministrador(this.emprendimientoId, adminData).toPromise();
      
      // Reset form
      this.adminForm.reset({
        email: '',
        rol: '',
        es_principal: false
      });
      
      // Marcar como pristine para limpiar validaciones
      this.adminForm.markAsUntouched();
      this.adminForm.markAsPristine();
      
      // Recargar datos
      this.loadEmprendimiento();
      
      // Mostrar mensaje de éxito
      this.showSuccessMessage('Administrador agregado correctamente');
      
    } catch (err: any) {
      console.error('Error al agregar administrador:', err);
      this.error = err.error?.message || 'Error al agregar el administrador';
    } finally {
      this.addingAdmin = false;
    }
  }

  /**
   * Elimina un administrador del emprendimiento
   */
  async removeAdministrador(admin: User): Promise<void> {
    if (!admin.id || this.adminStates[admin.id]?.removing || admin.pivot?.es_principal) return;

    const confirmMessage = `¿Estás seguro de que quieres eliminar a ${admin.name} como administrador?\n\nEsta acción no se puede deshacer.`;
    
    if (!confirm(confirmMessage)) return;

    // Marcar como eliminando
    this.adminStates[admin.id] = { removing: true };

    try {
      await this.emprendimientoAdminService.removeAdministrador(this.emprendimientoId, admin.id).toPromise();
      
      // Actualizar lista local
      if (this.emprendimiento?.administradores) {
        this.emprendimiento.administradores = this.emprendimiento.administradores.filter(a => a.id !== admin.id);
      }
      
      // Limpiar estado
      delete this.adminStates[admin.id];
      
      // Mostrar mensaje de éxito
      this.showSuccessMessage('Administrador eliminado correctamente');
      
    } catch (err: any) {
      console.error('Error al eliminar administrador:', err);
      this.error = err.error?.message || 'Error al eliminar el administrador';
      
      // Restaurar estado
      this.adminStates[admin.id] = { removing: false };
    }
  }

  /**
   * Obtiene las iniciales de un nombre para mostrar en el avatar
   */
  getInitials(name: string): string {
    if (!name) return '?';
    
    const parts = name.trim().split(' ').filter(part => part.length > 0);
    
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * TrackBy function para mejorar performance en ngFor
   */
  trackByAdminId(index: number, admin: User): number {
    return admin.id || index;
  }

  /**
   * Muestra un mensaje de éxito temporal
   */
  private showSuccessMessage(message: string): void {
    // Implementar notificación toast o alert temporal
    // Por ahora usamos alert, pero se puede mejorar con un servicio de notificaciones
    alert(message);
  }

  /**
   * Getter para obtener el rol traducido
   */
  getRolDisplayName(rol: string): string {
    const roles: { [key: string]: string } = {
      'administrador': 'Administrador',
      'colaborador': 'Colaborador',
      'moderador': 'Moderador'
    };
    return roles[rol] || rol;
  }

  /**
   * Verifica si un usuario puede ser eliminado
   */
  canRemoveAdmin(admin: User): boolean {
    return !admin.pivot?.es_principal && !this.adminStates[admin.id!]?.removing;
  }

  /**
   * Obtiene el color del rol para la UI
   */
  getRolColor(rol: string): string {
    const colors: { [key: string]: string } = {
      'administrador': 'text-blue-300',
      'colaborador': 'text-green-300',
      'moderador': 'text-purple-300'
    };
    return colors[rol] || 'text-gray-300';
  }
}