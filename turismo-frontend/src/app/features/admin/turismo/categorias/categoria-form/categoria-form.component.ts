import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurismoService, Categoria } from '../../../../../core/services/turismo.service';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="sm:flex sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900">{{ isEditMode ? 'Editar Categoría' : 'Crear Categoría' }}</h1>
        <div class="mt-4 sm:mt-0">
          <a 
            routerLink="/admin/categorias" 
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
          <form [formGroup]="categoriaForm" (ngSubmit)="onSubmit()" class="space-y-6 p-6">
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
                  ></textarea>
                </div>
              </div>
              
              <!-- URL del Icono -->
              <div class="sm:col-span-6">
                <label for="icono_url" class="block text-sm font-medium text-gray-700">URL del Icono</label>
                <div class="mt-1">
                  <input 
                    type="text" 
                    id="icono_url" 
                    formControlName="icono_url" 
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <p class="mt-2 text-sm text-gray-500">URL a una imagen que representa esta categoría</p>
              </div>
              
              <!-- Vista previa del icono -->
              <div class="sm:col-span-6">
                <div class="flex items-center">
                  <div class="mr-3">
                    <label class="block text-sm font-medium text-gray-700">Vista previa</label>
                    <div class="mt-1 h-20 w-20 rounded-md bg-gray-100 flex items-center justify-center">
                      @if (previewUrl) {
                        <img [src]="previewUrl" alt="Vista previa" class="h-16 w-16 object-contain">
                      } @else {
                        <svg class="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      }
                    </div>
                  </div>
                </div>
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
            
            <div class="flex justify-end space-x-3">
              <button 
                type="button"
                routerLink="/admin/categorias"
                class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              
              <button 
                type="submit" 
                class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                [disabled]="saving || categoriaForm.invalid"
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
export class CategoriaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private turismoService = inject(TurismoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  categoriaForm!: FormGroup;
  categoriaId: number | null = null;
  
  loading = false;
  saving = false;
  submitted = false;
  error = '';
  previewUrl = '';
  
  get isEditMode(): boolean {
    return this.categoriaId !== null;
  }
  
  ngOnInit() {
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.categoriaId = +id;
      this.loadCategoria(this.categoriaId);
    }

    // Actualizar vista previa cuando cambia la URL del icono
    this.categoriaForm.get('icono_url')?.valueChanges.subscribe(url => {
      this.previewUrl = url;
    });
  }
  
  initForm() {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      icono_url: ['']
    });
  }
  
  loadCategoria(id: number) {
    this.loading = true;
    this.turismoService.getCategoria(id).subscribe({
      next: (categoria) => {
        this.categoriaForm.patchValue({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion || '',
          icono_url: categoria.icono_url || ''
        });
        this.previewUrl = categoria.icono_url || '';
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar categoría:', error);
        this.error = 'Error al cargar los datos de la categoría. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoriaForm.get(fieldName);
    return (field?.invalid && (field?.dirty || field?.touched || this.submitted)) || false;
  }
  
  onSubmit() {
    this.submitted = true;
    this.error = '';
    
    if (this.categoriaForm.invalid) {
      return;
    }
    
    const formData = this.categoriaForm.value;
    
    this.saving = true;
    
    if (this.isEditMode && this.categoriaId) {
      // Actualizar categoría existente
      this.turismoService.updateCategoria(this.categoriaId, formData).subscribe({
        next: () => {
          this.saving = false;
          alert('Categoría actualizada correctamente');
          this.router.navigate(['/admin/categorias']);
        },
        error: (error) => {
          console.error('Error al actualizar categoría:', error);
          this.error = error.error?.message || 'Error al actualizar la categoría. Por favor, intente nuevamente.';
          this.saving = false;
        }
      });
    } else {
      // Crear nueva categoría
      this.turismoService.createCategoria(formData).subscribe({
        next: () => {
          this.saving = false;
          alert('Categoría creada correctamente');
          this.router.navigate(['/admin/categorias']);
        },
        error: (error) => {
          console.error('Error al crear categoría:', error);
          this.error = error.error?.message || 'Error al crear la categoría. Por favor, intente nuevamente.';
          this.saving = false;
        }
      });
    }
  }
}