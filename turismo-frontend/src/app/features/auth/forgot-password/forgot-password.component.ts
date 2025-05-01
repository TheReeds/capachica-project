import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8">
        
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Recuperar contraseña
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
          </p>
        </div>
        
        <form *ngIf="!emailSent" class="mt-8 space-y-6" [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4 rounded-md shadow-sm">
            <!-- Email -->
            <div>
              <label for="email" class="form-label">Correo electrónico</label>
              <input 
                id="email" 
                type="email" 
                formControlName="email" 
                class="form-input transition-all duration-300"
                autocomplete="email"
                [ngClass]="{'border-red-500': submitted && f['email'].errors}" />
              <div *ngIf="submitted && f['email'].errors">
                <p class="form-error" *ngIf="f['email'].errors['required']">El correo electrónico es requerido</p>
                <p class="form-error" *ngIf="f['email'].errors['email']">Ingrese un correo electrónico válido</p>
              </div>
            </div>
          </div>

          <div *ngIf="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
              </div>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              class="btn-primary w-full flex justify-center items-center gap-2"
              [disabled]="loading">
              <span *ngIf="loading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              <span *ngIf="!loading">Enviar enlace de recuperación</span>
            </button>
          </div>
          
          <div class="text-center">
            <a routerLink="/login" class="font-medium text-primary-600 hover:text-primary-500 transition-colors">
              Volver al inicio de sesión
            </a>
          </div>
        </form>
        
        <!-- Mensaje de éxito -->
        <div *ngIf="emailSent" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                Correo enviado
              </h3>
              <div class="mt-2 text-sm text-green-700">
                <p>
                  Hemos enviado un enlace de recuperación a <strong>{{ forgotForm.get('email')?.value }}</strong>. 
                  Por favor, revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                </p>
              </div>
              <div class="mt-4">
                <button 
                  type="button"
                  class="btn-secondary"
                  routerLink="/login">
                  Volver al inicio de sesión
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
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  forgotForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  emailSent = false;

  constructor() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { 
    return this.forgotForm.controls; 
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.forgotForm.invalid) {
      return;
    }

    this.loading = true;
    
    this.authService.forgotPassword(this.forgotForm.value.email).subscribe({
      next: () => {
        this.emailSent = true;
        this.loading = false;
      },
      error: err => {
        this.error = err.error?.message || 'Error al enviar el correo de recuperación.';
        this.loading = false;
      }
    });
  }
}