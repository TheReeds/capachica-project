import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FormsModule],
  template: `
    <app-header></app-header>
    
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div class="card">
          <h2 class="text-lg font-medium text-gray-900">Bienvenido, {{ user?.name || 'Usuario' }}</h2>
          <p class="mt-1 text-sm text-gray-600">Has iniciado sesión correctamente.</p>
          
          <div class="mt-4">
            <h3 class="text-md font-medium text-gray-900">Tus datos:</h3>
            <ul class="mt-2 text-sm text-gray-600 space-y-1">
              <li><strong>Nombre:</strong> {{ user?.first_name }}</li>
              <li><strong>Apellido:</strong> {{ user?.last_name }}</li>
              <li><strong>Email:</strong> {{ user?.email }}</li>
              <li><strong>Teléfono:</strong> {{ user?.phone }}</li>
            </ul>
          </div>
          
          <div class="mt-4">
            <a routerLink="/profile" class="btn-secondary inline-block">
              Ver perfil completo
            </a>
          </div>
        </div>
        
        <div class="card">
          <h2 class="text-lg font-medium text-gray-900">Roles y permisos</h2>
          <p class="mt-1 text-sm text-gray-600">Gestiona los roles y permisos del sistema.</p>
          
          <div class="mt-4">
            <button (click)="loadRoles()" class="btn-secondary">
              @if (loadingRoles) {
                <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></span>
                Cargando...
              } @else {
                Ver roles
              }
            </button>
          </div>
          
          @if (roles.length > 0) {
            <div class="mt-4">
              <h3 class="text-md font-medium text-gray-900">Roles disponibles:</h3>
              <ul class="mt-2 text-sm text-gray-600 space-y-1">
                @for (role of roles; track role.id) {
                  <li>
                    <strong>{{ role.name }}</strong>
                    <span class="text-xs text-gray-500">
                      ({{ role.permissions.length }} permisos)
                    </span>
                  </li>
                }
              </ul>
            </div>
          }
        </div>
        
        <div class="card">
          <h2 class="text-lg font-medium text-gray-900">Crear nuevo rol</h2>
          <p class="mt-1 text-sm text-gray-600">Define un nuevo rol con permisos específicos.</p>
          
          <div class="mt-4">
            <label class="form-label">Nombre del rol</label>
            <input 
              type="text" 
              class="form-input" 
              [(ngModel)]="newRoleName" 
              placeholder="editor, manager, etc."
            />
          </div>
          
          <div class="mt-4">
            <label class="form-label">Permisos (separados por coma)</label>
            <input 
              type="text" 
              class="form-input" 
              [(ngModel)]="newRolePermissions" 
              placeholder="user_read, role_read, etc."
            />
          </div>
          
          @if (roleError) {
            <div class="mt-2 text-sm text-red-600">{{ roleError }}</div>
          }
          
          <div class="mt-4">
            <button (click)="createRole()" class="btn-primary" [disabled]="creatingRole">
              @if (creatingRole) {
                <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Creando...
              } @else {
                Crear rol
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  private authService = inject(AuthService);
  
  user = this.authService.currentUser();
  roles: any[] = [];
  
  loadingRoles = false;
  newRoleName = '';
  newRolePermissions = '';
  roleError = '';
  creatingRole = false;
  
  loadRoles() {
    this.loadingRoles = true;
    this.authService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loadingRoles = false;
      },
      error: () => {
        this.loadingRoles = false;
      }
    });
  }
  
  createRole() {
    if (!this.newRoleName || !this.newRolePermissions) {
      this.roleError = 'Por favor complete todos los campos';
      return;
    }
    
    const permissions = this.newRolePermissions
      .split(',')
      .map(p => p.trim())
      .filter(p => p);
      
    if (permissions.length === 0) {
      this.roleError = 'Debe especificar al menos un permiso';
      return;
    }
    
    this.roleError = '';
    this.creatingRole = true;
    
    this.authService.createRole({
      name: this.newRoleName,
      permissions
    }).subscribe({
      next: (role) => {
        this.roles.push(role);
        this.newRoleName = '';
        this.newRolePermissions = '';
        this.creatingRole = false;
      },
      error: (err) => {
        this.roleError = err.error?.message || 'Error al crear el rol';
        this.creatingRole = false;
      }
    });
  }
}