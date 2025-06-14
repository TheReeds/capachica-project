import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { ThemeService } from '../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private themeService = inject(ThemeService);
  private darkModeSubscription = new Subscription();

  // Form y datos del usuario
  profileForm!: FormGroup;
  user: User | null = null;

  // Manejo de imagen
  profileImageUrl: string | null = null;
  selectedFile: File | null = null;
  fileError = '';

  // Estados del componente
  loading = true;
  updating = false;
  submitted = false;
  updateError = '';
  updateSuccess = false;
  activeTab = 'personal';
  private _isDarkMode = false;

  // Opciones para selects
  readonly languageOptions = [
    { value: '', label: 'Seleccionar idioma' },
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'Inglés' },
    { value: 'pt', label: 'Portugués' },
    { value: 'fr', label: 'Francés' },
    { value: 'de', label: 'Alemán' }
  ];

  readonly genderOptions = [
    { value: '', label: 'Seleccionar género' },
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Femenino' },
    { value: 'other', label: 'Otro' },
    { value: 'prefer_not_to_say', label: 'Prefiero no decir' }
  ];

  ngOnInit() {
    this.initForm();
    this.loadUserProfile();
    this.initDarkModeSubscription();
  }

  ngOnDestroy() {
    this.darkModeSubscription.unsubscribe();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      country: [''],
      birth_date: [''],
      address: [''],
      gender: [''],
      preferred_language: ['']
    });
  }

  private initDarkModeSubscription(): void {
    this.darkModeSubscription = this.themeService.darkMode$.subscribe(isDark => {
      this._isDarkMode = isDark;
      this.cdr.detectChanges();
    });
  }

  private loadUserProfile() {
    this.loading = true;
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileImageUrl = null;
        this.profileForm.patchValue({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          country: user.country || '',
          birth_date: user.birth_date || '',
          address: user.address || '',
          gender: user.gender || '',
          preferred_language: user.preferred_language || ''
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading = false;
        this.updateError = 'Error al cargar el perfil. Inténtelo de nuevo más tarde.';
      }
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  get userInitials(): string {
    if (!this.user?.name) return '';
    const name = this.user.name.trim();
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  isDarkMode(): boolean {
    return this._isDarkMode;
  }

  getImageUrl(): string | null {
  // Si hay una imagen de preview (durante la selección), mostrarla
    if (this.profileImageUrl && this.selectedFile) {
      return this.profileImageUrl;
    }

    // Si el usuario tiene foto de perfil guardada, mostrarla
    if (this.user?.foto_perfil) {
      // Si ya es una URL completa (http/https)
      if (this.user.foto_perfil.startsWith('http')) {
        return this.user.foto_perfil;
      }
      // Si es una ruta relativa, construir la URL completa
      return `http://localhost:8000/storage/${this.user.foto_perfil}`;
    }


    return null;
  }

  hasRoles(): boolean {
    return !!this.user?.roles?.length;
  }

  getPermissions(role: any): string[] {
    if (!role?.permissions) return [];
    return Array.isArray(role.permissions)
      ? role.permissions.map((p: any) => typeof p === 'string' ? p : p.name)
      : [];
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.resetFileState();

    if (input.files?.length) {
      const file = input.files[0];

      if (!this.validateFile(file)) {
        input.value = '';
        return;
      }

      this.selectedFile = file;
      this.createImagePreview(file);
    }
  }

  private resetFileState(): void {
    this.fileError = '';
    this.selectedFile = null;
    this.profileImageUrl = null;
  }

  private validateFile(file: File): boolean {
    if (!file.type.startsWith('image/')) {
      this.fileError = 'El archivo debe ser una imagen.';
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.fileError = 'La imagen no debe superar los 5MB.';
      return false;
    }

    return true;
  }

  private createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImageUrl = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  onSubmit() {
    this.submitted = true;
    this.updateError = '';
    this.updateSuccess = false;

    if (this.profileForm.invalid) {
      return;
    }

    this.updating = true;
    const formData = this.createFormData();

    this.authService.updateProfile(formData).subscribe({
      next: (user) => {
        console.log('Server response:', user); // Debug
        console.log('Photo path:', user.foto_perfil); // Debug
        this.handleUpdateSuccess(user);
      },
      error: (error) => {
        console.error('Update error:', error); // Debug
        this.handleUpdateError(error);
      }
    });
  }

  private createFormData(): FormData {
    const formData = new FormData();

    Object.entries(this.profileForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (this.selectedFile) {
      formData.append('foto_perfil', this.selectedFile);
    }

    return formData;
  }

  private handleUpdateSuccess(user: User): void {
    this.user = user;
    this.updateSuccess = true;
    this.updating = false;
    this.submitted = false;

    // Limpiar el archivo seleccionado y preview SOLO después de un breve delay
    setTimeout(() => {
      this.selectedFile = null;
      this.profileImageUrl = null;
      this.cdr.detectChanges();
    }, 500);

    this.cdr.detectChanges();
  }

  private handleUpdateError(error: any): void {
    this.updating = false;
    this.updateError = error.error?.message || 'Ha ocurrido un error al actualizar el perfil.';

    if (error.error?.errors) {
      this.processValidationErrors(error.error.errors);
    }
  }

  private processValidationErrors(errors: any): void {
    Object.entries(errors).forEach(([key, msgs]) => {
      const msg = Array.isArray(msgs) ? msgs[0] : msgs as string;

      if (key === 'foto_perfil') {
        this.fileError = msg;
      } else {
        const control = this.profileForm.get(key);
        if (control) {
          control.setErrors({ serverError: msg });
        }
      }
    });
  }

  resetForm(): void {
    this.submitted = false;
    this.updateError = '';
    this.updateSuccess = false;
    this.resetFileState();
    this.loadUserProfile();
  }

  formatDate(date: string | null): string {
    return date ? new Date(date).toLocaleString() : 'Nunca';
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  onImageError(event: Event): void {
    console.error('Error loading profile image:', event);
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }
}
