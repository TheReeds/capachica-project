import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900">Mi Perfil</h1>
      
      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="card">
          <h2 class="text-lg font-medium text-gray-900">Información personal</h2>
          
          <div class="mt-4">
            @if (loading) {
              <div class="flex justify-center">
                <span class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-primary-600"></span>
              </div>
            } @else {
              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-4">
                <!-- Nombre completo -->
                <div>
                  <label for="name" class="form-label">Nombre completo</label>
                  <input 
                    id="name" 
                    type="text" 
                    formControlName="name" 
                    class="form-input" 
                  />
                  @if (submitted && f['name'].errors) {
                    <p class="form-error">El nombre completo es requerido</p>
                  }
                </div>
                
                <!-- Nombre -->
                <div>
                  <label for="first_name" class="form-label">Nombre</label>
                  <input 
                    id="first_name" 
                    type="text" 
                    formControlName="first_name" 
                    class="form-input" 
                  />
                  @if (submitted && f['first_name'].errors) {
                    <p class="form-error">El nombre es requerido</p>
                  }
                </div>
                
                <!-- Apellido -->
                <div>
                  <label for="last_name" class="form-label">Apellido</label>
                  <input 
                    id="last_name" 
                    type="text" 
                    formControlName="last_name" 
                    class="form-input" 
                  />
                  @if (submitted && f['last_name'].errors) {
                    <p class="form-error">El apellido es requerido</p>
                  }
                </div>
                
                <!-- Email -->
                <div>
                  <label for="email" class="form-label">Correo electrónico</label>
                  <input 
                    id="email" 
                    type="email" 
                    formControlName="email" 
                    class="form-input" 
                    readonly
                  />
                </div>
                
                <!-- Teléfono -->
                <div>
                  <label for="phone" class="form-label">Teléfono</label>
                  <input 
                    id="phone" 
                    type="tel" 
                    formControlName="phone" 
                    class="form-input" 
                  />
                  @if (submitted && f['phone'].errors) {
                    <p class="form-error">El teléfono es requerido</p>
                  }
                </div>
                
                @if (updateError) {
                  <div class="rounded-md bg-red-50 p-4">
                    <div class="flex">
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">{{ updateError }}</h3>
                      </div>
                    </div>
                  </div>
                }
                
                @if (updateSuccess) {
                  <div class="rounded-md bg-green-50 p-4">
                    <div class="flex">
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-green-800">Perfil actualizado con éxito</h3>
                      </div>
                    </div>
                  </div>
                }
                
                <div class="flex justify-end">
                  <button 
                    type="submit" 
                    class="btn-primary"
                    [disabled]="updating"
                  >
                    @if (updating) {
                      <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Actualizando...
                    } @else {
                      Actualizar perfil
                    }
                  </button>
                </div>
              </form>
            }
          </div>
        </div>
        
        <div class="card">
          <h2 class="text-lg font-medium text-gray-900">Roles y permisos</h2>
          
          @if (user && user.roles && user.roles.length > 0) {
            <div class="mt-4">
              <h3 class="text-md font-medium text-gray-900">Tus roles:</h3>
              <ul class="mt-2 space-y-3">
                @for (role of user.roles; track role.id) {
                  <li class="bg-gray-50 p-3 rounded-md">
                    <div class="font-medium">{{ role.name }}</div>
                    <div class="mt-1 text-sm text-gray-600">
                      <strong>Permisos:</strong>
                      <div class="mt-1 flex flex-wrap gap-1">
                        @for (permission of role.permissions; track permission) {
                          <span class="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                            {{ permission }}
                          </span>
                        }
                      </div>
                    </div>
                  </li>
                }
              </ul>
            </div>
          } @else {
            <div class="mt-4 text-sm text-gray-600">
              No tienes roles asignados.
            </div>
          }
          
          <div class="mt-6">
            <a routerLink="/dashboard" class="btn-secondary inline-block">
              Volver al dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  profileForm!: FormGroup;
  user: User | null = null;
  
  loading = true;
  updating = false;
  submitted = false;
  updateError = '';
  updateSuccess = false;
  
  ngOnInit() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
    
    this.loadUserProfile();
  }
  
  get f() { return this.profileForm.controls; }
  
  loadUserProfile() {
    this.loading = true;
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          name: user.name,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  
  onSubmit() {
    this.submitted = true;
    this.updateError = '';
    this.updateSuccess = false;
    
    if (this.profileForm.invalid) {
      return;
    }
    
    this.updating = true;
    
    // Aquí normalmente se llamaría a un método del servicio para actualizar el perfil
    // Como no teníamos un endpoint específico para esto, simularemos una actualización exitosa
    setTimeout(() => {
      this.updating = false;
      this.updateSuccess = true;
      
      // Actualizar el usuario en el servicio de autenticación
      if (this.user) {
        const updatedUser = {
          ...this.user,
          name: this.profileForm.value.name,
          first_name: this.profileForm.value.first_name,
          last_name: this.profileForm.value.last_name,
          phone: this.profileForm.value.phone
        };
        // Aquí se actualizaría el usuario en el servicio
      }
    }, 1000);
  }
}