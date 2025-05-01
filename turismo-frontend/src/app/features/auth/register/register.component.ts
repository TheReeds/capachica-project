import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { GoogleLoginButtonComponent } from '../../../shared/components/buttons/google-login-button.component';
import { GoogleAuthService } from '../../../core/services/google-auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink, 
    GoogleLoginButtonComponent
  ],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8">
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
            
            <!-- Foto de perfil -->
            <div>
              <label for="foto_perfil" class="form-label">Foto de perfil</label>
              <input 
                id="foto_perfil" 
                type="file" 
                (change)="onFileChange($event)"
                class="form-input" 
                accept="image/*"
              />
              @if (submitted && fileError) {
                <p class="form-error">{{ fileError }}</p>
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
          
          <!-- Botón de registro -->
          <div>
            <button 
              type="submit" 
              class="btn-primary w-full flex justify-center items-center gap-2"
              [disabled]="loading"
            >
              @if (loading) {
                <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                <span>Registrando...</span>
              } @else {
                <span>Registrarse</span>
              }
            </button>
          </div>
          
          <!-- Separador -->
          <div class="relative my-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">O continuar con</span>
            </div>
          </div>
          
          <!-- Botón de Google (usando el componente) -->
          <app-google-login-button></app-google-login-button>
        </form>
        
        <!-- Mensaje de éxito -->
        @if (registrationSuccess) {
          <div class="rounded-md bg-green-50 p-4 mt-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">Registro exitoso</h3>
                <div class="mt-2 text-sm text-green-700">
                  <p>
                    Tu cuenta ha sido creada correctamente. Se ha enviado un correo de verificación 
                    a tu dirección de correo electrónico. Por favor, verifica tu cuenta antes de iniciar sesión.
                  </p>
                </div>
                <div class="mt-4">
                  <button 
                    type="button"
                    class="btn-primary"
                    (click)="navigateToLogin()">
                    Ir a inicio de sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private googleAuthService = inject(GoogleAuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  registerForm: FormGroup;
  loading = false;
  googleLoading = false;
  submitted = false;
  error = '';
  fileError = '';
  registrationSuccess = false;
  
  selectedFile: File | null = null;
  
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

  ngOnInit() {
    // Inicializar el servicio de Google Auth
    this.googleAuthService.initGoogleOneTap(false);
    
    // Verificar si hay un token de Google en los parámetros de URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        // Si hay un token, significa que venimos de un callback de Google
        // Guardamos el token y redirigimos al dashboard
        localStorage.setItem('auth_token', token);
        this.authService.loadUserProfile(true).subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.error = 'Error al cargar el perfil de usuario';
          }
        });
      }
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
  
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length) {
      const file = input.files[0];
      
      // Validar que sea una imagen y que tenga un tamaño adecuado
      if (!file.type.startsWith('image/')) {
        this.fileError = 'El archivo debe ser una imagen';
        this.selectedFile = null;
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        this.fileError = 'La imagen no debe superar los 5MB';
        this.selectedFile = null;
        return;
      }
      
      this.selectedFile = file;
      this.fileError = '';
    }
  }
  
  onSubmit() {
    this.submitted = true;
    this.error = '';
    
    if (this.registerForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    // Crear objeto para el registro
    const registerData = { 
      ...this.registerForm.value,
      foto_perfil: this.selectedFile
    };
    
    this.authService.register(registerData).subscribe({
      next: () => {
        this.registrationSuccess = true;
        this.loading = false;
      },
      error: err => {
        this.error = err.error?.message || 'Ha ocurrido un error durante el registro';
        if (err.error?.errors) {
          const errors = err.error.errors;
          // Mostrar el primer error de cada campo
          Object.keys(errors).forEach(key => {
            if (key === 'foto_perfil') {
              this.fileError = errors[key][0];
            }
          });
        }
        this.loading = false;
      }
    });
  }
  
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}