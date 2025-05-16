import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResenasService } from '../../../../core/services/resenas.service';

@Component({
  selector: 'app-formulario-resena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-all duration-300"
         [class.hidden]="!mostrarFormulario">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Añadir Reseña</h3>

      <form [formGroup]="resenaForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Nombre del autor -->
        <div>
          <label for="nombre_autor" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tu nombre
          </label>
          <input type="text" id="nombre_autor" formControlName="nombre_autor"
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                 [class.border-red-500]="resenaForm.get('nombre_autor')?.invalid && resenaForm.get('nombre_autor')?.touched">
          <div *ngIf="resenaForm.get('nombre_autor')?.invalid && resenaForm.get('nombre_autor')?.touched"
               class="text-red-500 text-sm mt-1">
            <span *ngIf="resenaForm.get('nombre_autor')?.errors?.['required']">El nombre es requerido</span>
            <span *ngIf="resenaForm.get('nombre_autor')?.errors?.['maxlength']">El nombre no puede exceder los 100 caracteres</span>
          </div>
        </div>

        <!-- Comentario -->
        <div>
          <label for="comentario" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tu comentario
          </label>
          <textarea id="comentario" formControlName="comentario" rows="4"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    [class.border-red-500]="resenaForm.get('comentario')?.invalid && resenaForm.get('comentario')?.touched"></textarea>
          <div *ngIf="resenaForm.get('comentario')?.invalid && resenaForm.get('comentario')?.touched"
               class="text-red-500 text-sm mt-1">
            <span *ngIf="resenaForm.get('comentario')?.errors?.['required']">El comentario es requerido</span>
            <span *ngIf="resenaForm.get('comentario')?.errors?.['minlength']">El comentario debe tener al menos 10 caracteres</span>
          </div>
        </div>

        <!-- Puntuación -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Puntuación
          </label>
          <div class="flex space-x-1">
            <button type="button" *ngFor="let star of [1,2,3,4,5]"
                    (click)="setPuntuacion(star)"
                    class="text-2xl focus:outline-none"
                    [class.text-yellow-400]="star <= resenaForm.get('puntuacion')?.value"
                    [class.text-gray-300]="star > resenaForm.get('puntuacion')?.value">
              ★
            </button>
          </div>
          <div *ngIf="resenaForm.get('puntuacion')?.invalid && resenaForm.get('puntuacion')?.touched"
               class="text-red-500 text-sm mt-1">
            <span *ngIf="resenaForm.get('puntuacion')?.errors?.['required']">La puntuación es requerida</span>
          </div>
        </div>

        <!-- Imágenes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Imágenes (opcional)
          </label>
          <input type="file" multiple accept="image/jpeg,image/png"
                 (change)="onFileSelected($event)"
                 class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-gray-700 dark:file:text-orange-300">

          <!-- Previsualización de imágenes -->
          <div *ngIf="imagenesPrevisualizacion.length > 0" class="mt-4 grid grid-cols-3 gap-4">
            <div *ngFor="let imagen of imagenesPrevisualizacion" class="relative">
              <img [src]="imagen.url" alt="Previsualización" class="w-full h-24 object-cover rounded-lg">
              <button type="button" (click)="eliminarImagen(imagen)"
                      class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-4">
          <button type="button" (click)="cancelar()"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            Cancelar
          </button>
          <button type="submit" [disabled]="resenaForm.invalid || enviando"
                  class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="!enviando">Publicar Reseña</span>
            <span *ngIf="enviando" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FormularioResenaComponent {
  @Input() emprendedorId!: number;
  @Output() resenaCreada = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  resenaForm: FormGroup;
  mostrarFormulario = true;
  enviando = false;
  imagenesPrevisualizacion: { file: File; url: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private resenasService: ResenasService
  ) {
    this.resenaForm = this.fb.group({
      nombre_autor: ['', [Validators.required, Validators.maxLength(100)]],
      comentario: ['', [Validators.required, Validators.minLength(10)]],
      puntuacion: [0, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  setPuntuacion(puntuacion: number): void {
    this.resenaForm.patchValue({ puntuacion });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);
    const maxSize = 5 * 1024 * 1024; // 5MB

    files.forEach(file => {
      if (file.size > maxSize) {
        alert(`La imagen ${file.name} excede el tamaño máximo de 5MB`);
        return;
      }

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert(`La imagen ${file.name} debe ser JPEG o PNG`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagenesPrevisualizacion.push({
          file,
          url: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    });
  }

  eliminarImagen(imagen: { file: File; url: string }): void {
    this.imagenesPrevisualizacion = this.imagenesPrevisualizacion.filter(img => img !== imagen);
  }

  onSubmit(): void {
    if (this.resenaForm.invalid) return;

    this.enviando = true;
    const formData = new FormData();

    // Agregar campos del formulario
    Object.keys(this.resenaForm.value).forEach(key => {
      formData.append(key, this.resenaForm.value[key]);
    });

    // Agregar emprendedor_id
    formData.append('emprendedor_id', this.emprendedorId.toString());

    // Agregar imágenes
    this.imagenesPrevisualizacion.forEach((imagen, index) => {
      formData.append(`imagenes[${index}]`, imagen.file);
    });

    this.resenasService.crearResena(formData).subscribe({
      next: () => {
        alert('¡Reseña publicada correctamente!');
        this.resenaCreada.emit();
        this.mostrarFormulario = false;
      },
      error: (error) => {
        console.error('Error al crear la reseña:', error);
        if (error.status === 422) {
          const errores = error.error.errors;
          Object.keys(errores).forEach(key => {
            const control = this.resenaForm.get(key);
            if (control) {
              control.setErrors({ server: errores[key][0] });
            }
          });
        } else {
          alert('Error al publicar la reseña. Por favor, inténtalo de nuevo.');
        }
      },
      complete: () => {
        this.enviando = false;
      }
    });
  }

  cancelar(): void {
    this.cancelado.emit();
    this.mostrarFormulario = false;
  }
}
