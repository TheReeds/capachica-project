import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { AdminLayoutComponent } from '../../../../shared/layouts/admin-layout/admin-layout.component';
import { Permission } from '../../../../core/models/user.model';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  template: `
      <div class="space-y-6">
        <div class="sm:flex sm:items-center sm:justify-between">
          <h1 class="text-2xl font-bold text-gray-900">{{ isEditMode ? 'Editar Rol' : 'Crear Rol' }}</h1>
          <div class="mt-4 sm:mt-0">
            <a 
              routerLink="/admin/roles" 
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver al listado
            </a>
          </div>
        </div>
        
        <div class="bg-white shadow-sm rounded-lg">
          @if (loading) {
            <div class="flex justify-center items-center p-8">
              <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
              <span class="ml-4">Cargando...</span>
            </div>
          } @else {
            <form [formGroup]="roleForm" (ngSubmit)="onSubmit()" class="space-y-6 p-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Nombre del rol</label>
                <div class="mt-1">
                  <input 
                    type="text" 
                    id="name" 
                    formControlName="name" 
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" 
                    [ngClass]="{'border-red-300': isFieldInvalid('name')}"
                    placeholder="editor, manager, etc."
                  />
                  @if (isFieldInvalid('name')) {
                    <p class="mt-2 text-sm text-red-600">El nombre del rol es requerido</p>
                  }
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Permisos</label>
                <p class="mt-1 text-sm text-gray-500">Seleccione los permisos que tendrán los usuarios con este rol.</p>
                
                <div class="mt-4">
                  @if (loading) {
                    <div class="flex justify-center items-center p-4">
                      <div class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary-400 border-r-transparent"></div>
                      <span class="ml-2 text-sm">Cargando permisos...</span>
                    </div>
                  } @else if (availablePermissions.length === 0) {
                    <p class="text-sm text-gray-500">No hay permisos disponibles.</p>
                  } @else {
                    <!-- Buscador de permisos -->
                    <div class="mb-4">
                      <input 
                        type="text" 
                        placeholder="Buscar permisos..." 
                        [(ngModel)]="searchTerm" 
                        [ngModelOptions]="{standalone: true}"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    
                    <!-- Acciones rápidas -->
                    <div class="mb-4 flex space-x-2">
                      <button 
                        type="button" 
                        (click)="selectAllPermissions()" 
                        class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                      >
                        Seleccionar todo
                      </button>
                      <button 
                        type="button" 
                        (click)="clearAllPermissions()" 
                        class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                      >
                        Deseleccionar todo
                      </button>
                    </div>
                    
                    <!-- Secciones de permisos agrupadas -->
                    <div class="mt-4 space-y-5">
                      @for (group of getPermissionGroups(); track group.groupName) {
                        <div class="border border-gray-200 rounded-md p-4">
                          <div class="flex items-center justify-between">
                            <h3 class="text-sm font-medium text-gray-900">{{ group.groupName }}</h3>
                            <div class="flex items-center">
                              <button 
                                type="button" 
                                (click)="selectGroupPermissions(group.permissions)" 
                                class="mr-2 text-xs text-primary-600 hover:text-primary-900"
                              >
                                Seleccionar grupo
                              </button>
                              <button 
                                type="button" 
                                (click)="clearGroupPermissions(group.permissions)" 
                                class="text-xs text-gray-600 hover:text-gray-900"
                              >
                                Deseleccionar grupo
                              </button>
                            </div>
                          </div>
                          
                          <div class="mt-2 grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
                            @for (permission of filterPermissions(group.permissions); track permission.id) {
                              <div class="flex items-center">
                                <input 
                                  type="checkbox" 
                                  [id]="'permission-' + permission.id" 
                                  [value]="permission.name" 
                                  [checked]="isPermissionSelected(permission.name)"
                                  (change)="togglePermission(permission.name)"
                                  class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <label [for]="'permission-' + permission.id" class="ml-2 block text-sm text-gray-700">
                                  {{ getDisplayName(permission.name) }}
                                </label>
                              </div>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
                
                @if (roleForm.get('permissions')?.value.length === 0 && submitted) {
                  <p class="mt-2 text-sm text-red-600">Seleccione al menos un permiso</p>
                }
              </div>
              
              @if (error) {
                <div class="rounded-md bg-red-50 p-4">
                  <div class="flex">
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
                    </div>
                  </div>
                </div>
              }
              
              <div class="flex justify-end space-x-3">
                <button 
                  type="button"
                  routerLink="/admin/roles"
                  class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Cancelar
                </button>
                
                <button 
                  type="submit" 
                  class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  [disabled]="saving"
                >
                  @if (saving) {
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  } @else {
                    {{ isEditMode ? 'Actualizar' : 'Crear' }}
                  }
                </button>
              </div>
            </form>
          }
        </div>
      </div>
  `,
})
export class RoleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  roleForm!: FormGroup;
  availablePermissions: Permission[] = [];
  roleId: number | null = null;
  
  loading = true;
  saving = false;
  submitted = false;
  error = '';
  searchTerm = '';
  
  get isEditMode(): boolean {
    return this.roleId !== null;
  }
  
  ngOnInit() {
    this.initForm();
    this.loadPermissions();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.roleId = +id;
      this.loadRole(this.roleId);
    } else {
      this.loading = false;
    }
  }
  
  initForm() {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      permissions: [[], Validators.required]
    });
  }
  
  loadPermissions() {
    this.adminService.getPermissions().subscribe({
      next: (permissions) => {
        this.availablePermissions = permissions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar permisos:', error);
        this.error = 'Error al cargar los permisos. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }
  
  loadRole(id: number) {
    this.loading = true;
    this.adminService.getRole(id).subscribe({
      next: (role) => {
        // Establecer valores del formulario
        this.roleForm.patchValue({
          name: role.name,
          permissions: this.getPermissionNames(role.permissions)
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar rol:', error);
        this.error = 'Error al cargar los datos del rol. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }
  
  getPermissionNames(permissions: any): string[] {
    if (!permissions) return [];
    
    if (typeof permissions[0] === 'string') {
      return permissions as string[];
    }
    
    return (permissions as any[]).map(p => p.name);
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.roleForm.get(fieldName);
    return (field?.invalid && (field?.dirty || field?.touched || this.submitted)) || false;
  }
  
  isPermissionSelected(permissionName: string): boolean {
    const permissions = this.roleForm.get('permissions')?.value || [];
    return permissions.includes(permissionName);
  }
  
  togglePermission(permissionName: string) {
    const permissions = [...this.roleForm.get('permissions')?.value || []];
    
    if (this.isPermissionSelected(permissionName)) {
      const index = permissions.indexOf(permissionName);
      if (index !== -1) {
        permissions.splice(index, 1);
      }
    } else {
      permissions.push(permissionName);
    }
    
    this.roleForm.get('permissions')?.setValue(permissions);
  }
  
  selectAllPermissions() {
    const allPermissions = this.availablePermissions.map(p => p.name);
    this.roleForm.get('permissions')?.setValue(allPermissions);
  }
  
  clearAllPermissions() {
    this.roleForm.get('permissions')?.setValue([]);
  }
  
  selectGroupPermissions(permissions: Permission[]) {
    const currentPermissions = [...this.roleForm.get('permissions')?.value || []];
    const permissionNames = permissions.map(p => p.name);
    
    permissionNames.forEach(name => {
      if (!currentPermissions.includes(name)) {
        currentPermissions.push(name);
      }
    });
    
    this.roleForm.get('permissions')?.setValue(currentPermissions);
  }
  
  clearGroupPermissions(permissions: Permission[]) {
    const currentPermissions = [...this.roleForm.get('permissions')?.value || []];
    const permissionNames = permissions.map(p => p.name);
    
    const filteredPermissions = currentPermissions.filter(name => !permissionNames.includes(name));
    this.roleForm.get('permissions')?.setValue(filteredPermissions);
  }
  
  getPermissionGroups() {
    const groups: { groupName: string, permissions: Permission[] }[] = [];
    const permissionsByPrefix: { [key: string]: Permission[] } = {};
    
    this.availablePermissions.forEach(permission => {
      const nameParts = permission.name.split('_');
      const prefix = nameParts[0];
      
      if (!permissionsByPrefix[prefix]) {
        permissionsByPrefix[prefix] = [];
      }
      
      permissionsByPrefix[prefix].push(permission);
    });
    
    Object.keys(permissionsByPrefix).forEach(prefix => {
      groups.push({
        groupName: this.capitalizeFirstLetter(prefix),
        permissions: permissionsByPrefix[prefix]
      });
    });
    
    return groups;
  }
  
  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  getDisplayName(permissionName: string): string {
    const parts = permissionName.split('_');
    if (parts.length < 2) return permissionName;
    
    const action = parts[1];
    return this.capitalizeFirstLetter(action);
  }
  
  filterPermissions(permissions: Permission[]): Permission[] {
    if (!this.searchTerm.trim()) return permissions;
    
    return permissions.filter(permission => 
      permission.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  onSubmit() {
    this.submitted = true;
    this.error = '';
    
    if (this.roleForm.invalid) {
      return;
    }
    
    this.saving = true;
    
    if (this.isEditMode && this.roleId) {
      // Actualizar rol existente
      this.adminService.updateRole(this.roleId, this.roleForm.value).subscribe({
        next: () => {
          this.saving = false;
          alert('Rol actualizado correctamente');
          this.router.navigate(['/admin/roles']);
        },
        error: (error) => {
          console.error('Error al actualizar rol:', error);
          this.error = error.error?.message || 'Error al actualizar el rol. Por favor, intente nuevamente.';
          this.saving = false;
        }
      });
    } else {
      // Crear nuevo rol
      this.adminService.createRole(this.roleForm.value).subscribe({
        next: () => {
          this.saving = false;
          alert('Rol creado correctamente');
          this.router.navigate(['/admin/roles']);
        },
        error: (error) => {
          console.error('Error al crear rol:', error);
          this.error = error.error?.message || 'Error al crear el rol. Por favor, intente nuevamente.';
          this.saving = false;
        }
      });
    }
  }
}