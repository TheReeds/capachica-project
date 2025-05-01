import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurismoService, Asociacion, Municipalidad } from '../../../../../core/services/turismo.service';

@Component({
  selector: 'app-asociacion-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="sm:flex sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900">{{ isEditMode ? 'Editar Asociación' : 'Crear Asociación' }}</h1>
        <div class="mt-4 sm:mt-0">
          <a 
            routerLink="/admin/asociaciones" 
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
          <form [formGroup]="asociacionForm" (ngSubmit)="onSubmit()" class="space-y-6 p-6">
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
              
              <!-- Municipalidad -->
              <div class="sm:col-span-3">
                <label for="municipalidad_id" class="block text-sm font-medium text-gray-700">Municipalidad</label>
                <div class="mt-1">
                  <select 
                    id="municipalidad_id" 
                    formControlName="municipalidad_id" 
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    [ngClass]="{'border-red-300': isFieldInvalid('municipalidad_id')}"
                  >
                    <option [ngValue]="null">Seleccionar municipalidad</option>
                    @for (municipalidad of municipalidades; track municipalidad.id) {
                      <option [ngValue]="municipalidad.id">{{ municipalidad.nombre }}</option>
                    }
                  </select>
                  @if (isFieldInvalid('municipalidad_id')) {
                    <p class="mt-2 text-sm text-red-600">La municipalidad es requerida</p>
                  }
                </div>
              </div>
              
              <!-- Ubicación -->
              <div class="sm:col-span-3">
                <label for="ubicacion" class="block text-sm font-medium text-gray-700">Ubicación</label>
                <div class="mt-1">
                  <input 
                    type="text" 
                    id="ubicacion" 
                    formControlName="ubicacion" 
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <!-- Teléfono -->
              <div class="sm:col-span-3">
                <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono</label>
                <div class="mt-1">
                  <input 
                    type="tel" 
                    id="telefono" 
                    formControlName="telefono" 
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <!-- Email -->
              <div class="sm:col-span-3">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <div class="mt-1">
                  <input 
                    type="email" 
                    id="email" 
                    formControlName="email" 
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <!-- Estado -->
              <div class="sm:col-span-3">
                <div class="relative flex items-start">
                  <div class="flex h-5 items-center">
                    <input 
                      id="estado" 
                      formControlName="estado"
                      type="checkbox" 
                      class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="estado" class="font-medium text-gray-700">Activo</label>
                    <p class="text-gray-500">Indica si la asociación está activa actualmente</p>
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
                routerLink="/admin/asociaciones"
                class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              
              <button 
                type="submit" 
                class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                [disabled]="saving || asociacionForm.invalid"
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
export class AsociacionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private turismoService = inject(TurismoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  asociacionForm!: FormGroup;
  asociacionId: number | null = null;
  
  municipalidades: Municipalidad[] = [];
  
  loading = false;
  saving = false;
  submitted = false;
  error = '';
  
  get isEditMode(): boolean {
    return this.asociacionId !== null;
  }
  
  ngOnInit() {
    this.initForm();
    this.loadMunicipalidades();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.asociacionId = +id;
      this.loadAsociacion(this.asociacionId);
    }
  }
  
  initForm() {
    this.asociacionForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      municipalidad_id: [null, Validators.required],
      ubicacion: [''],
      telefono: [''],
      email: [''],
      estado: [true]
    });
  }
  
  loadMunicipalidades() {
    this.turismoService.getMunicipalidades().subscribe({
      next: (municipalidades) => {
        this.municipalidades = municipalidades;
      },
      error: (error) => {
        console.error('Error al cargar municipalidades:', error);
        this.error = 'Error al cargar las municipalidades. Por favor, recargue la página e intente nuevamente.';
      }
    });
  }
  
  loadAsociacion(id: number) {
    this.loading = true;
    this.turismoService.getAsociacion(id).subscribe({
      next: (asociacion) => {
        this.asociacionForm.patchValue({
          nombre: asociacion.nombre,
          descripcion: asociacion.descripcion,
          municipalidad_id: asociacion.municipalidad_id,
          ubicacion: asociacion.ubicacion || '',
          telefono: asociacion.telefono || '',
          email: asociacion.email || '',
          estado: asociacion.estado !== undefined ? asociacion.estado : true
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar asociación:', error);
        this.error = 'Error al cargar los datos de la asociación. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.asociacionForm.get(fieldName);
    return (field?.invalid && (field?.dirty || field?.touched || this.submitted)) || false;
  }
  
  onSubmit() {
    this.submitted = true;
    this.error = '';
    
    if (this.asociacionForm.invalid) {
      return;
    }
    
    const formData = this.asociacionForm.value;
    
    this.saving = true;
    
    if (this.isEditMode && this.asociacionId) {
      // Actualizar asociación existente
      this.turismoService.updateAsociacion(this.asociacionId, formData).subscribe({
        next: () => {
          this.saving = false;
          alert('Asociación actualizada correctamente');
          this.router.navigate(['/admin/asociaciones']);
        },
        error: (error) => {
          console.error('Error al actualizar asociación:', error);
          this.error = error.error?.message || 'Error al actualizar la asociación. Por favor, intente nuevamente.';
          this.saving = false;
        }
      });
    } else {
      // Crear nueva asociación
      this.turismoService.createAsociacion(formData).subscribe({
        next: () => {
          this.saving = false;
          alert('Asociación creada correctamente');
          this.router.navigate(['/admin/asociaciones']);
        },
        error: (error) => {
          console.error('Error al crear asociación:', error);
          this.error = error.error?.message || 'Error al crear la asociación. Por favor, intente nuevamente.';
          this.saving = false;
        }
      });
    }
  }
}