import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurismoService, Emprendedor, Asociacion, Slider } from '../../../../../core/services/turismo.service';
import { SliderImage, SliderUploadComponent } from '../../../../../shared/components/slider-upload/slider-upload.component';


@Component({
  selector: 'app-emprendedor-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, SliderUploadComponent],
  template: `
    <div class="space-y-6">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ isEditMode ? 'Editar' : 'Crear' }} Emprendedor</h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ isEditMode ? 'Actualice la información del emprendedor.' : 'Complete el formulario para crear un nuevo emprendedor.' }}
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <a 
            routerLink="/admin/emprendedores" 
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
        <form [formGroup]="emprendedorForm" (ngSubmit)="submitForm()" class="space-y-6">
          <!-- Pestañas de navegación -->
          <div class="bg-white shadow-sm rounded-lg overflow-hidden">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8 px-6 pt-4">
                <button 
                  type="button"
                  (click)="activeTab = 'informacion-basica'"
                  class="pb-4 px-1 border-b-2 font-medium text-sm"
                  [ngClass]="{
                    'border-primary-500 text-primary-600': activeTab === 'informacion-basica',
                    'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'informacion-basica'
                  }"
                >
                  Información Básica
                </button>
                <button 
                  type="button"
                  (click)="activeTab = 'detalles-negocio'"
                  class="pb-4 px-1 border-b-2 font-medium text-sm"
                  [ngClass]="{
                    'border-primary-500 text-primary-600': activeTab === 'detalles-negocio',
                    'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'detalles-negocio'
                  }"
                >
                  Detalles del Negocio
                </button>
                <button 
                  type="button"
                  (click)="activeTab = 'imagenes'"
                  class="pb-4 px-1 border-b-2 font-medium text-sm"
                  [ngClass]="{
                    'border-primary-500 text-primary-600': activeTab === 'imagenes',
                    'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'imagenes'
                  }"
                >
                  Imágenes
                </button>
              </nav>
            </div>
            
            <div class="p-6">
              <!-- Tab: Información Básica -->
              @if (activeTab === 'informacion-basica') {
                <div class="space-y-6">
                  <!-- Información básica -->
                  <div>
                    <h2 class="text-lg font-medium text-gray-900">Información Básica</h2>
                    <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <!-- Nombre -->
                      <div class="sm:col-span-4">
                        <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre del Emprendimiento</label>
                        <div class="mt-1">
                          <input 
                            type="text" 
                            id="nombre" 
                            formControlName="nombre"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                        </div>
                        @if (emprendedorForm.get('nombre')?.invalid && emprendedorForm.get('nombre')?.touched) {
                          <p class="mt-2 text-sm text-red-600">El nombre es obligatorio</p>
                        }
                      </div>
                      
                      <!-- Tipo de Servicio -->
                      <div class="sm:col-span-2">
                        <label for="tipo_servicio" class="block text-sm font-medium text-gray-700">Tipo de Servicio</label>
                        <div class="mt-1">
                          <select 
                            id="tipo_servicio" 
                            formControlName="tipo_servicio"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                            <option value="">Seleccione tipo</option>
                            <option value="Artesanía">Artesanía</option>
                            <option value="Gastronomía">Gastronomía</option>
                            <option value="Alojamiento">Alojamiento</option>
                            <option value="Transporte">Transporte</option>
                            <option value="Guía">Guía Turístico</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                        @if (emprendedorForm.get('tipo_servicio')?.invalid && emprendedorForm.get('tipo_servicio')?.touched) {
                          <p class="mt-2 text-sm text-red-600">El tipo de servicio es obligatorio</p>
                        }
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
                        @if (emprendedorForm.get('descripcion')?.invalid && emprendedorForm.get('descripcion')?.touched) {
                          <p class="mt-2 text-sm text-red-600">La descripción es obligatoria</p>
                        }
                      </div>
                      
                      <!-- Categoría -->
                      <div class="sm:col-span-3">
                        <label for="categoria" class="block text-sm font-medium text-gray-700">Categoría</label>
                        <div class="mt-1">
                          <select 
                            id="categoria" 
                            formControlName="categoria"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                            <option value="">Seleccione categoría</option>
                            <option value="Artesanía">Artesanía</option>
                            <option value="Gastronomía">Gastronomía</option>
                            <option value="Alojamiento">Alojamiento</option>
                            <option value="Aventura">Aventura</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Transporte">Transporte</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                        @if (emprendedorForm.get('categoria')?.invalid && emprendedorForm.get('categoria')?.touched) {
                          <p class="mt-2 text-sm text-red-600">La categoría es obligatoria</p>
                        }
                      </div>
                      
                      <!-- Asociación -->
                      <div class="sm:col-span-3">
                        <label for="asociacion_id" class="block text-sm font-medium text-gray-700">Asociación</label>
                        <div class="mt-1">
                          <select 
                            id="asociacion_id" 
                            formControlName="asociacion_id"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                            <option [ngValue]="null">Sin asociación</option>
                            @for (asociacion of asociaciones; track asociacion.id) {
                              <option [ngValue]="asociacion.id">{{ asociacion.nombre }}</option>
                            }
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Información de contacto -->
                  <div class="pt-6 border-t border-gray-200">
                    <h2 class="text-lg font-medium text-gray-900">Información de Contacto</h2>
                    <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <!-- Ubicación -->
                      <div class="sm:col-span-6">
                        <label for="ubicacion" class="block text-sm font-medium text-gray-700">Ubicación</label>
                        <div class="mt-1">
                          <input 
                            type="text" 
                            id="ubicacion" 
                            formControlName="ubicacion"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                        </div>
                        @if (emprendedorForm.get('ubicacion')?.invalid && emprendedorForm.get('ubicacion')?.touched) {
                          <p class="mt-2 text-sm text-red-600">La ubicación es obligatoria</p>
                        }
                      </div>
                      
                      <!-- Teléfono -->
                      <div class="sm:col-span-3">
                        <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono</label>
                        <div class="mt-1">
                          <input 
                            type="text" 
                            id="telefono" 
                            formControlName="telefono"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                        </div>
                        @if (emprendedorForm.get('telefono')?.invalid && emprendedorForm.get('telefono')?.touched) {
                          <p class="mt-2 text-sm text-red-600">El teléfono es obligatorio</p>
                        }
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
                          >
                        </div>
                        @if (emprendedorForm.get('email')?.invalid && emprendedorForm.get('email')?.touched) {
                          <p class="mt-2 text-sm text-red-600">El email es obligatorio y debe ser válido</p>
                        }
                      </div>
                      
                      <!-- Página web -->
                      <div class="sm:col-span-3">
                        <label for="pagina_web" class="block text-sm font-medium text-gray-700">Página Web</label>
                        <div class="mt-1">
                          <input 
                            type="url" 
                            id="pagina_web" 
                            formControlName="pagina_web"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                        </div>
                      </div>
                      
                      <!-- Horario -->
                      <div class="sm:col-span-3">
                        <label for="horario_atencion" class="block text-sm font-medium text-gray-700">Horario de Atención</label>
                        <div class="mt-1">
                          <input 
                            type="text" 
                            id="horario_atencion" 
                            formControlName="horario_atencion"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              
              <!-- Tab: Detalles del Negocio -->
              @if (activeTab === 'detalles-negocio') {
                <div class="space-y-6">
                  <!-- Detalles del negocio -->
                  <div>
                    <h2 class="text-lg font-medium text-gray-900">Detalles del Negocio</h2>
                    <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <!-- Rango de precios -->
                      <div class="sm:col-span-2">
                        <label for="precio_rango" class="block text-sm font-medium text-gray-700">Rango de Precios</label>
                        <div class="mt-1">
                          <input 
                            type="text" 
                            id="precio_rango" 
                            formControlName="precio_rango"
                            placeholder="Ej: S/. 20 - S/. 100"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                        </div>
                      </div>
                      
                      <!-- Capacidad de aforo -->
                      <div class="sm:col-span-2">
                        <label for="capacidad_aforo" class="block text-sm font-medium text-gray-700">Capacidad de Aforo</label>
                        <div class="mt-1">
                          <input 
                            type="number" 
                            id="capacidad_aforo" 
                            formControlName="capacidad_aforo"
                            min="0"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                        </div>
                      </div>
                      
                      <!-- Número de personas que atiende -->
                      <div class="sm:col-span-2">
                        <label for="numero_personas_atiende" class="block text-sm font-medium text-gray-700">Personas que Atiende</label>
                        <div class="mt-1">
                          <input 
                            type="number" 
                            id="numero_personas_atiende" 
                            formControlName="numero_personas_atiende"
                            min="0"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                        </div>
                      </div>
                      
                      <!-- Métodos de pago -->
                      <div class="sm:col-span-6">
                        <label class="block text-sm font-medium text-gray-700">Métodos de Pago</label>
                        <div class="mt-1 space-y-2">
                          <div class="flex items-center">
                            <input 
                              type="checkbox"
                              id="metodo_efectivo" 
                              [checked]="hasPaymentMethod('Efectivo')"
                              (change)="togglePaymentMethod('Efectivo', $event)"
                              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            >
                            <label for="metodo_efectivo" class="ml-2 block text-sm text-gray-700">Efectivo</label>
                          </div>
                          <div class="flex items-center">
                            <input 
                              type="checkbox"
                              id="metodo_tarjeta" 
                              [checked]="hasPaymentMethod('Tarjeta')"
                              (change)="togglePaymentMethod('Tarjeta', $event)"
                              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            >
                            <label for="metodo_tarjeta" class="ml-2 block text-sm text-gray-700">Tarjeta de Crédito/Débito</label>
                          </div>
                          <div class="flex items-center">
                            <input 
                              type="checkbox"
                              id="metodo_transferencia" 
                              [checked]="hasPaymentMethod('Transferencia')"
                              (change)="togglePaymentMethod('Transferencia', $event)"
                              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            >
                            <label for="metodo_transferencia" class="ml-2 block text-sm text-gray-700">Transferencia Bancaria</label>
                          </div>
                          <div class="flex items-center">
                            <input 
                              type="checkbox"
                              id="metodo_yape" 
                              [checked]="hasPaymentMethod('Yape')"
                              (change)="togglePaymentMethod('Yape', $event)"
                              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            >
                            <label for="metodo_yape" class="ml-2 block text-sm text-gray-700">Yape</label>
                          </div>
                          <div class="flex items-center">
                            <input 
                              type="checkbox"
                              id="metodo_plin" 
                              [checked]="hasPaymentMethod('Plin')"
                              (change)="togglePaymentMethod('Plin', $event)"
                              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            >
                            <label for="metodo_plin" class="ml-2 block text-sm text-gray-700">Plin</label>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Idiomas hablados -->
                      <div class="sm:col-span-6">
                        <label class="block text-sm font-medium text-gray-700">Idiomas Hablados</label>
                        <div class="mt-1 space-y-2">
                          <div class="flex items-center">
                            <input 
                              type="checkbox"
                              id="idioma_espanol" 
                              [checked]="hasLanguage('Español')"
                              (change)="toggleLanguage('Español', $event)"
                              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            >
                            <label for="idioma_espanol" class="ml-2 block text-sm text-gray-700">Español</label>
                          </div>
                          <div class="flex items-center">
                            <input 
                              type="checkbox"
                              id="idioma_ingles" 
                              [checked]="hasLanguage('Inglés')"
                              (change)="toggleLanguage('Inglés', $event)"
                              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            >
                            <label for="idioma_ingles" class="ml-2 block text-sm text-gray-700">Inglés</label>
                          </div>
                          <div class="flex items-center">
                            <input 
                              type="checkbox"
                              id="idioma_quechua" 
                              [checked]="hasLanguage('Quechua')"
                              (change)="toggleLanguage('Quechua', $event)"
                              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            >
                            <label for="idioma_quechua" class="ml-2 block text-sm text-gray-700">Quechua</label>
                          </div>
                          <div class="flex items-center">
                            <input 
                              type="checkbox"
                              id="idioma_aymara" 
                              [checked]="hasLanguage('Aymara')"
                              (change)="toggleLanguage('Aymara', $event)"
                              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            >
                            <label for="idioma_aymara" class="ml-2 block text-sm text-gray-700">Aymara</label>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Opciones de acceso -->
                      <div class="sm:col-span-3">
                        <label for="opciones_acceso" class="block text-sm font-medium text-gray-700">Opciones de Acceso</label>
                        <div class="mt-1">
                          <input 
                            type="text" 
                            id="opciones_acceso" 
                            formControlName="opciones_acceso"
                            placeholder="Ej: Transporte público, a pie, etc."
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                        </div>
                      </div>
                      
                      <!-- Facilidades para discapacitados -->
                      <div class="sm:col-span-3">
                        <label class="block text-sm font-medium text-gray-700">Facilidades para Discapacitados</label>
                        <div class="mt-2">
                          <div class="flex items-center">
                            <input 
                              type="checkbox"
                              id="facilidades_discapacidad" 
                              formControlName="facilidades_discapacidad"
                              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            >
                            <label for="facilidades_discapacidad" class="ml-2 block text-sm text-gray-700">
                              Cuenta con facilidades para personas con discapacidad
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              
              <!-- Tab: Imágenes -->
              @if (activeTab === 'imagenes') {
                <div class="space-y-6">
                  <!-- Sliders Principales -->
                  <app-slider-upload
                    title="Imágenes Principales"
                    [slidersFormArray]="slidersPrincipalesArray"
                    [existingSliders]="slidersPrincipales"
                    [isSliderPrincipal]="true"
                    (changeSlidersEvent)="onSlidersPrincipalesChange($event)"
                    (deletedSlidersEvent)="onDeletedSlidersPrincipalesChange($event)"
                  ></app-slider-upload>

                  <!-- Sliders Secundarios -->
                  <app-slider-upload
                    title="Imágenes Secundarias"
                    [slidersFormArray]="slidersSecundariosArray"
                    [existingSliders]="slidersSecundarios"
                    [isSliderPrincipal]="false"
                    (changeSlidersEvent)="onSlidersSecundariosChange($event)"
                    (deletedSlidersEvent)="onDeletedSlidersSecundariosChange($event)"
                  ></app-slider-upload>
                </div>
              }
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
                [disabled]="emprendedorForm.invalid || isSubmitting"
                class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                [class.opacity-50]="emprendedorForm.invalid || isSubmitting"
                [class.cursor-not-allowed]="emprendedorForm.invalid || isSubmitting"
              >
                @if (isSubmitting) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                } @else {
                  {{ isEditMode ? 'Actualizar' : 'Crear' }} Emprendedor
                }
              </button>
            </div>
          </div>
        </form>
      }
    </div>
  `,
})
export class EmprendedorFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private turismoService = inject(TurismoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  emprendedorForm!: FormGroup;
  emprendedor: Emprendedor | null = null;
  asociaciones: Asociacion[] = [];
  
  // Sliders
  slidersPrincipales: SliderImage[] = [];
  slidersSecundarios: SliderImage[] = [];

  deletedSlidersPrincipales: number[] = [];
  deletedSlidersSecundarios: number[] = [];
  
  loading = true;
  isSubmitting = false;
  isEditMode = false;
  emprendedorId: number | null = null;
  
  paymentMethods: string[] = [];
  languages: string[] = [];
  
  activeTab = 'informacion-basica';
  
  get slidersPrincipalesArray(): FormArray {
    return this.emprendedorForm.get('sliders_principales') as FormArray;
  }
  
  get slidersSecundariosArray(): FormArray {
    return this.emprendedorForm.get('sliders_secundarios') as FormArray;
  }
  
  ngOnInit() {
    this.initForm();
    this.loadAsociaciones();
    
    // Verificar si es modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.emprendedorId = +id;
      this.loadEmprendedor(this.emprendedorId);
    } else {
      this.loading = false;
      
      // Si viene con asociación preseleccionada por query param
      const asociacionId = this.route.snapshot.queryParams['asociacion_id'];
      if (asociacionId) {
        this.emprendedorForm.patchValue({ asociacion_id: +asociacionId });
      }
    }
  }
  
  initForm() {
    this.emprendedorForm = this.fb.group({
      nombre: ['', [Validators.required]],
      tipo_servicio: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      pagina_web: [''],
      horario_atencion: [''],
      precio_rango: [''],
      capacidad_aforo: [null],
      numero_personas_atiende: [null],
      categoria: ['', [Validators.required]],
      opciones_acceso: [''],
      facilidades_discapacidad: [false],
      asociacion_id: [null],
      sliders_principales: this.fb.array([]),
      sliders_secundarios: this.fb.array([])
    });
  }
  
  loadAsociaciones() {
    this.turismoService.getAsociaciones(1, 100).subscribe({
      next: (response) => {
        this.asociaciones = response.data;
      },
      error: (error) => {
        console.error('Error al cargar asociaciones:', error);
      }
    });
  }
  
  loadEmprendedor(id: number) {
    this.loading = true;
    this.turismoService.getEmprendedor(id).subscribe({
      next: (emprendedor) => {
        console.log('Emprendedor cargado:', emprendedor);
    
        this.emprendedor = emprendedor;
        this.paymentMethods = emprendedor.metodos_pago || [];
        this.languages = emprendedor.idiomas_hablados || [];
        
        // Llenar el formulario con los datos del emprendedor
        this.emprendedorForm.patchValue({
          nombre: emprendedor.nombre,
          tipo_servicio: emprendedor.tipo_servicio,
          descripcion: emprendedor.descripcion,
          ubicacion: emprendedor.ubicacion,
          telefono: emprendedor.telefono,
          email: emprendedor.email,
          pagina_web: emprendedor.pagina_web,
          horario_atencion: emprendedor.horario_atencion,
          precio_rango: emprendedor.precio_rango,
          capacidad_aforo: emprendedor.capacidad_aforo,
          numero_personas_atiende: emprendedor.numero_personas_atiende,
          categoria: emprendedor.categoria,
          opciones_acceso: emprendedor.opciones_acceso,
          facilidades_discapacidad: emprendedor.facilidades_discapacidad,
          asociacion_id: emprendedor.asociacion_id
        });
        
        // Limpiar los arrays de sliders existentes
        this.slidersPrincipales = [];
        this.slidersSecundarios = [];
        
        // Manejar sliders principales 
        // Verifica tanto slidersPrincipales (camelCase) como sliders_principales (snake_case)
        const principales = emprendedor.slidersPrincipales || emprendedor.sliders_principales || [];
        if (principales && principales.length > 0) {
          console.log('Sliders principales encontrados:', principales.length);
          this.slidersPrincipales = principales.map(slider => ({
            id: slider.id,
            nombre: slider.nombre,
            es_principal: true, // Garantizar que es principal
            orden: slider.orden || 1,
            imagen: slider.url_completa || '',
            url_completa: slider.url_completa
          }));
        }
        
        // Manejar sliders secundarios
        // Verifica tanto slidersSecundarios (camelCase) como sliders_secundarios (snake_case)
        const secundarios = emprendedor.slidersSecundarios || emprendedor.sliders_secundarios || [];
        if (secundarios && secundarios.length > 0) {
          console.log('Sliders secundarios encontrados:', secundarios.length);
          this.slidersSecundarios = secundarios.map(slider => {
            // Verificar si descripcion es un objeto o un string
            let tituloValor = '';
            let descripcionValor = '';
            
            if (slider.descripcion && typeof slider.descripcion === 'object') {
              tituloValor = (slider.descripcion as any).titulo || '';
              descripcionValor = (slider.descripcion as any).descripcion || '';
            }
            
            return {
              id: slider.id,
              nombre: slider.nombre,
              es_principal: false, // Garantizar que NO es principal
              orden: slider.orden || 1,
              imagen: slider.url_completa || '',
              url_completa: slider.url_completa,
              titulo: tituloValor,
              descripcion: descripcionValor
            };
          });
        }
        
        // Verificar que los arrays de sliders contengan los datos esperados
        console.log('Sliders principales procesados:', this.slidersPrincipales);
        console.log('Sliders secundarios procesados:', this.slidersSecundarios);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar emprendedor:', error);
        this.loading = false;
      }
    });
  }
  
  // Métodos de pago
  hasPaymentMethod(method: string): boolean {
    return this.paymentMethods.includes(method);
  }
  
  togglePaymentMethod(method: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (isChecked && !this.hasPaymentMethod(method)) {
      this.paymentMethods.push(method);
    } else if (!isChecked && this.hasPaymentMethod(method)) {
      this.paymentMethods = this.paymentMethods.filter(m => m !== method);
    }
  }
  
  // Idiomas
  hasLanguage(language: string): boolean {
    return this.languages.includes(language);
  }
  onDeletedSlidersPrincipalesChange(deletedIds: number[]) {
    this.deletedSlidersPrincipales = deletedIds;
  }
  
  onDeletedSlidersSecundariosChange(deletedIds: number[]) {
    this.deletedSlidersSecundarios = deletedIds;
  }
  toggleLanguage(language: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (isChecked && !this.hasLanguage(language)) {
      this.languages.push(language);
    } else if (!isChecked && this.hasLanguage(language)) {
      this.languages = this.languages.filter(l => l !== language);
    }
  }
  
  // Eventos de slider
  onSlidersPrincipalesChange(sliders: SliderImage[]) {
    this.slidersPrincipales = sliders;
  }
  
  onSlidersSecundariosChange(sliders: SliderImage[]) {
    this.slidersSecundarios = sliders;
  }
  
  submitForm() {
    if (this.emprendedorForm.invalid || this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Preparar datos para enviar
    const formData = {...this.emprendedorForm.value};
    formData.metodos_pago = this.paymentMethods || []; 
    formData.idiomas_hablados = this.languages || [];
    
    // Usar los nombres de propiedades en snake_case que espera el API
    formData.sliders_principales = this.slidersPrincipales.map(slider => ({
      ...slider,
      es_principal: true
    }));
    
    formData.sliders_secundarios = this.slidersSecundarios.map(slider => ({
      ...slider,
      es_principal: false
    }));
    
    // Añadir los IDs de sliders eliminados
    formData.deleted_sliders = [
      ...this.deletedSlidersPrincipales,
      ...this.deletedSlidersSecundarios
    ];
    
    // Crear o actualizar emprendedor
    if (this.isEditMode && this.emprendedorId) {
      this.turismoService.updateEmprendedor(this.emprendedorId, formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          alert('Emprendedor actualizado correctamente');
          this.router.navigate(['/admin/emprendedores']);
        },
        error: (error) => {
          console.error('Error al actualizar emprendedor:', error);
          this.isSubmitting = false;
          alert('Error al actualizar el emprendedor. Por favor, intente nuevamente.');
        }
      });
    } else {
      this.turismoService.createEmprendedor(formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          alert('Emprendedor creado correctamente');
          this.router.navigate(['/admin/emprendedores']);
        },
        error: (error) => {
          console.error('Error al crear emprendedor:', error);
          this.isSubmitting = false;
          alert('Error al crear el emprendedor. Por favor, intente nuevamente.');
        }
      });
    }
  }
  
  cancel() {
    // Si vino de una asociación, volver a la lista de emprendedores de esa asociación
    const asociacionId = this.route.snapshot.queryParams['asociacion_id'];
    if (asociacionId) {
      this.router.navigate(['/admin/asociaciones', asociacionId, 'emprendedores']);
    } else {
      this.router.navigate(['/admin/emprendedores']);
    }
  }
}