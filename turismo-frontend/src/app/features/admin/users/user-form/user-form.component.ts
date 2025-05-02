import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { AdminLayoutComponent } from '../../../../shared/layouts/admin-layout/admin-layout.component';
import { Role, User } from '../../../../core/models/user.model';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
      <div class="space-y-6">
        <div class="sm:flex sm:items-center sm:justify-between">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isEditMode ? 'Editar Usuario' : 'Crear Usuario' }}</h1>
          <div class="mt-4 sm:mt-0">
            <a 
              routerLink="/admin/users" 
              class="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
            >
              <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver al listado
            </a>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg transition-colors duration-200">
          @if (loading) {
            <div class="flex justify-center items-center p-8">
              <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 dark:border-primary-600 border-r-transparent"></div>
              <span class="ml-4 text-gray-700 dark:text-gray-300">Cargando...</span>
            </div>
          } @else {
            <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-6 p-6">
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <!-- Nombre completo -->
                <div class="sm:col-span-6">
                  <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre completo</label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="name" 
                      formControlName="name" 
                      class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200" 
                      [ngClass]="{'border-red-300 dark:border-red-600': isFieldInvalid('name')}"
                    />
                    @if (isFieldInvalid('name')) {
                      <p class="mt-2 text-sm text-red-600 dark:text-red-400">El nombre completo es requerido</p>
                    }
                  </div>
                </div>
                
                <!-- Nombre -->
                <div class="sm:col-span-3">
                  <label for="first_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="first_name" 
                      formControlName="first_name" 
                      class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200" 
                      [ngClass]="{'border-red-300 dark:border-red-600': isFieldInvalid('first_name')}"
                    />
                    @if (isFieldInvalid('first_name')) {
                      <p class="mt-2 text-sm text-red-600 dark:text-red-400">El nombre es requerido</p>
                    }
                  </div>
                </div>
                
                <!-- Apellido -->
                <div class="sm:col-span-3">
                  <label for="last_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Apellido</label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="last_name" 
                      formControlName="last_name" 
                      class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"  
                      [ngClass]="{'border-red-300 dark:border-red-600': isFieldInvalid('last_name')}"
                    />
                    @if (isFieldInvalid('last_name')) {
                      <p class="mt-2 text-sm text-red-600 dark:text-red-400">El apellido es requerido</p>
                    }
                  </div>
                </div>
                
                <!-- Email -->
                <div class="sm:col-span-3">
                  <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo electrónico</label>
                  <div class="mt-1">
                    <input 
                      type="email" 
                      id="email" 
                      formControlName="email" 
                      class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"  
                      [ngClass]="{'border-red-300 dark:border-red-600': isFieldInvalid('email')}"
                    />
                    @if (isFieldInvalid('email')) {
                      <p class="mt-2 text-sm text-red-600 dark:text-red-400">
                        @if (userForm.get('email')?.errors?.['required']) {
                          El correo electrónico es requerido
                        } @else if (userForm.get('email')?.errors?.['email']) {
                          Ingrese un correo electrónico válido
                        }
                      </p>
                    }
                  </div>
                </div>
                
                <!-- Teléfono -->
                <div class="sm:col-span-3">
                  <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
                  <div class="mt-1">
                    <input 
                      type="tel" 
                      id="phone" 
                      formControlName="phone" 
                      class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"  
                      [ngClass]="{'border-red-300 dark:border-red-600': isFieldInvalid('phone')}"
                    />
                    @if (isFieldInvalid('phone')) {
                      <p class="mt-2 text-sm text-red-600 dark:text-red-400">El teléfono es requerido</p>
                    }
                  </div>
                </div>
                
                <!-- Contraseña -->
                <div class="sm:col-span-3">
                  <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                  <div class="mt-1">
                    <input 
                      type="password" 
                      id="password" 
                      formControlName="password" 
                      class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"  
                      [ngClass]="{'border-red-300 dark:border-red-600': isFieldInvalid('password')}"
                    />
                    @if (isFieldInvalid('password')) {
                      <p class="mt-2 text-sm text-red-600 dark:text-red-400">
                        @if (userForm.get('password')?.errors?.['required']) {
                          La contraseña es requerida
                        } @else if (userForm.get('password')?.errors?.['minlength']) {
                          La contraseña debe tener al menos 8 caracteres
                        }
                      </p>
                    }
                    @if (isEditMode) {
                      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Dejar en blanco para mantener la contraseña actual</p>
                    }
                  </div>
                </div>
                
                <!-- Confirmar Contraseña -->
                <div class="sm:col-span-3">
                  <label for="password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar contraseña</label>
                  <div class="mt-1">
                    <input 
                      type="password" 
                      id="password_confirmation" 
                      formControlName="password_confirmation" 
                      class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"  
                      [ngClass]="{'border-red-300 dark:border-red-600': isFieldInvalid('password_confirmation')}"
                    />
                    @if (isFieldInvalid('password_confirmation')) {
                      <p class="mt-2 text-sm text-red-600 dark:text-red-400">
                        @if (userForm.get('password_confirmation')?.errors?.['required']) {
                          La confirmación de contraseña es requerida
                        } @else if (userForm.get('password_confirmation')?.errors?.['mustMatch']) {
                          Las contraseñas no coinciden
                        }
                      </p>
                    }
                  </div>
                </div>
                
                <!-- Estado -->
                <div class="sm:col-span-3">
                  <label for="active" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                  <div class="mt-1">
                    <select 
                      id="active" 
                      formControlName="active" 
                      class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200" 
                    >
                      <option [ngValue]="true">Activo</option>
                      <option [ngValue]="false">Inactivo</option>
                    </select>
                  </div>
                </div>
                
                <!-- Roles -->
                <div class="sm:col-span-6">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Roles</label>
                  <div class="mt-2 space-y-2">
                    @for (role of availableRoles; track role.id) {
                      <div class="flex items-center">
                        <input 
                          type="checkbox" 
                          [id]="'role-' + role.id" 
                          [value]="role.name" 
                          (change)="onRoleChange($event)" 
                          [checked]="isRoleSelected(role.name)"
                          class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200" 
                        />
                        <label [for]="'role-' + role.id" class="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {{ role.name }}
                        </label>
                      </div>
                    }
                  </div>
                  @if (userForm.get('roles')?.value.length === 0 && submitted) {
                    <p class="mt-2 text-sm text-red-600 dark:text-red-400">Seleccione al menos un rol</p>
                  }
                </div>
              </div>
              
              @if (error) {
                <div class="rounded-md bg-red-50 dark:bg-red-900/20 p-4 transition-colors duration-200">
                  <div class="flex">
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800 dark:text-red-300">{{ error }}</h3>
                    </div>
                  </div>
                </div>
              }
              
              <div class="flex justify-end space-x-3">
                <button 
                  type="button"
                  routerLink="/admin/users"
                  class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 transition-colors duration-200"
                >
                  Cancelar
                </button>
                
                <button 
                  type="submit" 
                  class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 dark:bg-primary-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 transition-colors duration-200"
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
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private themeService = inject(ThemeService);
  
  userForm!: FormGroup;
  availableRoles: Role[] = [];
  userId: number | null = null;
  originalRoles: string[] = [];
  
  loading = false;
  saving = false;
  submitted = false;
  error = '';
  
  get isEditMode(): boolean {
    return this.userId !== null;
  }
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = +id;
    }
    this.initForm();
    this.loadRoles();
    
    if (this.userId) {
      this.loadUser(this.userId);
    }
  }
  
  initForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', this.isEditMode ? [] : [Validators.required]],
      active: [true],
      roles: [[]]
    }, {
      validators: this.mustMatch('password', 'password_confirmation')
    });
  }
  
  loadRoles() {
    this.adminService.getRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.error = 'Error al cargar los roles. Por favor, intente nuevamente.';
      }
    });
  }
  
  loadUser(id: number) {
    this.loading = true;
    this.adminService.getUser(id).subscribe({
      next: (response) => {
        console.log('Respuesta completa:', response);
        
        if (response.success && response.data && response.data.user) {
          const userData = response.data.user;
          
          // Actualizar el formulario con los datos obtenidos
          this.userForm.patchValue({
            name: userData.name || '',
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            active: userData.active !== undefined ? userData.active : true
          });
          
          // Actualizar roles usando response.data.roles que es un array de strings
          if (response.data.roles && response.data.roles.length > 0) {
            this.originalRoles = [...response.data.roles]; // Guardar roles originales
            this.userForm.get('roles')?.setValue(response.data.roles);
          }
          
          this.loading = false;
        } else {
          console.error('Formato de respuesta inesperado', response);
          this.error = 'Error al cargar los datos del usuario.';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.error = 'Error al cargar los datos del usuario.';
        this.loading = false;
      }
    });
  }
  
  onRoleChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const roleName = checkbox.value;
    const roles = [...this.userForm.get('roles')?.value || []];
    
    if (checkbox.checked) {
      if (!roles.includes(roleName)) {
        roles.push(roleName);
      }
    } else {
      const index = roles.indexOf(roleName);
      if (index !== -1) {
        roles.splice(index, 1);
      }
    }
    
    this.userForm.get('roles')?.setValue(roles);
  }
  
  isRoleSelected(roleName: string): boolean {
    const roles = this.userForm.get('roles')?.value || [];
    return roles.includes(roleName);
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return (field?.invalid && (field?.dirty || field?.touched || this.submitted)) || false;
  }
  
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      
      if (!control.value) {
        return null;
      }
      
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }
      
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
      
      return null;
    };
  }
  
  onSubmit() {
    this.submitted = true;
    this.error = '';
    
    if (this.userForm.invalid) {
      return;
    }
    
    const formData = { ...this.userForm.value };
    const newRoles = formData.roles || [];
    
    // Si estamos en modo edición y no se especificó una contraseña, eliminarla del objeto
    if (this.isEditMode && !formData.password) {
      delete formData.password;
      delete formData.password_confirmation;
    }
    
    this.saving = true;
    
    if (this.isEditMode && this.userId) {
      // Verificar si los roles han cambiado
      const rolesChanged = this.haveRolesChanged(this.originalRoles, newRoles);
      
      // Actualizar usuario existente
      this.adminService.updateUser(this.userId, formData).subscribe({
        next: () => {
          // Si los roles han cambiado, hacer una llamada adicional al endpoint de roles
          if (rolesChanged) {
            this.updateUserRoles(this.userId, newRoles);
          } else {
            this.saving = false;
            alert('Usuario actualizado correctamente');
            this.router.navigate(['/admin/users']);
          }
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          this.error = error.error?.message || 'Error al actualizar el usuario. Por favor, intente nuevamente.';
          this.saving = false;
        }
      });
    } else {
      // Crear nuevo usuario
      this.adminService.createUser(formData).subscribe({
        next: (response) => {
          this.saving = false;
          alert('Usuario creado correctamente');
          this.router.navigate(['/admin/users']);
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          this.error = error.error?.message || 'Error al crear el usuario. Por favor, intente nuevamente.';
          this.saving = false;
        }
      });
    }
  }
  haveRolesChanged(originalRoles: string[], newRoles: string[]): boolean {
    if (originalRoles.length !== newRoles.length) {
      return true;
    }
    
    // Ordenar para comparación consistente
    const sortedOriginal = [...originalRoles].sort();
    const sortedNew = [...newRoles].sort();
    
    // Comparar cada elemento
    for (let i = 0; i < sortedOriginal.length; i++) {
      if (sortedOriginal[i] !== sortedNew[i]) {
        return true;
      }
    }
    
    return false;
  }
  
  // Método para actualizar roles de usuario
  updateUserRoles(userId: number | null, roles: string[]) {
    if (userId === null) {
      console.error('ID de usuario no válido');
      this.error = 'Error al actualizar roles: ID de usuario no válido';
      this.saving = false;
      return;
    }
    
    this.adminService.assignRolesToUser(userId, roles).subscribe({
      next: () => {
        this.saving = false;
        this.originalRoles = [...roles]; // Actualizar roles originales
        alert('Usuario y roles actualizados correctamente');
        this.router.navigate(['/admin/users']);
      },
      error: (error) => {
        console.error('Error al actualizar roles:', error);
        this.error = error.error?.message || 'Error al actualizar los roles. Por favor, intente nuevamente.';
        this.saving = false;
      }
    });
  }
}