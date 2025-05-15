import { Component, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { EventoService } from '../evento.service'; 

import { SliderImage, SliderUploadComponent } from '../../../../../shared/components/slider-upload/slider-upload.component';

declare var google: any;


@Component({
  selector: 'app-evento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SliderUploadComponent],
  template: `
     <div #mapElement id="map" class="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
      <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header con imagen de fondo mejorada -->
        <div class="relative h-56 overflow-hidden bg-gradient-to-r from-emerald-500 to-indigo-600">
          <div class="absolute inset-0 bg-black opacity-20"></div>
          <div class="absolute inset-0 bg-pattern opacity-10"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <h1 class="text-4xl font-bold text-white drop-shadow-xl tracking-tight">
              {{ isEditMode ? 'Editar Evento' : 'Crear Nuevo Evento' }}
            </h1>
          </div>
          <div class="absolute bottom-6 left-6">
            <a 
              routerLink="/admin/evento" 
              class="group inline-flex items-center gap-2 rounded-lg bg-white/20 backdrop-blur-md px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              <svg class="h-5 w-5 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver al listado
            </a>
          </div>
        </div>

        <!-- Contenido principal -->
        <div class="px-6 py-8">
          <form *ngIf="eventoForm" [formGroup]="eventoForm" (ngSubmit)="onSubmit()" class="space-y-8">
            <!-- Pestañas de navegación mejoradas -->
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-4">
                <button 
                  type="button"
                  [class]="activeTab === 'informacion-general' ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                  class="group flex items-center py-4 px-3 text-center text-sm transition-all duration-200"
                  (click)="activeTab = 'informacion-general'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Información General
                </button>
                <button 
                  type="button"
                  [class]="activeTab === 'imagenes' ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                  class="group flex items-center py-4 px-3 text-center text-sm transition-all duration-200"
                  (click)="activeTab = 'imagenes'"
                >
                  Imágenes
                </button>
                <button 
                  type="button"
                  [class]="activeTab === 'ubicacion' ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                  class="group flex items-center py-4 px-3 text-center text-sm transition-all duration-200"
                  (click)="activeTab = 'ubicacion'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ubicación
                </button>
                <button 
                  type="button"
                  [class]="activeTab === 'detalles' ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                  class="group flex items-center py-4 px-3 text-center text-sm transition-all duration-200"
                  (click)="activeTab = 'detalles'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Detalles adicionales
                </button>
              </nav>
            </div>

            <!-- Contenido de pestañas -->
            <div [ngSwitch]="activeTab" class="mt-8">
              <!-- Pestaña Información General -->
              <div *ngSwitchCase="'informacion-general'" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <!-- Nombre del Evento -->
                  <div class="col-span-1 md:col-span-2">
                    <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre del evento <span class="text-red-500">*</span></label>
                    <div class="relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input 
                        type="text" 
                        id="nombre" 
                        formControlName="nombre" 
                        class="pl-10 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('nombre')}"
                        placeholder="Ej: Workshop de Innovación Digital"
                      />
                    </div>
                    <p *ngIf="isFieldInvalid('nombre')" class="mt-2 text-sm text-red-600">El nombre del evento es obligatorio</p>
                  </div>

                  <!-- Descripción -->
                  <div class="col-span-1 md:col-span-2">
                    <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-1">Descripción <span class="text-red-500">*</span></label>
                    <div>
                      <textarea 
                        id="descripcion" 
                        formControlName="descripcion" 
                        rows="4"
                        class="block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('descripcion')}"
                        placeholder="Describa los objetivos y detalles del evento..."
                      ></textarea>
                      <p *ngIf="isFieldInvalid('descripcion')" class="mt-2 text-sm text-red-600">La descripción del evento es obligatoria</p>
                    </div>
                  </div>

                  

                  <!-- Tipo de Evento e Idioma -->
                  <div class="space-y-6">
                    <div>
                      <label for="tipo_evento" class="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento <span class="text-red-500">*</span></label>
                      <div class="relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <select 
                          id="tipo_evento" 
                          formControlName="tipo_evento" 
                          class="pl-10 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('tipo_evento')}"
                        >
                          <option value="" disabled selected>Seleccione un tipo</option>
                          <option value="conferencia">Conferencia</option>
                          <option value="taller">Taller</option>
                          <option value="networking">Networking</option>
                          <option value="exposicion">Exposición</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                      <p *ngIf="isFieldInvalid('tipo_evento')" class="mt-2 text-sm text-red-600">Debe especificar el tipo de evento</p>
                    </div>

                    <div>
                      <label for="idioma_principal" class="block text-sm font-medium text-gray-700 mb-1">Idioma Principal <span class="text-red-500">*</span></label>
                      <div class="relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                        </div>
                        <select 
                          id="idioma_principal" 
                          formControlName="idioma_principal" 
                          class="pl-10 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('idioma_principal')}"
                        >
                          <option value="" disabled selected>Seleccione un idioma</option>
                          <option value="es">Español</option>
                          <option value="ay">Aymara</option>
                          <option value="fr">Francés</option>
                          <option value="pt">Portugués</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                      <p *ngIf="isFieldInvalid('idioma_principal')" class="mt-2 text-sm text-red-600">Debe indicar el idioma principal del evento</p>
                    </div>
                  </div>

                  <!-- Emprendedor Asociado -->
                  <div class="space-y-6">
                    <div>
                      <label for="id_emprendedor" class="block text-sm font-medium text-gray-700 mb-1">Emprendedor Asociado <span class="text-red-500">*</span></label>
                      <div class="relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <select 
                          id="id_emprendedor" 
                          formControlName="id_emprendedor" 
                          class="pl-10 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('id_emprendedor')}"
                        >
                          <option value="" disabled selected>Seleccione un emprendedor</option>
                          <option value="1">Emprendedor 1</option>
                          <option value="2">Emprendedor 2</option>
                          <option value="3">Emprendedor 3</option>
                          <!-- Aquí irían opciones cargadas dinámicamente desde el backend -->
                        </select>
                      </div>
                      <p *ngIf="isFieldInvalid('id_emprendedor')" class="mt-2 text-sm text-red-600">Debe seleccionar un emprendedor</p>
                    </div>
                  </div>

                  <!-- URL de la imagen -->
                  <div class="col-span-1 md:col-span-2">
                    <label for="imagen_url" class="block text-sm font-medium text-gray-700 mb-1">URL de la imagen <span class="text-red-500">*</span></label>
                    <div class="flex items-center space-x-2">
                      <div class="relative flex-grow rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input 
                          type="url" 
                          id="imagen_url" 
                          formControlName="imagen_url" 
                          class="pl-10 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                          [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('imagen_url')}"
                          placeholder="https://ejemplo.com/imagen.jpg"
                        />
                      </div>
                      <button 
                        type="button" 
                        class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Explorar
                      </button>
                    </div>
                    <p *ngIf="isFieldInvalid('imagen_url')" class="mt-2 text-sm text-red-600">Debe proporcionar una URL válida para la imagen</p>
                    <div class="mt-3 p-2 border border-gray-300 border-dashed rounded-md bg-gray-50 flex items-center justify-center h-24">
                      <p class="text-sm text-gray-500">Vista previa de la imagen</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pestaña Imágenes (Sliders) -->
              <div *ngSwitchCase="'imagenes'" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="col-span-1 md:col-span-2">
                    <!-- Condición para mostrar los sliders solo cuando la pestaña 'imagenes' esté activa -->
                    <div *ngIf="activeTab === 'imagenes'">
                      <!-- Sliders Principales -->
                      <app-slider-upload
                        title="Imágenes Principales"
                        [slidersFormArray]="slidersPrincipalesArray"
                        [existingSliders]="slidersPrincipalesList"
                        [isSliderPrincipal]="true"
                        (changeSlidersEvent)="onSlidersPrincipalesChange($event)"
                        (deletedSlidersEvent)="onDeletedSlidersPrincipalesChange($event)"
                      ></app-slider-upload>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pestaña Ubicación -->
            <div *ngSwitchCase="'ubicacion'" class="space-y-8">
              <!-- Mapa de referencia mejorado en Tailwind -->
    <div class="relative bg-gray-50 rounded-lg overflow-hidden shadow-inner border border-gray-200">
      <div class="h-80"> <!-- Tailwind ya define la altura -->
        <div class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p class="mt-2 text-gray-600 font-medium">Mapa de referencia</p>
          <p class="text-sm text-gray-500 mt-1">Utilice las coordenadas para indicar la ubicación exact</p>
        </div>
      </div>
    </div>
              
              <!-- Coordenadas -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="coordenada_x" class="block text-sm font-medium text-gray-700 mb-1">Latitud <span class="text-red-500">*</span></label>
                  <input type="number" id="coordenada_x" formControlName="coordenada_x" class="block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ej. 40.7128" step="0.000001" />
                </div>

                <div>
                  <label for="coordenada_y" class="block text-sm font-medium text-gray-700 mb-1">Longitud <span class="text-red-500">*</span></label>
                  <input type="number" id="coordenada_y" formControlName="coordenada_y" class="block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ej. -74.0060" step="0.000001" />
                </div>
              </div>
            </div>


              <!-- Pestaña Detalles adicionales -->
              <div *ngSwitchCase="'detalles'" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Calendario de eventos -->
                  <div class="col-span-1 md:col-span-2 bg-gray-50 rounded-lg p-4 border border-gray-200 mb-2">
                    <div class="flex items-center justify-between mb-2">
                      <h3 class="text-sm font-medium text-gray-700">Calendario de eventos</h3>
                      <div class="flex space-x-1">
                        <button type="button" class="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button type="button" class="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="grid grid-cols-7 gap-2 text-center text-xs">
                      <div class="text-gray-500 font-medium">Lu</div>
                      <div class="text-gray-500 font-medium">Ma</div>
                      <div class="text-gray-500 font-medium">Mi</div>
                      <div class="text-gray-500 font-medium">Ju</div>
                      <div class="text-gray-500 font-medium">Vi</div>
                      <div class="text-gray-500 font-medium">Sa</div>
                      <div class="text-gray-500 font-medium">Do</div>
                      
                      <!-- Días ejemplo -->
                      <div class="py-1 text-gray-400">30</div>
                      <div class="py-1 text-gray-400">31</div>
                      <div class="py-1">1</div>
                      <div class="py-1">2</div>
                      <div class="py-1">3</div>
                      <div class="py-1">4</div>
                      <div class="py-1">5</div>
                      
                      <div class="py-1">6</div>
                      <div class="py-1">7</div>
                      <div class="py-1">8</div>
                      <div class="py-1 bg-indigo-100 rounded-md ring-1 ring-indigo-600">9</div>
                      <div class="py-1 bg-indigo-600 text-white rounded-md">10</div>
                      <div class="py-1">11</div>
                      <div class="py-1">12</div>
                      <div class="py-1">13</div>
                      
                      <div class="py-1">14</div>
                      <div class="py-1">15</div>
                      <div class="py-1">16</div>
                      <div class="py-1">17</div>
                      <div class="py-1">18</div>
                      <div class="py-1">19</div>
                      <div class="py-1">20</div>
                    </div>
                  </div>
                
                  <!-- Fechas y horas -->
                  <div>
                    <div class="space-y-6">
                      <!-- Fecha de Inicio -->
                      <div>
                        <label for="fecha_inicio" class="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio <span class="text-red-500">*</span></label>
                        <div class="relative rounded-md shadow-sm">
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <input 
                            type="date" 
                            id="fecha_inicio" 
                            formControlName="fecha_inicio" 
                            class="pl-10 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('fecha_inicio')}"
                          />
                        </div>
                        <p *ngIf="isFieldInvalid('fecha_inicio')" class="mt-2 text-sm text-red-600">Debe indicar la fecha de inicio</p>
                      </div>

                      <!-- Hora de Inicio -->
                      <div>
                        <label for="hora_inicio" class="block text-sm font-medium text-gray-700 mb-1">Hora de Inicio <span class="text-red-500">*</span></label>
                        <div class="relative rounded-md shadow-sm">
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <input 
                            type="time" 
                            id="hora_inicio" 
                            formControlName="hora_inicio" 
                            class="pl-10 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('hora_inicio')}"
                            step="1"  
                          />
                        </div>
                        <p *ngIf="isFieldInvalid('hora_inicio')" class="mt-2 text-sm text-red-600">La hora de inicio es obligatoria</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div class="space-y-6">
                      <!-- Fecha de Fin -->
                      <div>
                        <label for="fecha_fin" class="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin <span class="text-red-500">*</span></label>
                        <div class="relative rounded-md shadow-sm">
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <input 
                            type="date" 
                            id="fecha_fin" 
                            formControlName="fecha_fin" 
                            class="pl-10 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('fecha_fin')}"
                          />
                        </div>
                        <p *ngIf="isFieldInvalid('fecha_fin')" class="mt-2 text-sm text-red-600">La fecha de fin debe ser igual o posterior a la fecha de inicio</p>
                      </div>

                      <!-- Hora de Fin -->
                      <div>
                        <label for="hora_fin" class="block text-sm font-medium text-gray-700 mb-1">Hora de Fin <span class="text-red-500">*</span></label>
                        <div class="relative rounded-md shadow-sm">
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <input 
                            type="time" 
                            id="hora_fin" 
                            formControlName="hora_fin" 
                            class="pl-10 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('hora_fin')}"
                            step="1" 
                          />
                        </div>
                        <p *ngIf="isFieldInvalid('hora_fin')" class="mt-2 text-sm text-red-600">La hora de fin debe ser posterior a la hora de inicio</p>
                      </div>
                    </div>
                  </div>

                  <!-- Duración -->
                  <div>
                    <label for="duracion_horas" class="block text-sm font-medium text-gray-700 mb-1">Duración (Horas) <span class="text-red-500">*</span></label>
                    <div class="relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input 
                        type="number" 
                        id="duracion_horas" 
                        formControlName="duracion_horas" 
                        class="pl-10 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('duracion_horas')}"
                        min="0"
                        step="0.5"
                        placeholder="Ej. 2.5"
                      />
                    </div>
                    <p *ngIf="isFieldInvalid('duracion_horas')" class="mt-2 text-sm text-red-600">La duración debe ser un número válido</p>
                    
                  
                    
                  </div>

                  <!-- Información adicional -->
                  <div class="col-span-1 md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">¿Qué llevar?</label>
                    <div class="mt-1">
                      <div class="relative">
                        <textarea 
                          id="que_llevar" 
                          formControlName="que_llevar" 
                          rows="4"
                          class="block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                          placeholder="Indique lo que los asistentes deben llevar al evento..."
                        ></textarea>
                        <div class="absolute right-2 bottom-2">
                          <button type="button" class="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a2.5 2.5 0 015 0v6a2.5 2.5 0 01-5 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.75 5.25a3 3 0 013 3m-3-3a3 3 0 00-3 3m3-3v1.5m0 9v1.5m0-12.75a3 3 0 00-3 3m3-3a3 3 0 013 3m-9.75 9a3 3 0 013-3m-3 3a3 3 0 00-3-3m3 3v1.5m0-9V9" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Barra de navegación inferior y botones mejorados -->
            <div class="pt-8 border-t border-gray-200">
              
              <!-- Indicador de avance -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <div class="flex space-x-2">
                  <!-- Botón 1 -->
                  <button 
                    type="button" 
                    [class]="activeTab === 'informacion-general' || activeTab === 'imagenes' || activeTab === 'ubicacion' || activeTab === 'detalles' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'"
                    class="h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-200"
                    (click)="activeTab = 'informacion-general'"
                  >1</button>
                  <!-- Línea 1-2 -->
                  <div class="w-10 h-1" [class.bg-indigo-600]="activeTab === 'informacion-general' || activeTab === 'imagenes' || activeTab === 'ubicacion' || activeTab === 'detalles'" [class.bg-gray-200]="activeTab !== 'informacion-general'"></div>

                  <!-- Botón 2 -->
                  <button 
                    type="button" 
                    [class]="activeTab === 'imagenes' || activeTab === 'ubicacion' || activeTab === 'detalles' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'"
                    class="h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-200"
                    (click)="activeTab = 'imagenes'"
                  >2</button>
                  <!-- Línea 2-3 -->
                  <div class="w-10 h-1" [class.bg-indigo-600]="activeTab === 'imagenes' || activeTab === 'ubicacion' || activeTab === 'detalles'" [class.bg-gray-200]="activeTab !== 'imagenes'"></div>

                  <!-- Botón 3 -->
                  <button 
                    type="button" 
                    [class]="activeTab === 'ubicacion' || activeTab === 'detalles' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'"
                    class="h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-200"
                    (click)="activeTab = 'ubicacion'"
                  >3</button>
                  <!-- Línea 3-4 -->
                  <div class="w-10 h-1" [class.bg-indigo-600]="activeTab === 'ubicacion' || activeTab === 'detalles'" [class.bg-gray-200]="activeTab !== 'ubicacion'"></div>

                  <!-- Botón 4 -->
                  <button 
                    type="button" 
                    [class]="activeTab === 'detalles' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'"
                    class="h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-200"
                    (click)="activeTab = 'detalles'"
                  >4</button>
                </div>
                <span class="ml-4 text-sm text-gray-500">* Campos obligatorios</span>
              </div>
              
              <!-- Indicador de guardado automático -->
              <div class="text-sm text-gray-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Guardado automático
              </div>
            </div>


              
              <!-- Botones de acción -->
              <div class="flex justify-between">
                <div>
                  <button 
                    type="button"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    
                  </button>
                </div>
                
                <div class="flex space-x-3">
                  <button 
                    type="button"
                    routerLink="/admin/evento"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Cancelar
                  </button>
                  
                  <button 
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                    [disabled]="saving"
                    (click)="onSave()"
                  >
                    <svg *ngIf="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg *ngIf="!saving" xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ saving ? 'Guardando...' : (isEditMode ? 'Actualizar evento' : 'Crear evento') }}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
</div>
  `
})
export class EventoFormComponent implements OnInit, AfterViewInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;

  map: any;
  marker: any;


  deletedSlidersPrincipales: number[] = [];
  
  slidersPrincipalesList: SliderImage[] = [];


onDeletedSlidersPrincipalesChange(deletedIds: number[]) {
    this.deletedSlidersPrincipales = deletedIds;
    console.log('Sliders principales eliminados:', deletedIds);
  }

onSlidersPrincipalesChange(sliders: SliderImage[]) {
  console.log('Cambio en sliders principales:', sliders);
    
    // Ensure all sliders have required fields
    this.slidersPrincipalesList = sliders.map(slider => ({
      ...slider,
      es_principal: true,
      nombre: slider.nombre || '',
      orden: slider.orden || this.slidersPrincipales.length + 1
    }));
    
    console.log('Updated sliders principales:', this.slidersPrincipales);
}



  eventoForm!: FormGroup;
  isEditMode: boolean = false;
  eventoId!: string;  // ID del evento a editar
  submitted: boolean = false;
  
  error: string = '';
  saving: boolean = false;
  activeTab: string = 'informacion-general';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService
  ) { }

  get slidersPrincipalesArray(): FormArray {
    return this.eventoForm.get('sliders_principales') as FormArray;
  }

  ngOnInit(): void {
    console.log('Iniciando formulario...');

    this.eventoForm = this.fb.group({
      coordenada_x: [''],
      coordenada_y: ['']
    });

    this.route.params.subscribe(params => {
      this.eventoId = params['id'];  // Obtenemos el ID del evento desde la URL
      this.isEditMode = !!this.eventoId;  // Si existe el ID, estamos en modo de edición
    });
    
    // Creamos los validadores personalizados como funciones independientes
    const fechaFinValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }
      
      const fechaInicio = control.parent.get('fecha_inicio')?.value;
      // Si no hay fecha de inicio o no hay valor en fecha_fin, no validamos
      if (!fechaInicio || !control.value) {
        return null;
      }

      // Verificar que la fecha de fin sea posterior o igual a la fecha de inicio
      return control.value < fechaInicio ? { 'fecha_fin_invalid': true } : null;
    };

    const horaFinValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }
      
      const horaInicio = control.parent.get('hora_inicio')?.value;
      // Si no hay hora de inicio o no hay valor en hora_fin, no validamos
      if (!horaInicio || !control.value) {
        return null;
      }

      // Verificar que la hora de fin sea posterior a la hora de inicio
      return control.value <= horaInicio ? { 'hora_fin_invalid': true } : null;
    };

    this.eventoForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo_evento: ['', Validators.required],
      descripcion: ['', Validators.required],
      idioma_principal: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', [Validators.required, fechaFinValidator]],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', [Validators.required, horaFinValidator]],
      duracion_horas: ['', [Validators.required, Validators.pattern('^[0-9]*(\.[0-9]+)?$')]],
      coordenada_x: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      coordenada_y: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      imagen_url: ['', Validators.required],
      que_llevar: [''],
      id_emprendedor: ['', Validators.required],

      // Sliders
      sliders_principales: this.fb.array([]),
    });

    this.addSliderPrincipal();


    if (this.isEditMode) {
      this.cargarEvento(this.eventoId);
    }

    console.log('Formulario inicializado:', this.eventoForm);
  }


  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    const mapOptions = {
      center: new google.maps.LatLng(-15.6417, -69.8306), // Ubicación por defecto de Capachica
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // Crear un marcador
    this.marker = new google.maps.Marker({
      position: mapOptions.center,
      map: this.map,
      draggable: true
    });

    


    
    
  }

  updateCoordinates(lat: number, lng: number): void {
    // Actualizar los campos de latitud y longitud en el formulario
    this.eventoForm.patchValue({
      coordenada_x: lat,
      coordenada_y: lng
    });
  }


  cargarEvento(id: string): void {
  console.log('Cargando evento con ID:', id);
  this.eventoService.getEventoById(id).subscribe({
    next: (response) => {
      console.log('Datos del evento recibidos:', response);
      
      // Extraemos los datos del evento (puede variar según la estructura de tu API)
      const evento = response.data || response;
      
      
      // Formateamos las fechas para que funcionen en el input type="date"
      let fechaInicio = evento.fecha_inicio;
      let fechaFin = evento.fecha_fin;
      
      // Si las fechas vienen en formato timestamp o string, las convertimos a YYYY-MM-DD
      if (fechaInicio && typeof fechaInicio === 'string' && !fechaInicio.match(/^\d{4}-\d{2}-\d{2}$/)) {
        fechaInicio = new Date(fechaInicio).toISOString().split('T')[0];
      }
      
      if (fechaFin && typeof fechaFin === 'string' && !fechaFin.match(/^\d{4}-\d{2}-\d{2}$/)) {
        fechaFin = new Date(fechaFin).toISOString().split('T')[0];
      }
      
      // Actualizamos el formulario con los datos recibidos
      this.eventoForm.patchValue({
        nombre: evento.nombre,
        tipo_evento: evento.tipo_evento,
        descripcion: evento.descripcion,
        idioma_principal: evento.idioma_principal,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        hora_inicio: evento.hora_inicio,
        hora_fin: evento.hora_fin,
        duracion_horas: evento.duracion_horas,
        coordenada_x: evento.coordenada_x,
        coordenada_y: evento.coordenada_y,
        imagen_url: evento.imagen_url,
        que_llevar: evento.que_llevar,
        id_emprendedor: evento.id_emprendedor,

        sliders_principales: this.fb.array([]),
      });
      
      console.log('Formulario actualizado con datos del evento');
    },
    error: (err) => {
      console.error('Error al cargar el evento:', err);
      alert('No se pudo cargar la información del evento. Por favor, intente nuevamente.');
    }
  });
}

  isFieldInvalid(field: string): boolean {
    const control = this.eventoForm?.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSave(): void {
  this.submitted = true;
  this.error = '';

  if (this.eventoForm.invalid) {
    console.log('Formulario inválido: faltan los siguientes campos obligatorios:');
    let missingFields = '';
    for (const controlName in this.eventoForm.controls) {
      if (this.eventoForm.controls[controlName].invalid) {
        const errorMessage = this.getErrorMessage(controlName);
        console.log(`- ${controlName}: ${errorMessage}`);
        missingFields += `- ${controlName}: ${errorMessage}\n`;
      }
    }
    if (missingFields) {
      alert('Faltan los siguientes campos o tienen errores:\n' + missingFields);
    }
    return;
  }

  const formData = this.eventoForm.value;
  console.log('Datos a enviar:', formData);
  this.saving = true;

  if (this.isEditMode) {
    console.log('Actualizando evento con ID:', this.eventoId);
    this.eventoService.updateEvento(this.eventoId, formData).subscribe({
      next: (response) => {
        console.log('Evento actualizado exitosamente', response);
        this.saving = false;
        alert('Evento actualizado correctamente');
        this.router.navigate(['/admin/evento']);
      },
      error: (err) => {
        console.error('Error al actualizar evento', err);
        this.saving = false;
        alert('Hubo un problema al actualizar el evento, intenta nuevamente');
      }
    });
  } else {
    console.log('Creando nuevo evento');
    this.eventoService.createEvento(formData).subscribe({
      next: (response) => {
        console.log('Evento creado exitosamente', response);
        this.saving = false;
        alert('Evento creado correctamente');
        this.router.navigate(['/admin/evento']);
      },
      error: (err) => {
        console.error('Error al crear evento', err);
        this.saving = false;
        alert('Hubo un problema al crear el evento, intenta nuevamente');
      }
    });
  }
}



  getErrorMessage(controlName: string): string {
    const control = this.eventoForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Campo obligatorio';
    }
    if (control?.hasError('min')) {
      return 'Valor mínimo no alcanzado';
    }
    if (control?.hasError('max')) {
      return 'Valor máximo excedido';
    }
    if (control?.hasError('pattern')) {
      return 'Formato inválido';
    }
    if (control?.hasError('fecha_fin_invalid')) {
      return 'La fecha de fin debe ser igual o posterior a la fecha de inicio';
    }
    if (control?.hasError('hora_fin_invalid')) {
      return 'La hora de fin debe ser posterior a la hora de inicio';
    }

    return 'Error desconocido';
  }

  get slidersPrincipales() {
  return (this.eventoForm.get('sliders_principales') as FormArray);
}

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // Verifica si el formulario está correctamente inicializado
    if (!this.eventoForm || this.eventoForm.invalid) {
      return; // No hacer nada si el formulario es inválido
    }

    const formData = this.eventoForm.value;
    console.log('Datos a enviar:', formData);

    this.saving = true;

    if (this.isEditMode) {
      console.log('Actualizando evento');
      // Llamar al servicio para actualizar el evento
    } else {
      console.log('Creando nuevo evento');
      // Llamar al servicio para crear el evento
    }
  }

  addSliderPrincipal() {
  const sliderGroup = this.fb.group({
    nombre: ['', Validators.required],
    orden: [1, Validators.required],
    es_principal: [true],
    imagen: ['']
  });
  (this.eventoForm.get('sliders_principales') as FormArray).push(sliderGroup);
  }



  removeSliderPrincipal(index: number) {
  (this.eventoForm.get('sliders_principales') as FormArray).removeAt(index);
  }





}