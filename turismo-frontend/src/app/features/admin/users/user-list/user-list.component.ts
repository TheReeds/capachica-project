// src/app/features/admin/users/user-list/user-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService, PaginatedResponse } from '../../../../core/services/admin.service';
import { User } from '../../../../core/models/user.model';
import { AdminLayoutComponent } from '../../../../shared/layouts/admin-layout/admin-layout.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <div class="mt-4 sm:mt-0">
            <a 
              routerLink="/admin/users/create" 
              class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Nuevo Usuario
            </a>
          </div>
        </div>
        
        <!-- Filtros -->
        <div class="rounded-lg bg-white p-6 shadow-sm">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label for="search" class="block text-sm font-medium text-gray-700">Buscar</label>
              <div class="mt-1">
                <input 
                  type="text" 
                  id="search" 
                  [(ngModel)]="filters.search" 
                  placeholder="Nombre o email" 
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
              </div>
            </div>
            
            <div>
              <label for="active" class="block text-sm font-medium text-gray-700">Estado</label>
              <div class="mt-1">
                <select 
                  id="active" 
                  [(ngModel)]="filters.active" 
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option [ngValue]="undefined">Todos</option>
                  <option [ngValue]="true">Activos</option>
                  <option [ngValue]="false">Inactivos</option>
                </select>
              </div>
            </div>
            
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700">Rol</label>
              <div class="mt-1">
                <select 
                  id="role" 
                  [(ngModel)]="filters.role" 
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  @for (role of roles; track role.id) {
                    <option [value]="role.name">{{ role.name }}</option>
                  }
                </select>
              </div>
            </div>
            
            <div class="flex items-end">
              <button 
                type="button" 
                (click)="applyFilters()" 
                class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                Filtrar
              </button>
            </div>
          </div>
        </div>
        
        <!-- Tabla de usuarios -->
        <div class="rounded-lg bg-white shadow-sm overflow-hidden">
          @if (loading) {
            <div class="flex justify-center items-center p-8">
              <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
              <span class="ml-4">Cargando usuarios...</span>
            </div>
          } @else if (users.length === 0) {
            <div class="p-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron usuarios</h3>
              <p class="mt-1 text-sm text-gray-500">Comienza creando un nuevo usuario.</p>
              <div class="mt-6">
                <a routerLink="/admin/users/create" class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                  <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Nuevo Usuario
                </a>
              </div>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (user of users; track user.id) {
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
                            <span class="text-primary-800 font-medium">{{ getUserInitials(user) }}</span>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                            <div class="text-sm text-gray-500">{{ user.first_name }} {{ user.last_name }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ user.email }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ user.phone }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex flex-wrap gap-1">
                          @if (user.roles?.length) {
                            @for (role of user.roles; track role.id) {
                              <span class="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                {{ role.name }}
                              </span>
                            }
                          } @else {
                            <span class="text-xs text-gray-500">Sin roles</span>
                          }
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        @if (user.active) {
                          <span class="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Activo
                          </span>
                        } @else {
                          <span class="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            Inactivo
                          </span>
                        }
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex items-center justify-end space-x-2">
                          @if (user.active) {
                            <button 
                              (click)="deactivateUser(user)" 
                              class="text-red-600 hover:text-red-900"
                              title="Desactivar"
                            >
                              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                              </svg>
                            </button>
                          } @else {
                            <button 
                              (click)="activateUser(user)" 
                              class="text-green-600 hover:text-green-900"
                              title="Activar"
                            >
                              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </button>
                          }
                          
                          <a 
                            [routerLink]="['/admin/users/edit', user.id]" 
                            class="text-primary-600 hover:text-primary-900"
                            title="Editar"
                          >
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </a>
                          
                          <a 
                            [routerLink]="['/admin/users', user.id, 'permissions']" 
                            class="text-primary-600 hover:text-primary-900"
                            title="Permisos"
                          >
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                            </svg>
                          </a>
                          
                          <button 
                            (click)="deleteUser(user)" 
                            class="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            
            <!-- Paginación -->
            @if (pagination) {
              <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm text-gray-700">
                      Mostrando <span class="font-medium">{{ pagination.from || 0 }}</span> a <span class="font-medium">{{ pagination.to || 0 }}</span> de <span class="font-medium">{{ pagination.total }}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        (click)="goToPage(currentPage - 1)"
                        [disabled]="!pagination.prev_page_url"
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        [class.opacity-50]="!pagination.prev_page_url"
                        [class.cursor-not-allowed]="!pagination.prev_page_url"
                      >
                        <span class="sr-only">Anterior</span>
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                      </button>
                      
                      @for (link of pagination.links; track $index) {
                        @if (link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;') {
                          <button
                            (click)="goToPage(+link.label)"
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
                            [class.bg-primary-50]="link.active"
                            [class.text-primary-600]="link.active"
                            [class.text-gray-700]="!link.active"
                            [class.hover:bg-gray-50]="!link.active"
                            [disabled]="link.active"
                          >
                            {{ link.label }}
                          </button>
                        }
                      }
                      
                      <button
                        (click)="goToPage(currentPage + 1)"
                        [disabled]="!pagination.next_page_url"
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        [class.opacity-50]="!pagination.next_page_url"
                        [class.cursor-not-allowed]="!pagination.next_page_url"
                      >
                        <span class="sr-only">Siguiente</span>
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            }
          }
        </div>
      </div>
  `,
})
export class UserListComponent implements OnInit {
  private adminService = inject(AdminService);
  
  users: User[] = [];
  roles: any[] = [];
  loading = true;
  
  pagination: any = null;
  currentPage = 1;
  itemsPerPage = 10;
  
  filters = {
    search: '',
    active: undefined as boolean | undefined,
    role: ''
  };
  
  ngOnInit() {
    this.loadRoles();
    this.loadUsers();
  }
  
  loadRoles() {
    this.adminService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      }
    });
  }
  
  loadUsers() {
    this.loading = true;
    this.adminService.getUsers(
      this.currentPage, 
      this.itemsPerPage, 
      this.filters.active, 
      this.filters.role, 
      this.filters.search
    ).subscribe({
      next: (response) => {
        this.users = response.data;
        this.pagination = {
          current_page: response.current_page,
          from: response.from,
          to: response.to,
          total: response.total,
          last_page: response.last_page,
          links: response.links,
          next_page_url: response.next_page_url,
          prev_page_url: response.prev_page_url
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  
  getUserInitials(user: User): string {
    if (!user || !user.name) return '';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  }
  
  applyFilters() {
    this.currentPage = 1;
    this.loadUsers();
  }
  
  goToPage(page: number) {
    if (page < 1 || (this.pagination && page > this.pagination.last_page)) {
      return;
    }
    
    this.currentPage = page;
    this.loadUsers();
  }
  
  activateUser(user: User) {
    if (!user.id) return;
    
    if (confirm(`¿Estás seguro de que deseas activar al usuario ${user.name}?`)) {
      this.adminService.activateUser(user.id).subscribe({
        next: () => {
          user.active = true;
          alert(`El usuario ${user.name} ha sido activado correctamente.`);
        },
        error: (error) => {
          console.error('Error al activar usuario:', error);
          alert(`Error al activar al usuario: ${error.error?.message || 'Ha ocurrido un error'}`);
        }
      });
    }
  }
  
  deactivateUser(user: User) {
    if (!user.id) return;
    
    if (confirm(`¿Estás seguro de que deseas desactivar al usuario ${user.name}?`)) {
      this.adminService.deactivateUser(user.id).subscribe({
        next: () => {
          user.active = false;
          alert(`El usuario ${user.name} ha sido desactivado correctamente.`);
        },
        error: (error) => {
          console.error('Error al desactivar usuario:', error);
          alert(`Error al desactivar al usuario: ${error.error?.message || 'Ha ocurrido un error'}`);
        }
      });
    }
  }
  
  deleteUser(user: User) {
    if (!user.id) return;
    
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.name}? Esta acción no se puede deshacer.`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          alert(`El usuario ${user.name} ha sido eliminado correctamente.`);
          
          // Si ya no hay usuarios en la página actual y no es la primera página, ir a la anterior
          if (this.users.length === 0 && this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
          } else {
            this.loadUsers();
          }
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert(`Error al eliminar al usuario: ${error.error?.message || 'Ha ocurrido un error'}`);
        }
      });
    }
  }
}