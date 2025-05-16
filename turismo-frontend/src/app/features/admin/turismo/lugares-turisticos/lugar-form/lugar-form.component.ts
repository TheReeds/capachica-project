import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurismoService, LugarTuristico } from '../../../../../core/services/turismo.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-lugar-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ],
  template: `
    <div class="space-y-6">
      <!-- Alertas de éxito (creación y edición) -->
      @if (successMessage) {
        <div @fadeInOut class="rounded-lg bg-green-50 p-4 border-l-4 border-green-500 shadow-lg relative" role="alert">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
            </div>
            <div class="ml-auto pl-3">
              <div class="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  (click)="successMessage = ''"
                  class="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <span class="sr-only">Cerrar</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <!-- Barra de progreso animada -->
          <div class="absolute bottom-0 left-0 h-1 bg-green-300 animate-pulse" style="width: 100%; animation: progress-bar 5s linear forwards;">
          </div>
        </div>
      }

      <!-- Alerta de edición exitosa -->
      @if (editSuccessMessage) {
        <div @fadeInOut class="rounded-lg bg-blue-50 p-4 border-l-4 border-blue-500 shadow-lg relative" role="alert">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-blue-800">{{ editSuccessMessage }}</p>
            </div>
            <div class="ml-auto pl-3">
              <div class="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  (click)="editSuccessMessage = ''"
                  class="inline-flex rounded-md p-1.5 text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span class="sr-only">Cerrar</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <!-- Barra de progreso animada -->
          <div class="absolute bottom-0 left-0 h-1 bg-blue-300 animate-pulse" style="width: 100%; animation: progress-bar 5s linear forwards;">
          </div>
        </div>
      }

      <div class="sm:flex sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900">{{ isEditMode ? 'Editar Lugar Turístico' : 'Crear Lugar Turístico' }}</h1>
        <div class="mt-4 sm:mt-0">
          <a
            routerLink="/admin/lugares-turisticos"
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
          <form [formGroup]="lugarForm" (ngSubmit)="onSubmit()">
            <div class="p-6 space-y-6">
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <!-- Nombre -->
                <div class="sm:col-span-6">
                  <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
                  <div class="mt-1">
                    <input
                      type="text"
                      id="nombre"
                      formControlName="nombre"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      [ngClass]="{'border-red-300': isFieldInvalid('nombre')}"
                    />
                    @if (isFieldInvalid('nombre')) {
                      <p class="mt-2 text-sm text-red-600">El nombre es requerido</p>
                    }
                  </div>
                </div>

                <!-- Descripción -->
                <div class="sm:col-span-6">
                  <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
                  <div class="mt-1">
                    <textarea
                      id="descripcion"
                      formControlName="descripcion"
                      rows="4"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      [ngClass]="{'border-red-300': isFieldInvalid('descripcion')}"
                    ></textarea>
                    @if (isFieldInvalid('descripcion')) {
                      <p class="mt-2 text-sm text-red-600">La descripción es requerida</p>
                    }
                  </div>
                </div>

                <!-- Ubicación -->
                <div class="sm:col-span-6">
                  <label for="ubicacion" class="block text-sm font-medium text-gray-700">Ubicación</label>
                  <div class="mt-1">
                    <input
                      type="text"
                      id="ubicacion"
                      formControlName="ubicacion"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      [ngClass]="{'border-red-300': isFieldInvalid('ubicacion')}"
                    />
                    @if (isFieldInvalid('ubicacion')) {
                      <p class="mt-2 text-sm text-red-600">La ubicación es requerida</p>
                    }
                  </div>
                </div>

                <!-- Imagen -->
                <div class="sm:col-span-6">
                  <label for="imagen" class="block text-sm font-medium text-gray-700">Imagen</label>
                  <div class="mt-1 flex items-center">
                    @if (previewImage) {
                      <div class="relative">
                        <img
                          [src]="previewImage"
                          alt="Vista previa de imagen"
                          class="h-32 w-32 object-cover rounded-md mr-4"
                        />
                      </div>
                    }
                    <div class="flex flex-col">
                      <input
                        type="file"
                        id="imagen"
                        (change)="onFileSelected($event)"
                        accept="image/*"
                        class="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-50 file:text-primary-700
                        hover:file:bg-primary-100"
                      />
                      <p class="mt-1 text-sm text-gray-500">
                        {{ isEditMode ? 'Deja vacío para mantener la imagen actual' : 'Sube una imagen representativa del lugar turístico' }}
                      </p>
                    </div>
                  </div>
                  @if (isFieldInvalid('imagen') && !isEditMode) {
                    <p class="mt-2 text-sm text-red-600">La imagen es requerida</p>
                  }
                </div>
              </div>
            </div>

            @if (error) {
              <div class="rounded-md bg-red-50 p-4 m-6">
                <div class="flex">
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
                  </div>
                </div>
              </div>
            }

            <div class="flex justify-end space-x-3 p-6 bg-gray-50">
              <button
                type="button"
                routerLink="/admin/lugares-turisticos"
                class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Cancelar
              </button>

              <button
                type="submit"
                class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                [disabled]="saving || lugarForm.invalid"
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
  styles: [`
    @keyframes progress-bar {
      0% { width: 100%; }
      100% { width: 0%; }
    }
  `]
})
export class LugarFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private turismoService = inject(TurismoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  lugarForm!: FormGroup;
  lugarId: number | null = null;
  previewImage: string | null = null;
  selectedFile: File | null = null;
  imageName: string = '';

  loading = true;
  saving = false;
  submitted = false;
  error = '';
  successMessage = '';
  editSuccessMessage = '';
  alertTimeout: any = null;
  editAlertTimeout: any = null;

  get isEditMode(): boolean {
    return this.lugarId !== null;
  }

  ngOnInit() {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.lugarId = +id;
      this.loadLugar(this.lugarId);
    } else {
      this.loading = false;
    }

    // Verificar si hay mensaje de éxito en los query params
    const success = this.route.snapshot.queryParamMap.get('success');
    if (success) {
      // Determinar qué tipo de alerta mostrar según el contexto
      if (success.includes('edit') || success.includes('actualiz')) {
        this.showEditSuccessMessage(success);
      } else {
        this.showSuccessMessage(success);
      }
    }
  }

  initForm() {
    this.lugarForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      ubicacion: ['', Validators.required],
      imagen: ['']
    });
  }

  loadLugar(id: number) {
    this.loading = true;
    this.error = '';

    this.turismoService.getLugarTuristico(id).subscribe({
      next: (lugar: LugarTuristico) => {
        // Verificación exhaustiva de los datos
        if (!lugar || typeof lugar !== 'object') {
          throw new Error('La respuesta del servidor no tiene el formato esperado');
        }

        // Verificar campos mínimos requeridos
        if (!lugar.nombre || !lugar.descripcion || !lugar.ubicacion) {
          throw new Error('Los datos del lugar están incompletos');
        }

        // Actualizar el formulario
        this.lugarForm.patchValue({
          nombre: lugar.nombre,
          descripcion: lugar.descripcion,
          ubicacion: lugar.ubicacion,
          imagen: lugar.imagen || null
        });

        // Manejo de la imagen
        this.handleImagePreview(lugar.imagen);

        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar lugar:', error);
        this.error = error.message || 'Error al cargar los datos del lugar turístico';
        this.loading = false;

        // Redirigir después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/admin/lugares-turisticos']);
        }, 3000);
      }
    });
  }

  private handleImagePreview(imagePath: string | null) {
    if (!imagePath) {
      this.previewImage = null;
      this.imageName = '';
      return;
    }

    // Si ya es una URL completa
    if (imagePath.includes('http') || imagePath.startsWith('data:')) {
      this.previewImage = imagePath;
      this.imageName = imagePath.split('/').pop() || '';
      return;
    }

    // Construir URL completa para imágenes almacenadas
    this.previewImage = `${this.turismoService.getBaseUrl()}/storage/${imagePath}`;
    this.imageName = imagePath;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.imageName = this.selectedFile.name; // Almacenamos el nombre del archivo

      // Crear vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.lugarForm.get(fieldName);
    return (field?.invalid && (field?.dirty || field?.touched || this.submitted)) || false;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    // Validación adicional para imagen en modo creación
    if (!this.isEditMode && !this.selectedFile) {
      this.lugarForm.get('imagen')?.setErrors({ required: true });
    }

    if (this.lugarForm.invalid) {
      this.error = 'Por favor, complete todos los campos requeridos correctamente';
      return;
    }

    this.saving = true;

    // Preparar datos para enviar como Partial<LugarTuristico>
    const lugarData: Partial<LugarTuristico> = {
      nombre: this.lugarForm.get('nombre')?.value,
      descripcion: this.lugarForm.get('descripcion')?.value,
      ubicacion: this.lugarForm.get('ubicacion')?.value,
      imagen: this.imageName
    };

    if (this.isEditMode && this.lugarId) {
      // En modo edición, incluir el ID
      const updateData: LugarTuristico = {
        ...lugarData,
        id: this.lugarId,
        created_at: '', // Estos campos probablemente los maneja el backend
        updated_at: ''  // Puedes dejarlos como cadena vacía o null
      } as LugarTuristico;

      this.turismoService.updateLugarTuristico(this.lugarId, updateData).subscribe({
        next: () => {
          this.saving = false;
          // Mostrar alerta específica para edición
          this.showEditSuccessMessage('Lugar turístico actualizado correctamente');
          // Redirigir después de que se muestre la alerta
          setTimeout(() => {
            this.router.navigate(['/admin/lugares-turisticos']);
          }, 3000);
        },
        error: (error) => {
          this.handleError(error);
          this.saving = false;
        }
      });
    } else {
      // En modo creación, el backend normalmente asigna ID y timestamps
      this.turismoService.createLugarTuristico(lugarData as Omit<LugarTuristico, 'id' | 'created_at' | 'updated_at'>).subscribe({
        next: () => {
          this.saving = false;
          // Mostrar alerta en lugar de redirigir inmediatamente
          this.showSuccessMessage('¡Lugar turístico creado correctamente!');
          // Redirigir después de que se muestre la alerta
          setTimeout(() => {
            this.router.navigate(['/admin/lugares-turisticos']);
          }, 3000);
        },
        error: (error) => {
          this.handleError(error);
          this.saving = false;
        }
      });
    }
  }

  showSuccessMessage(message: string) {
    this.successMessage = message;
    // Limpiar la otra alerta para evitar mostrar ambas a la vez
    this.editSuccessMessage = '';

    // Auto-cerrar la alerta después de 5 segundos
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }

    this.alertTimeout = setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }

  showEditSuccessMessage(message: string) {
    this.editSuccessMessage = message;
    // Limpiar la otra alerta para evitar mostrar ambas a la vez
    this.successMessage = '';

    // Auto-cerrar la alerta después de 5 segundos
    if (this.editAlertTimeout) {
      clearTimeout(this.editAlertTimeout);
    }

    this.editAlertTimeout = setTimeout(() => {
      this.editSuccessMessage = '';
    }, 5000);
  }

  private handleError(error: any) {
    console.error('Error:', error);
    if (error.status === 422) {
      const serverErrors = error.error?.errors;
      if (serverErrors) {
        this.error = Object.entries(serverErrors)
          .map(([field, messages]) => {
            const fieldName = this.getFieldDisplayName(field);
            return `${fieldName}: ${(messages as string[]).join(', ')}`;
          })
          .join(' | ');
      } else {
        this.error = error.error?.message || 'Error de validación en los datos enviados';
      }
    } else {
      this.error = error.error?.message || 'Ocurrió un error inesperado. Por favor, intente nuevamente.';
    }
  }

  private getFieldDisplayName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      nombre: 'Nombre',
      descripcion: 'Descripción',
      ubicacion: 'Ubicación',
      imagen: 'Imagen'
    };
    return fieldNames[field] || field;
  }
}
