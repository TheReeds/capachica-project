import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurismoService, Municipalidad, Slider } from '../../../../../core/services/turismo.service';
import { SliderImage, SliderUploadComponent } from '../../../../../shared/components/slider-upload/slider-upload.component';

@Component({
  selector: 'app-municipalidad-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, SliderUploadComponent],
  template: `
    <div class="space-y-6">
      <div class="sm:flex sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900">{{ isEditMode ? 'Editar Municipalidad' : 'Crear Municipalidad' }}</h1>
        <div class="mt-4 sm:mt-0">
          <a 
            routerLink="/admin/municipalidad" 
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
          <form [formGroup]="municipalidadForm" (ngSubmit)="onSubmit()">
            <!-- Pestañas de navegación -->
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8 p-4">
                <button 
                  type="button"
                  (click)="activeTab = 'informacion-general'"
                  class="pb-4 px-1 border-b-2 font-medium text-sm"
                  [ngClass]="{
                    'border-primary-500 text-primary-600': activeTab === 'informacion-general',
                    'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'informacion-general'
                  }"
                >
                  Información General
                </button>
                <button 
                  type="button"
                  (click)="activeTab = 'contacto'"
                  class="pb-4 px-1 border-b-2 font-medium text-sm"
                  [ngClass]="{
                    'border-primary-500 text-primary-600': activeTab === 'contacto',
                    'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'contacto'
                  }"
                >
                  Contacto
                </button>
                <button 
                  type="button"
                  (click)="activeTab = 'info-institucional'"
                  class="pb-4 px-1 border-b-2 font-medium text-sm"
                  [ngClass]="{
                    'border-primary-500 text-primary-600': activeTab === 'info-institucional',
                    'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'info-institucional'
                  }"
                >
                  Información Institucional
                </button>
                <button 
                  type="button"
                  (click)="activeTab = 'ubicacion'"
                  class="pb-4 px-1 border-b-2 font-medium text-sm"
                  [ngClass]="{
                    'border-primary-500 text-primary-600': activeTab === 'ubicacion',
                    'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'ubicacion'
                  }"
                >
                  Ubicación
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
              <!-- Tab: Información General -->
              @if (activeTab === 'informacion-general') {
                <div class="space-y-6">
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
                    
                    <!-- Frase -->
                    <div class="sm:col-span-6">
                      <label for="frase" class="block text-sm font-medium text-gray-700">Frase característica</label>
                      <div class="mt-1">
                        <input 
                          type="text" 
                          id="frase" 
                          formControlName="frase" 
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <p class="mt-2 text-sm text-gray-500">Una frase representativa o eslogan de la municipalidad</p>
                    </div>
                    
                    <!-- Comunidades -->
                    <div class="sm:col-span-6">
                      <label for="comunidades" class="block text-sm font-medium text-gray-700">Comunidades</label>
                      <div class="mt-1">
                        <textarea 
                          id="comunidades" 
                          formControlName="comunidades"
                          rows="3" 
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              }
              
              <!-- Tab: Información de Contacto -->
              @if (activeTab === 'contacto') {
                <div class="space-y-6">
                  <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <!-- Correo Electrónico -->
                    <div class="sm:col-span-3">
                      <label for="correo" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                      <div class="mt-1">
                        <input 
                          type="email" 
                          id="correo" 
                          formControlName="correo" 
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <!-- Horario de Atención -->
                    <div class="sm:col-span-3">
                      <label for="horariodeatencion" class="block text-sm font-medium text-gray-700">Horario de Atención</label>
                      <div class="mt-1">
                        <input 
                          type="text" 
                          id="horariodeatencion" 
                          formControlName="horariodeatencion" 
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <!-- Redes Sociales -->
                    <div class="sm:col-span-6">
                      <h3 class="text-sm font-medium text-gray-700">Redes Sociales</h3>
                      
                      <!-- Facebook -->
                      <div class="mt-2">
                        <label for="red_facebook" class="block text-sm font-medium text-gray-700">Facebook</label>
                        <div class="mt-1 flex rounded-md shadow-sm">
                          <span class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/>
                            </svg>
                          </span>
                          <input 
                            type="text" 
                            id="red_facebook" 
                            formControlName="red_facebook" 
                            class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="https://facebook.com/municipalidad"
                          />
                        </div>
                      </div>
                      
                      <!-- Instagram -->
                      <div class="mt-2">
                        <label for="red_instagram" class="block text-sm font-medium text-gray-700">Instagram</label>
                        <div class="mt-1 flex rounded-md shadow-sm">
                          <span class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-pink-500 sm:text-sm">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                            </svg>
                          </span>
                          <input 
                            type="text" 
                            id="red_instagram" 
                            formControlName="red_instagram" 
                            class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="https://instagram.com/municipalidad"
                          />
                        </div>
                      </div>
                      
                      <!-- YouTube -->
                      <div class="mt-2">
                        <label for="red_youtube" class="block text-sm font-medium text-gray-700">YouTube</label>
                        <div class="mt-1 flex rounded-md shadow-sm">
                          <span class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-red-500 sm:text-sm">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                            </svg>
                          </span>
                          <input 
                            type="text" 
                            id="red_youtube" 
                            formControlName="red_youtube" 
                            class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="https://youtube.com/channel/municipalidad"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              
              <!-- Tab: Información Institucional -->
              @if (activeTab === 'info-institucional') {
                <div class="space-y-6">
                  <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <!-- Misión -->
                    <div class="sm:col-span-6">
                      <label for="mision" class="block text-sm font-medium text-gray-700">Misión</label>
                      <div class="mt-1">
                        <textarea 
                          id="mision" 
                          formControlName="mision"
                          rows="3" 
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
                    
                    <!-- Visión -->
                    <div class="sm:col-span-6">
                      <label for="vision" class="block text-sm font-medium text-gray-700">Visión</label>
                      <div class="mt-1">
                        <textarea 
                          id="vision" 
                          formControlName="vision"
                          rows="3" 
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
                    
                    <!-- Valores -->
                    <div class="sm:col-span-6">
                      <label for="valores" class="block text-sm font-medium text-gray-700">Valores</label>
                      <div class="mt-1">
                        <textarea 
                          id="valores" 
                          formControlName="valores"
                          rows="3" 
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
                    
                    <!-- Comité -->
                    <div class="sm:col-span-6">
                      <label for="comite" class="block text-sm font-medium text-gray-700">Comité</label>
                      <div class="mt-1">
                        <textarea 
                          id="comite" 
                          formControlName="comite"
                          rows="3" 
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
                    
                    <!-- Ordenanza Municipal -->
                    <div class="sm:col-span-6">
                      <label for="ordenanzamunicipal" class="block text-sm font-medium text-gray-700">Ordenanza Municipal</label>
                      <div class="mt-1">
                        <textarea 
                          id="ordenanzamunicipal" 
                          formControlName="ordenanzamunicipal"
                          rows="3" 
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
                    
                    <!-- Alianzas -->
                    <div class="sm:col-span-6">
                      <label for="alianzas" class="block text-sm font-medium text-gray-700">Alianzas</label>
                      <div class="mt-1">
                        <textarea 
                          id="alianzas" 
                          formControlName="alianzas"
                          rows="3" 
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              }
              
              <!-- Tab: Ubicación -->
              @if (activeTab === 'ubicacion') {
                <div class="space-y-6">
                  <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <!-- Coordenada X -->
                    <div class="sm:col-span-3">
                      <label for="coordenadas_x" class="block text-sm font-medium text-gray-700">Latitud</label>
                      <div class="mt-1">
                        <input 
                          type="number" 
                          step="0.0000001"
                          id="coordenadas_x" 
                          formControlName="coordenadas_x" 
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <!-- Coordenada Y -->
                    <div class="sm:col-span-3">
                      <label for="coordenadas_y" class="block text-sm font-medium text-gray-700">Longitud</label>
                      <div class="mt-1">
                        <input 
                          type="number"
                          step="0.0000001" 
                          id="coordenadas_y" 
                          formControlName="coordenadas_y" 
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <!-- Historia de Capachica -->
                    <div class="sm:col-span-6">
                      <label for="historiacapachica" class="block text-sm font-medium text-gray-700">Historia de Capachica</label>
                      <div class="mt-1">
                        <textarea 
                          id="historiacapachica" 
                          formControlName="historiacapachica"
                          rows="4" 
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
                    
                    <!-- Historia de Familias -->
                    <div class="sm:col-span-6">
                      <label for="historiafamilias" class="block text-sm font-medium text-gray-700">Historia de Familias</label>
                      <div class="mt-1">
                        <textarea 
                          id="historiafamilias" 
                          formControlName="historiafamilias"
                          rows="4" 
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        ></textarea>
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
                    title="Imágenes Secundarias (con descripción)"
                    [slidersFormArray]="slidersSecundariosArray"
                    [existingSliders]="slidersSecundarios"
                    [isSliderPrincipal]="false"
                    (changeSlidersEvent)="onSlidersSecundariosChange($event)"
                    (deletedSlidersEvent)="onDeletedSlidersSecundariosChange($event)"
                  ></app-slider-upload>
                </div>
              }
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
                routerLink="/admin/municipalidad"
                class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              
              <button 
                type="submit" 
                class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                [disabled]="saving || municipalidadForm.invalid"
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
export class MunicipalidadFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private turismoService = inject(TurismoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  municipalidadForm!: FormGroup;
  municipalidadId: number | null = null;
  deletedSlidersPrincipales: number[] = [];
  deletedSlidersSecundarios: number[] = [];
  // Sliders
  slidersPrincipales: SliderImage[] = [];
  slidersSecundarios: SliderImage[] = [];
  
  loading = true;
  saving = false;
  submitted = false;
  error = '';
  
  activeTab = 'informacion-general';
  
  get slidersPrincipalesArray(): FormArray {
    return this.municipalidadForm.get('sliders_principales') as FormArray;
  }
  
  get slidersSecundariosArray(): FormArray {
    return this.municipalidadForm.get('sliders_secundarios') as FormArray;
  }
  
  get isEditMode(): boolean {
    return this.municipalidadId !== null;
  }
  
  ngOnInit() {
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.municipalidadId = +id;
      this.loadMunicipalidad(this.municipalidadId);
    } else {
      this.loading = false;
    }
  }
  
  initForm() {
    this.municipalidadForm = this.fb.group({
      // Información General
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      frase: [''],
      comunidades: [''],
      
      // Contacto
      correo: [''],
      horariodeatencion: [''],
      red_facebook: [''],
      red_instagram: [''],
      red_youtube: [''],
      
      // Información Institucional
      mision: [''],
      vision: [''],
      valores: [''],
      comite: [''],
      ordenanzamunicipal: [''],
      alianzas: [''],
      
      // Ubicación
      coordenadas_x: [''],
      coordenadas_y: [''],
      historiafamilias: [''],
      historiacapachica: [''],
      
      // Sliders - Usamos FormArray para manejar conjuntos de datos
      sliders_principales: this.fb.array([]),
      sliders_secundarios: this.fb.array([])
    });
  }
  
  loadMunicipalidad(id: number) {
    this.loading = true;
    this.turismoService.getMunicipalidad(id).subscribe({
      next: (municipalidad) => {
        console.log('Municipalidad cargada:', municipalidad); // Depuración
        
        // Llenar el formulario con datos básicos
        this.municipalidadForm.patchValue({
          nombre: municipalidad.nombre,
          descripcion: municipalidad.descripcion,
          frase: municipalidad.frase || '',
          comunidades: municipalidad.comunidades || '',
          correo: municipalidad.correo || '',
          horariodeatencion: municipalidad.horariodeatencion || '',
          red_facebook: municipalidad.red_facebook || '',
          red_instagram: municipalidad.red_instagram || '',
          red_youtube: municipalidad.red_youtube || '',
          mision: municipalidad.mision || '',
          vision: municipalidad.vision || '',
          valores: municipalidad.valores || '',
          comite: municipalidad.comite || '',
          ordenanzamunicipal: municipalidad.ordenanzamunicipal || '',
          alianzas: municipalidad.alianzas || '',
          coordenadas_x: municipalidad.coordenadas_x || '',
          coordenadas_y: municipalidad.coordenadas_y || '',
          historiafamilias: municipalidad.historiafamilias || '',
          historiacapachica: municipalidad.historiacapachica || ''
        });
        
        // Limpiar los arrays de sliders existentes
        this.slidersPrincipales = [];
        this.slidersSecundarios = [];
        
        // Manejar sliders principales
        if (municipalidad.sliders_principales && municipalidad.sliders_principales.length > 0) {
          console.log('Sliders principales encontrados:', municipalidad.sliders_principales.length);
          this.slidersPrincipales = municipalidad.sliders_principales.map(slider => ({
            id: slider.id,
            nombre: slider.nombre,
            es_principal: true, // Garantizar que es principal
            orden: slider.orden || 1,
            imagen: slider.url_completa || '',
            url_completa: slider.url_completa
          }));
        }
        
        // Manejar sliders secundarios - Corregido para manejar la estructura anidada
        if (municipalidad.sliders_secundarios && municipalidad.sliders_secundarios.length > 0) {
          console.log('Sliders secundarios encontrados:', municipalidad.sliders_secundarios.length);
          this.slidersSecundarios = municipalidad.sliders_secundarios.map(slider => {
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
        console.error('Error al cargar municipalidad:', error);
        this.error = 'Error al cargar los datos de la municipalidad.';
        this.loading = false;
      }
    });
  }
  
  onDeletedSlidersPrincipalesChange(deletedIds: number[]) {
    this.deletedSlidersPrincipales = deletedIds;
    console.log('Sliders principales eliminados:', deletedIds);
  }
  
  onDeletedSlidersSecundariosChange(deletedIds: number[]) {
    this.deletedSlidersSecundarios = deletedIds;
    console.log('Sliders secundarios eliminados:', deletedIds);
  }
  
  // Eventos de slider
  onSlidersPrincipalesChange(sliders: SliderImage[]) {
    console.log('Cambio en sliders principales:', sliders);
    // Los sliders ya vienen marcados como principales del componente
    this.slidersPrincipales = sliders;
  }
  
  onSlidersSecundariosChange(sliders: SliderImage[]) {
    console.log('Cambio en sliders secundarios:', sliders);
    // Los sliders ya vienen marcados como secundarios del componente
    this.slidersSecundarios = sliders;
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.municipalidadForm.get(fieldName);
    return (field?.invalid && (field?.dirty || field?.touched || this.submitted)) || false;
  }
  
  onSubmit() {
    this.submitted = true;
    this.error = '';
    
    if (this.municipalidadForm.invalid) {
      // Determinar la pestaña con errores y cambiar a ella
      if (this.isFieldInvalid('nombre') || this.isFieldInvalid('descripcion')) {
        this.activeTab = 'informacion-general';
      }
      
      return;
    }
    
    const formData = this.municipalidadForm.value;
    
    // Añadir sliders principales
    formData.sliders_principales = this.slidersPrincipales.map(slider => {
      const newSlider = {...slider};
      
      // Solo incluir 'imagen' si es un objeto File
      if (!(newSlider.imagen instanceof File)) {
        delete newSlider.imagen; // Eliminar si es una URL (string)
      }
      
      return {
        ...newSlider,
        es_principal: true // Siempre es principal
      };
    });
    
    // Añadir sliders secundarios con título y descripción
    formData.sliders_secundarios = this.slidersSecundarios.map(slider => {
      const newSlider = {...slider};
      
      // Solo incluir 'imagen' si es un objeto File
      if (!(newSlider.imagen instanceof File)) {
        delete newSlider.imagen; // Eliminar si es una URL (string)
      }
      
      // Asegurar que titulo y descripcion siempre estén definidos
      return {
        ...newSlider,
        es_principal: false, // Siempre es secundario
        titulo: newSlider.titulo || '',
        descripcion: newSlider.descripcion || ''
      };
    });
    
    // Añadir los IDs de sliders eliminados
    formData.deleted_sliders = [
      ...this.deletedSlidersPrincipales,
      ...this.deletedSlidersSecundarios
    ];
    
    console.log('Datos a enviar:', formData);
    
    this.saving = true;
    
    if (this.isEditMode && this.municipalidadId) {
      // Actualizar municipalidad existente
      this.turismoService.updateMunicipalidad(this.municipalidadId, formData).subscribe({
        next: () => {
          this.saving = false;
          alert('Municipalidad actualizada correctamente');
          this.router.navigate(['/admin/municipalidad']);
        },
        error: (error) => {
          console.error('Error al actualizar municipalidad:', error);
          this.error = error.error?.message || 'Error al actualizar la municipalidad. Por favor, intente nuevamente.';
          this.saving = false;
        }
      });
    } else {
      // Crear nueva municipalidad
      this.turismoService.createMunicipalidad(formData).subscribe({
        next: () => {
          this.saving = false;
          alert('Municipalidad creada correctamente');
          this.router.navigate(['/admin/municipalidad']);
        },
        error: (error) => {
          console.error('Error al crear municipalidad:', error);
          this.error = error.error?.message || 'Error al crear la municipalidad. Por favor, intente nuevamente.';
          this.saving = false;
        }
      });
    }
  }
}