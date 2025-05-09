import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { EmprendimientosService, Emprendimiento, AdminRequest } from '../../../core/services/emprendimientos.service';
import { UsersService } from '../../../core/services/users.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-administradores-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <!-- Barra Superior -->
      <header class="bg-white dark:bg-gray-800 shadow">
        <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {{ emprendimiento ? 'Administradores: ' + emprendimiento.nombre : 'Cargando administradores...' }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gestiona los administradores de tu emprendimiento</p>
          </div>
          <div class="flex items-center space-x-4">
            <a [routerLink]="['/mis-emprendimientos']" class="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Volver a Emprendimientos
            </a>
          </div>
        </div>
      </header>
      
      <!-- Contenido Principal -->
      <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <!-- Estado de Carga -->
        <div *ngIf="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
        
        <!-- Error -->
        <div *ngIf="error" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-300">{{ error }}</h3>
              <div class="mt-4">
                <button (click)="loadEmprendimiento()" class="rounded-md bg-red-50 dark:bg-red-900 px-3 py-2 text-sm font-medium text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800">
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Formulario para Agregar Administrador -->
        <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-6">
          <div class="p-5">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Agregar Nuevo Administrador</h2>
            
            <form [formGroup]="adminForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email del Usuario *</label>
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email" 
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="Ingresa el email del usuario">
                <div *ngIf="submitted && f['email'].errors" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  <span *ngIf="f['email'].errors['required']">El email es requerido</span>
                  <span *ngIf="f['email'].errors['email']">El formato del email no es válido</span>
                </div>
              </div>
              
              <div>
                <label for="rol" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Rol *</label>
                <select 
                  id="rol" 
                  formControlName="rol" 
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-orange-500 focus:ring-orange-500">
                  <option value="administrador">Administrador</option>
                  <option value="colaborador">Colaborador</option>
                </select>
                <div *ngIf="submitted && f['rol'].errors" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  <span *ngIf="f['rol'].errors['required']">El rol es requerido</span>
                </div>
              </div>
              
              <div class="flex justify-end">
                <button
                  type="submit"
                  [disabled]="submitting"
                  class="inline-flex justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                  <span *ngIf="submitting" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></span>
                  Agregar Administrador
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Lista de Administradores -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="p-5">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Administradores Actuales</h2>
            
            <!-- Sin Administradores -->
            <div *ngIf="!loading && !error && (!administradores || administradores.length === 0)" class="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No hay administradores</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Este emprendimiento aún no tiene administradores registrados.</p>
            </div>
            
            <!-- Tabla de Administradores -->
            <div *ngIf="!loading && !error && administradores && administradores.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuario</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rol</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr *ngFor="let admin of administradores">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <img 
                            *ngIf="admin.foto_perfil_url || admin.avatar" 
                            [src]="admin.foto_perfil_url || admin.avatar" 
                            [alt]="admin.name"
                            class="h-10 w-10 rounded-full object-cover">
                          <div 
                            *ngIf="!admin.foto_perfil_url && !admin.avatar" 
                            class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ getInitials(admin.name) }}</span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">{{ admin.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ admin.email }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ admin.pivot?.rol || 'Administrador' }}
                        <span *ngIf="admin.pivot?.es_principal" class="ml-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 text-xs px-2 py-0.5 rounded-full">Principal</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                            [ngClass]="admin.active ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'">
                        {{ admin.active ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        *ngIf="!admin.pivot?.es_principal"
                        (click)="confirmRemoveAdmin(admin)"
                        class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                        Eliminar
                      </button>
                      <span *ngIf="admin.pivot?.es_principal" class="text-gray-400 dark:text-gray-500 cursor-not-allowed">
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
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdministradoresListComponent implements OnInit {
  private emprendimientosService = inject(EmprendimientosService);
  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  
  emprendimientoId: number = 0;
  emprendimiento: Emprendimiento | null = null;
  administradores: User[] = [];
  
  loading = true;
  submitting = false;
  submitted = false;
  error = '';
  
  adminForm: FormGroup;
  
  constructor() {
    this.adminForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      rol: ['administrador', [Validators.required]]
    });
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.emprendimientoId = +params['id'];
      this.loadEmprendimiento();
    });
  }
  
  get f() {
    return this.adminForm.controls;
  }
  
  loadEmprendimiento(): void {
    this.loading = true;
    this.error = '';
    
    this.emprendimientosService.getEmprendimiento(this.emprendimientoId).subscribe({
      next: (data) => {
        this.emprendimiento = data;
        this.administradores = data.administradores || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar emprendimiento:', err);
        this.error = err.error?.message || 'Error al cargar el emprendimiento. Inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.adminForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    const adminData: AdminRequest = {
      email: this.adminForm.value.email,
      rol: this.adminForm.value.rol,
      es_principal: false // Siempre false desde esta interfaz
    };
    
    this.emprendimientosService.addAdministrador(this.emprendimientoId, adminData).subscribe({
      next: () => {
        // Recargar lista de administradores
        this.loadEmprendimiento();
        this.adminForm.reset({
          email: '',
          rol: 'administrador'
        });
        this.submitted = false;
        this.submitting = false;
        alert('Administrador agregado correctamente');
      },
      error: (err) => {
        console.error('Error al agregar administrador:', err);
        this.error = err.error?.message || 'Error al agregar el administrador. Inténtalo de nuevo.';
        this.submitting = false;
      }
    });
  }
  
  confirmRemoveAdmin(admin: User): void {
    if (confirm(`¿Estás seguro de que deseas eliminar a "${admin.name}" como administrador? Esta acción no se puede deshacer.`)) {
      this.removeAdmin(admin.id!);
    }
  }
  
  removeAdmin(userId: number): void {
    this.emprendimientosService.removeAdministrador(this.emprendimientoId, userId).subscribe({
      next: () => {
        // Actualizar la lista de administradores
        this.administradores = this.administradores.filter(a => a.id !== userId);
        alert('Administrador eliminado correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar administrador:', err);
        this.error = err.error?.message || 'Error al eliminar el administrador. Inténtalo de nuevo.';
      }
    });
  }
  
  getInitials(name: string): string {
    if (!name) return '';
    
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}