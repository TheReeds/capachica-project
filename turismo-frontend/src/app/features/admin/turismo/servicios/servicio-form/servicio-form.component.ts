import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurismoService, Servicio, Categoria, Emprendedor } from '../../../../../core/services/turismo.service';

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ isEditMode ? 'Editar' : 'Crear' }} Servicio</h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ isEditMode ? 'Actualice la información del servicio.' : 'Complete el formulario para crear un nuevo servicio.' }}
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <a 
            [routerLink]="backLink" 
            class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver
          </a>
        </div>
      </div>
      
      @if (loading) {
        <div class="rounded-lg bg-white p-6 shadow-sm">
          <div class="flex justify-center items-center p-8">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
            <span class="ml-4">Cargando...</span>
          </div>
        </div>
      } @else {
        <form [formGroup]="servicioForm" (ngSubmit)="submitForm()" class="space-y-6">
          <div class="rounded-lg bg-white shadow-sm overflow-hidden">
            <div class="p-6 space-y-6">
              <!-- Información básica -->
              <div>
                <h2 class="text-lg font-medium text-gray-900">Información del Servicio</h2>
                <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <!-- Nombre -->
                  <div class="sm:col-span-4">
                    <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre del Servicio</label>
                    <div class="mt-1">
                      <input 
                        type="text" 
                        id="nombre" 
                        formControlName="nombre"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                    </div>
                    @if (servicioForm.get('nombre')?.invalid && servicioForm.get('nombre')?.touched) {
                      <p class="mt-2 text-sm text-red-600">El nombre es obligatorio</p>
                    }
                  </div>
                  
                  <!-- Precio referencial -->
                  <div class="sm:col-span-2">
                    <label for="precio_referencial" class="block text-sm font-medium text-gray-700">Precio Referencial</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                        <span class="text-gray-500 sm:text-sm">S/.</span>
                      </div>
                      <input 
                        type="number" 
                        id="precio_referencial" 
                        formControlName="precio_referencial"
                        min="0"
                        step="0.01"
                        class="block w-full pl-9 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                    </div>
                  </div>
                  
                  <!-- Descripción -->
                  <div class="sm:col-span-6">
                    <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
                    <div class="mt-1">
                      <textarea 
                        id="descripcion" 
                        formControlName="descripcion"
                        rows="3"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      ></textarea>
                    </div>
                  </div>
                  
                  <!-- Emprendedor -->
                  <div class="sm:col-span-3">
                    <label for="emprendedor_id" class="block text-sm font-medium text-gray-700">Emprendedor</label>
                    <div class="mt-1">
                      <select 
                        id="emprendedor_id" 
                        formControlName="emprendedor_id"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        [attr.disabled]="isEmprendedorPreselected ? true : null"
                      >
                        <option value="">Seleccione emprendedor</option>
                        @for (emprendedor of emprendedores; track emprendedor.id) {
                          <option [value]="emprendedor.id">{{ emprendedor.nombre }}</option>
                        }
                      </select>
                    </div>
                    @if (servicioForm.get('emprendedor_id')?.invalid && servicioForm.get('emprendedor_id')?.touched) {
                      <p class="mt-2 text-sm text-red-600">El emprendedor es obligatorio</p>
                    }
                  </div>
                  
                  <!-- Estado -->
                  <div class="sm:col-span-3">
                    <label class="block text-sm font-medium text-gray-700">Estado</label>
                    <div class="mt-2">
                      <div class="flex items-center">
                        <input 
                          type="checkbox"
                          id="estado" 
                          formControlName="estado"
                          class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        >
                        <label for="estado" class="ml-2 block text-sm text-gray-700">
                          Servicio activo
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Categorías -->
                  <div class="sm:col-span-6">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Categorías</label>
                    <div class="border border-gray-300 rounded-md p-4 bg-gray-50">
                      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        @for (categoria of categorias; track categoria.id) {
                          <div class="relative flex items-start">
                            <div class="flex items-center h-5">
                              <input 
                                type="checkbox"
                                [id]="'categoria_' + categoria.id" 
                                [checked]="isSelectedCategoria(categoria.id || 0)"
                                (change)="toggleCategoria(categoria.id || 0, $event)"
                                class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              >
                            </div>
                            <div class="ml-3 text-sm">
                              <label [for]="'categoria_' + categoria.id" class="font-medium text-gray-700">{{ categoria.nombre }}</label>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Botones de acción -->
            <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button
                type="button"
                (click)="cancel()"
                class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 mr-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="servicioForm.invalid || isSubmitting"
                class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                [class.opacity-50]="servicioForm.invalid || isSubmitting"
                [class.cursor-not-allowed]="servicioForm.invalid || isSubmitting"
                >
                <ng-container *ngIf="isSubmitting; else textoNormal">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                </ng-container>
                <ng-template #textoNormal>
                    {{ isEditMode ? 'Actualizar' : 'Crear' }} Servicio
                </ng-template>
                </button>
            </div>
          </div>
        </form>
      }
    </div>
  `,
})
export class ServicioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private turismoService = inject(TurismoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  servicioForm!: FormGroup;
  servicio: Servicio | null = null;
  categorias: Categoria[] = [];
  emprendedores: Emprendedor[] = [];
  
  loading = true;
  isSubmitting = false;
  isEditMode = false;
  servicioId: number | null = null;
  
  selectedCategorias: number[] = [];
  isEmprendedorPreselected = false;
  backLink = '/admin/servicios';
  
  ngOnInit() {
    this.initForm();
    this.loadCategorias();
    this.loadEmprendedores();
    
    // Verificar si es modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.servicioId = +id;
      this.loadServicio(this.servicioId);
    } else {
      // Si viene con emprendedor preseleccionado por query param
      const emprendedorId = this.route.snapshot.queryParams['emprendedor_id'];
      if (emprendedorId) {
        this.isEmprendedorPreselected = true;
        this.servicioForm.patchValue({ emprendedor_id: +emprendedorId });
        this.backLink = `/admin/emprendedores/${emprendedorId}/servicios`;
      }
      
      this.loading = false;
    }
  }
  
  initForm() {
    this.servicioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      precio_referencial: [0],
      emprendedor_id: ['', [Validators.required]],
      estado: [true]
    });
  }
  
  loadCategorias() {
    this.turismoService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }
  
  loadEmprendedores() {
    // Cargar todos los emprendedores (primera página con tamaño grande)
    this.turismoService.getEmprendedores(1, 100).subscribe({
      next: (response) => {
        this.emprendedores = response.data;
      },
      error: (error) => {
        console.error('Error al cargar emprendedores:', error);
      }
    });
  }
  
  loadServicio(id: number) {
    this.loading = true;
    this.turismoService.getServicio(id).subscribe({
      next: (servicio) => {
        this.servicio = servicio;
        
        // Llenar el formulario con los datos del servicio
        this.servicioForm.patchValue({
          nombre: servicio.nombre,
          descripcion: servicio.descripcion,
          precio_referencial: servicio.precio_referencial,
          emprendedor_id: servicio.emprendedor_id,
          estado: servicio.estado
        });
        
        // Guardar las categorías seleccionadas
        if (servicio.categorias && servicio.categorias.length > 0) {
          this.selectedCategorias = servicio.categorias.map(c => c.id || 0).filter(id => id > 0);
        }
        
        // Establecer la ruta de regreso si viene de un emprendedor
        if (servicio.emprendedor_id) {
          this.backLink = `/admin/emprendedores/${servicio.emprendedor_id}/servicios`;
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar servicio:', error);
        this.loading = false;
      }
    });
  }
  
  // Categorías
  isSelectedCategoria(categoriaId: number): boolean {
    return this.selectedCategorias.includes(categoriaId);
  }
  
  toggleCategoria(categoriaId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (isChecked && !this.isSelectedCategoria(categoriaId)) {
      this.selectedCategorias.push(categoriaId);
    } else if (!isChecked && this.isSelectedCategoria(categoriaId)) {
      this.selectedCategorias = this.selectedCategorias.filter(id => id !== categoriaId);
    }
  }
  
  submitForm() {
    if (this.servicioForm.invalid || this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Preparar datos para enviar
    const formData = this.servicioForm.value;
    formData.categorias = this.selectedCategorias;
    
    // Crear o actualizar servicio
    if (this.isEditMode && this.servicioId) {
      this.turismoService.updateServicio(this.servicioId, formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          alert('Servicio actualizado correctamente');
          this.navigateBack();
        },
        error: (error) => {
          console.error('Error al actualizar servicio:', error);
          this.isSubmitting = false;
          alert('Error al actualizar el servicio. Por favor, intente nuevamente.');
        }
      });
    } else {
      this.turismoService.createServicio(formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          alert('Servicio creado correctamente');
          this.navigateBack();
        },
        error: (error) => {
          console.error('Error al crear servicio:', error);
          this.isSubmitting = false;
          alert('Error al crear el servicio. Por favor, intente nuevamente.');
        }
      });
    }
  }
  
  cancel() {
    this.navigateBack();
  }
  
  navigateBack() {
    this.router.navigateByUrl(this.backLink);
  }
}