import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ResetPasswordRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8">
        
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Restablecer contraseña
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ingresa tu nueva contraseña
          </p>
        </div>
        
        <!-- Formulario -->
        <form class="mt-8 space-y-6" [formGroup]="resetForm" (ngSubmit)="onSubmit()" *ngIf="!resetSuccess">
          <div class="space-y-4 rounded-md shadow-sm">
            <!-- Email (oculto pero presente por requerimiento de la API) -->
            <input 
              type="hidden" 
              formControlName="email"
            />
            
            <!-- Token (oculto pero presente por requerimiento de la API) -->
            <input 
              type="hidden" 
              formControlName="token"
            />
            
            <!-- Nueva Contraseña -->
            <div>
              <label for="password" class="form-label">Nueva contraseña</label>
              <input 
                id="password" 
                type="password" 
                formControlName="password" 
                class="form-input transition-all duration-300"
                [ngClass]="{'border-red-500': submitted && f['password'].errors}" />
              <div *ngIf="submitted && f['password'].errors">
                <p class="form-error" *ngIf="f['password'].errors['required']">La contraseña es requerida</p>
                <p class="form-error" *ngIf="f['password'].errors['minlength']">La contraseña debe tener al menos 8 caracteres</p>
              </div>
            </div>
            
            <!-- Confirmar Contraseña -->
            <div>
              <label for="password_confirmation" class="form-label">Confirmar contraseña</label>
              <input 
                id="password_confirmation" 
                type="password" 
                formControlName="password_confirmation" 
                class="form-input transition-all duration-300"
                [ngClass]="{'border-red-500': submitted && f['password_confirmation'].errors}" />
              <div *ngIf="submitted && f['password_confirmation'].errors">
                <p class="form-error" *ngIf="f['password_confirmation'].errors['required']">La confirmación de contraseña es requerida</p>
                <p class="form-error" *ngIf="f['password_confirmation'].errors['mustMatch']">Las contraseñas no coinciden</p>
              </div>
            </div>
          </div>
          
          <!-- Mensajes de error -->
          <div *ngIf="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
              </div>
            </div>
          </div>
          
          <!-- Botón de envío -->
          <div>
            <button 
              type="submit" 
              class="btn-primary w-full flex justify-center items-center gap-2"
              [disabled]="loading">
              <span *ngIf="loading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              <span *ngIf="!loading">Restablecer contraseña</span>
            </button>
          </div>
        </form>
        
        <!-- Mensaje de éxito -->
        <div *ngIf="resetSuccess" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                ¡Contraseña restablecida!
              </h3>
              <div class="mt-2 text-sm text-green-700">
                <p>
                  Tu contraseña ha sido restablecida exitosamente.
                </p>
              </div>
              <div class="mt-4">
                <button 
                  type="button"
                  class="btn-primary"
                  (click)="navigateToLogin()">
                  Iniciar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  `,
  styles: []
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  resetForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  resetSuccess = false;

  constructor() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    }, {
      validators: this.mustMatch('password', 'password_confirmation')
    });
  }

  ngOnInit(): void {
    // Obtener token y email de los parámetros
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const email = params['email'];
      
      if (token && email) {
        this.resetForm.patchValue({
          token: token,
          email: email
        });
      } else {
        this.error = 'Enlace de restablecimiento inválido. Faltan parámetros necesarios.';
      }
    });
  }

  get f() { 
    return this.resetForm.controls; 
  }

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

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    
    if (this.resetForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const resetData: ResetPasswordRequest = this.resetForm.value;
    
    this.authService.resetPassword(resetData).subscribe({
      next: () => {
        this.resetSuccess = true;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Error al restablecer la contraseña.';
        this.loading = false;
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}