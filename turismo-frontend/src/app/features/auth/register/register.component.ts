import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Crea tu cuenta
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?
            <a routerLink="/login" class="font-medium text-primary-600 hover:text-primary-500">
              Iniciar sesión
            </a>
          </p>
        </div>
        
        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4 rounded-md shadow-sm">
            <!-- Nombre completo -->
            <div>
              <label for="name" class="form-label">Nombre completo</label>
              <input 
                id="name" 
                type="text" 
                formControlName="name" 
                class="form-input" 
                autocomplete="name" 
                [ngClass]="{'border-red-500': submitted && f['name'].errors}"
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
                autocomplete="given-name" 
                [ngClass]="{'border-red-500': submitted && f['first_name'].errors}"
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
                autocomplete="family-name" 
                [ngClass]="{'border-red-500': submitted && f['last_name'].errors}"
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
                autocomplete="email" 
                [ngClass]="{'border-red-500': submitted && f['email'].errors}"
              />
              @if (submitted && f['email'].errors) {
                <p class="form-error">
                  @if (f['email'].errors['required']) {
                    El correo electrónico es requerido
                  } @else if (f['email'].errors['email']) {
                    Ingrese un correo electrónico válido
                  }
                </p>
              }
            </div>
            
            <!-- Teléfono -->
            <div>
              <label for="phone" class="form-label">Teléfono</label>
              <input 
                id="phone" 
                type="tel" 
                formControlName="phone" 
                class="form-input" 
                autocomplete="tel" 
                [ngClass]="{'border-red-500': submitted && f['phone'].errors}"
              />
              @if (submitted && f['phone'].errors) {
                <p class="form-error">El teléfono es requerido</p>
              }
            </div>
            
            <!-- Contraseña -->
            <div>
              <label for="password" class="form-label">Contraseña</label>
              <input 
                id="password" 
                type="password" 
                formControlName="password" 
                class="form-input" 
                autocomplete="new-password" 
                [ngClass]="{'border-red-500': submitted && f['password'].errors}"
              />
              @if (submitted && f['password'].errors) {
                <p class="form-error">
                  @if (f['password'].errors['required']) {
                    La contraseña es requerida
                  } @else if (f['password'].errors['minlength']) {
                    La contraseña debe tener al menos 8 caracteres
                  }
                </p>
              }
            </div>
            
            <!-- Confirmar Contraseña -->
            <div>
              <label for="password_confirmation" class="form-label">Confirmar contraseña</label>
              <input 
                id="password_confirmation" 
                type="password" 
                formControlName="password_confirmation" 
                class="form-input" 
                autocomplete="new-password" 
                [ngClass]="{'border-red-500': submitted && f['password_confirmation'].errors}"
              />
              @if (submitted && f['password_confirmation'].errors) {
                <p class="form-error">
                  @if (f['password_confirmation'].errors['required']) {
                    La confirmación de contraseña es requerida
                  } @else if (f['password_confirmation'].errors['mustMatch']) {
                    Las contraseñas no coinciden
                  }
                </p>
              }
            </div>
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
          
          <div>
            <button 
              type="submit" 
              class="btn-primary w-full"
              [disabled]="loading"
            >
              @if (loading) {
                <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Registrando...
              } @else {
                Registrarse
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  
  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    }, {
      validators: this.mustMatch('password', 'password_confirmation')
    });
  }
  
  get f() { return this.registerForm.controls; }
  
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }
      
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  
  onSubmit() {
    this.submitted = true;
    this.error = '';
    
    if (this.registerForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.error = err.error?.message || 'Ha ocurrido un error durante el registro';
        this.loading = false;
      }
    });
  }
}