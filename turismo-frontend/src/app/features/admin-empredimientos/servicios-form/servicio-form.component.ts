import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmprendimientoAdminService } from '../../../core/services/emprendimiento-admin.service';
import { Emprendimiento, Servicio, Horario } from '../../../core/models/emprendimiento-admin.model';
import { SliderUploadComponent, SliderImage } from '../../../shared/components/slider-upload/slider-upload.component';
import { UbicacionMapComponent } from '../../../shared/components/ubicacion-map/ubicacion-map.component';

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule, 
    SliderUploadComponent, 
    UbicacionMapComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <nav class="flex mb-3" aria-label="Breadcrumb">
                <ol class="inline-flex items-center space-x-1 md:space-x-3">
                  <li class="inline-flex items-center">
                    <a routerLink="/admin-emprendedores/mis-emprendimientos" 
                       class="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">
                      Mis Emprendimientos
                    </a>
                  </li>
                  <li>
                    <div class="flex items-center">
                      <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <a [routerLink]="['/admin-emprendedores/emprendimiento', emprendimientoId, 'servicios']" 
                         class="ml-1 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">
                        Servicios
                      </a>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center">
                      <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="ml-1 text-gray-500 dark:text-gray-400">
                        {{ isEditMode ? 'Editar Servicio' : 'Nuevo Servicio' }}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ isEditMode ? 'Editar Servicio' : 'Crear Nuevo Servicio' }}
              </h1>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                {{ emprendimiento?.nombre || 'Cargando...' }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <a [routerLink]="['/admin-emprendedores/emprendimiento', emprendimientoId, 'servicios']"
                 class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Volver a Servicios
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- Success/Error Messages -->
      <div *ngIf="success" class="fixed top-4 right-4 z-50 max-w-md">
        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800 dark:text-green-200">{{ success }}</p>
            </div>
            <div class="ml-auto pl-3">
              <button (click)="success = ''" class="text-green-400 hover:text-green-600">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-orange-200 rounded-full"></div>
          <div class="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">{{ error }}</div>
              <div class="mt-4">
                <button (click)="retryLoad()" 
                        class="text-sm bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-800/40">
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <main *ngIf="!loading && !error" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form [formGroup]="servicioForm" (ngSubmit)="onSubmit()" class="space-y-8">
          
          <!-- Pestañas de navegación -->
          <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="border-b border-gray-200 dark:border-gray-700">
              <nav class="-mb-px flex space-x-8 px-6 pt-4 overflow-x-auto">
                <button
                  type="button"
                  (click)="activeTab = 'informacion'"
                  [class.border-orange-500]="activeTab === 'informacion'"
                  [class.text-orange-600]="activeTab === 'informacion'"
                  [class.border-transparent]="activeTab !== 'informacion'"
                  [class.text-gray-500]="activeTab !== 'informacion'"
                  class="pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap hover:text-gray-700 hover:border-gray-300">
                  <div class="flex items-center">
                    <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Información Básica
                  </div>
                </button>
                <button
                  type="button"
                  (click)="activeTab = 'ubicacion'"
                  [class.border-orange-500]="activeTab === 'ubicacion'"
                  [class.text-orange-600]="activeTab === 'ubicacion'"
                  [class.border-transparent]="activeTab !== 'ubicacion'"
                  [class.text-gray-500]="activeTab !== 'ubicacion'"
                  class="pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap hover:text-gray-700 hover:border-gray-300">
                  <div class="flex items-center">
                    <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    </svg>
                    Ubicación
                  </div>
                </button>
                <button
                  type="button"
                  (click)="activeTab = 'horarios'"
                  [class.border-orange-500]="activeTab === 'horarios'"
                  [class.text-orange-600]="activeTab === 'horarios'"
                  [class.border-transparent]="activeTab !== 'horarios'"
                  [class.text-gray-500]="activeTab !== 'horarios'"
                  class="pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap hover:text-gray-700 hover:border-gray-300">
                  <div class="flex items-center">
                    <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Horarios
                  </div>
                </button>
                <button
                  type="button"
                  (click)="activeTab = 'imagenes'"
                  [class.border-orange-500]="activeTab === 'imagenes'"
                  [class.text-orange-600]="activeTab === 'imagenes'"
                  [class.border-transparent]="activeTab !== 'imagenes'"
                  [class.text-gray-500]="activeTab !== 'imagenes'"
                  class="pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap hover:text-gray-700 hover:border-gray-300">
                  <div class="flex items-center">
                    <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Imágenes
                  </div>
                </button>
              </nav>
            </div>

            <div class="p-6">
              <!-- Tab: Información Básica -->
              <div *ngIf="activeTab === 'informacion'" class="space-y-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Información Básica</h3>
                
                <!-- Nombre del Servicio -->
                <div>
                  <label for="nombre" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Servicio *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    formControlName="nombre"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: Tour en kayak por el lago"
                    [class.border-red-300]="isFieldInvalid('nombre')"
                    [class.focus:border-red-500]="isFieldInvalid('nombre')">
                  <div *ngIf="isFieldInvalid('nombre')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    <span *ngIf="servicioForm.get('nombre')?.errors?.['required']">El nombre del servicio es requerido</span>
                    <span *ngIf="servicioForm.get('nombre')?.errors?.['minlength']">El nombre debe tener al menos 3 caracteres</span>
                  </div>
                </div>

                <!-- Descripción -->
                <div>
                  <label for="descripcion" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    id="descripcion"
                    formControlName="descripcion"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe detalladamente tu servicio..."
                    [class.border-red-300]="isFieldInvalid('descripcion')"
                    [class.focus:border-red-500]="isFieldInvalid('descripcion')"></textarea>
                  <div *ngIf="isFieldInvalid('descripcion')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    <span *ngIf="servicioForm.get('descripcion')?.errors?.['required']">La descripción es requerida</span>
                    <span *ngIf="servicioForm.get('descripcion')?.errors?.['minlength']">La descripción debe tener al menos 10 caracteres</span>
                  </div>
                </div>

                <!-- Precio Referencial -->
                <div>
                  <label for="precio_referencial" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Precio Referencial (S/.) *
                  </label>
                  <input
                    type="number"
                    id="precio_referencial"
                    formControlName="precio_referencial"
                    step="0.01"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                    [class.border-red-300]="isFieldInvalid('precio_referencial')"
                    [class.focus:border-red-500]="isFieldInvalid('precio_referencial')">
                  <div *ngIf="isFieldInvalid('precio_referencial')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    <span *ngIf="servicioForm.get('precio_referencial')?.errors?.['required']">El precio es requerido</span>
                    <span *ngIf="servicioForm.get('precio_referencial')?.errors?.['min']">El precio debe ser mayor a 0</span>
                  </div>
                </div>

                <!-- Estado -->
                <div>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      formControlName="estado"
                      class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Servicio activo
                    </span>
                  </label>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Los servicios inactivos no serán visibles para los clientes
                  </p>
                </div>
              </div>

              <!-- Tab: Ubicación -->
              <div *ngIf="activeTab === 'ubicacion'" class="space-y-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Ubicación del Servicio</h3>
                
                <!-- Ubicación de Referencia -->
                <div>
                  <label for="ubicacion_referencia" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ubicación de Referencia
                  </label>
                  <input
                    type="text"
                    id="ubicacion_referencia"
                    formControlName="ubicacion_referencia"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: Muelle turístico del lago Titicaca">
                </div>

                <!-- Mapa Interactivo -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ubicación en el Mapa
                  </label>
                  <app-ubicacion-map
                    [latitud]="servicioForm.get('latitud')?.value"
                    [longitud]="servicioForm.get('longitud')?.value"
                    [readOnly]="false"
                    [zoom]="13"
                    (ubicacionChange)="onUbicacionChange($event)">
                  </app-ubicacion-map>
                </div>

                <!-- Coordenadas (readonly) -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="latitud" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Latitud
                    </label>
                    <input
                      type="number"
                      id="latitud"
                      formControlName="latitud"
                      step="any"
                      readonly
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      placeholder="Selecciona en el mapa">
                  </div>
                  <div>
                    <label for="longitud" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Longitud
                    </label>
                    <input
                      type="number"
                      id="longitud"
                      formControlName="longitud"
                      step="any"
                      readonly
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      placeholder="Selecciona en el mapa">
                  </div>
                </div>
              </div>

              <!-- Tab: Horarios -->
              <div *ngIf="activeTab === 'horarios'" class="space-y-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Horarios de Atención</h3>
                  <button
                    type="button"
                    (click)="addHorario()"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Agregar Horario
                  </button>
                </div>

                <div formArrayName="horarios" class="space-y-4">
                  <div *ngFor="let horario of horarios.controls; let i = index" 
                       [formGroupName]="i" 
                       class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                        Horario {{ i + 1 }}
                      </h4>
                      <button
                        type="button"
                        (click)="removeHorario(i)"
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <!-- Día de la Semana -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Día de la Semana
                        </label>
                        <select
                          formControlName="dia_semana"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-600 dark:text-white text-sm">
                          <option value="">Seleccionar</option>
                          <option value="Lunes">Lunes</option>
                          <option value="Martes">Martes</option>
                          <option value="Miércoles">Miércoles</option>
                          <option value="Jueves">Jueves</option>
                          <option value="Viernes">Viernes</option>
                          <option value="Sábado">Sábado</option>
                          <option value="Domingo">Domingo</option>
                        </select>
                      </div>

                      <!-- Hora Inicio -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Hora Inicio
                        </label>
                        <input
                          type="time"
                          formControlName="hora_inicio"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-600 dark:text-white text-sm">
                      </div>

                      <!-- Hora Fin -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Hora Fin
                        </label>
                        <input
                          type="time"
                          formControlName="hora_fin"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-600 dark:text-white text-sm">
                      </div>

                      <!-- Activo -->
                      <div class="flex items-center">
                        <label class="flex items-center mt-6">
                          <input
                            type="checkbox"
                            formControlName="activo"
                            class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                          <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Activo
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div *ngIf="horarios.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay horarios definidos</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Haz clic en "Agregar Horario" para comenzar.</p>
                </div>
              </div>

              <!-- Tab: Imágenes -->
              <div *ngIf="activeTab === 'imagenes'" class="space-y-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Imágenes del Servicio</h3>
                
                <!-- Sliders del Servicio -->
                <app-slider-upload
                  title="Imágenes del Servicio"
                  [slidersFormArray]="slidersArray"
                  [existingSliders]="sliders"
                  [isSliderPrincipal]="false"
                  (changeSlidersEvent)="onSlidersChange($event)"
                  (deletedSlidersEvent)="onDeletedSlidersChange($event)">
                </app-slider-upload>
                
                <!-- Información adicional -->
                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-blue-400 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300">Consejos para las imágenes</h4>
                      <div class="mt-2 text-sm text-blue-700 dark:text-blue-400">
                        <ul class="list-disc pl-5 space-y-1">
                          <li>Sube imágenes de alta calidad que muestren tu servicio</li>
                          <li>Incluye tanto imágenes del lugar como de la actividad</li>
                          <li>Tamaño máximo: 5MB por imagen</li>
                          <li>Formatos recomendados: JPG, PNG</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navegación entre tabs y botones de acción -->
            <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
              <div class="flex items-center justify-between">
                <div class="flex space-x-3">
                  <button *ngIf="activeTab !== 'informacion'" 
                          type="button" 
                          (click)="goToPreviousTab()" 
                          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Anterior
                  </button>
                  
                  <button type="button" 
                          (click)="cancel()" 
                          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    Cancelar
                  </button>
                </div>
                
                <div class="flex items-center space-x-3">
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    * Campos requeridos
                  </div>
                  
                  <div class="flex space-x-3">
                    <button *ngIf="activeTab !== 'imagenes'" 
                            type="button" 
                            (click)="goToNextTab()" 
                            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      Siguiente
                      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                    
                    <button
                      type="submit"
                      [disabled]="servicioForm.invalid || saving"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed">
                      <div *ngIf="saving" class="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      {{ saving ? 'Guardando...' : (isEditMode ? 'Actualizar Servicio' : 'Crear Servicio') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .tab-indicator {
      transition: all 0.3s ease;
    }
  `]
})
export class ServicioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private emprendimientoAdminService = inject(EmprendimientoAdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  emprendimientoId!: number;
  servicioId?: number;
  emprendimiento?: Emprendimiento;
  servicio?: Servicio;
  
  isEditMode = false;
  loading = true;
  saving = false;
  error = '';
  success = '';

  servicioForm!: FormGroup;
  activeTab: 'informacion' | 'ubicacion' | 'horarios' | 'imagenes' = 'informacion';

  // Sliders
  sliders: SliderImage[] = [];
  deletedSliders: number[] = [];

  ngOnInit(): void {
    this.initForm();
    
    this.route.params.subscribe(params => {
      this.emprendimientoId = +params['id'];
      this.servicioId = params['servicioId'] ? +params['servicioId'] : undefined;
      this.isEditMode = !!this.servicioId;
      
      this.loadData();
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.hasUnsavedChanges()) {
      $event.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
    }
  }

  private initForm(): void {
    this.servicioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      precio_referencial: ['', [Validators.required, Validators.min(0.01)]],
      emprendedor_id: [''],
      estado: [true],
      latitud: [''],
      longitud: [''],
      ubicacion_referencia: [''],
      horarios: this.fb.array([]),
      sliders: this.fb.array([])
    });
  }

  get horarios(): FormArray {
    return this.servicioForm.get('horarios') as FormArray;
  }

  get slidersArray(): FormArray {
    return this.servicioForm.get('sliders') as FormArray;
  }

  // Métodos de validación
  isFieldInvalid(fieldName: string): boolean {
    const field = this.servicioForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  hasUnsavedChanges(): boolean {
    return this.servicioForm.dirty || 
           this.sliders.some(s => s.imagen instanceof File) ||
           this.deletedSliders.length > 0;
  }

  // Navegación entre tabs
  goToPreviousTab(): void {
    const tabs = ['informacion', 'ubicacion', 'horarios', 'imagenes'];
    const currentIndex = tabs.indexOf(this.activeTab);
    if (currentIndex > 0) {
      this.activeTab = tabs[currentIndex - 1] as any;
    }
  }

  goToNextTab(): void {
    const tabs = ['informacion', 'ubicacion', 'horarios', 'imagenes'];
    const currentIndex = tabs.indexOf(this.activeTab);
    if (currentIndex < tabs.length - 1) {
      this.activeTab = tabs[currentIndex + 1] as any;
    }
  }

  // Carga de datos
  private loadData(): void {
    this.loadEmprendimiento();
    
    if (this.isEditMode && this.servicioId) {
      this.loadServicio();
    } else {
      this.loading = false;
      this.servicioForm.patchValue({
        emprendedor_id: this.emprendimientoId
      });
    }
  }

  private loadEmprendimiento(): void {
    this.emprendimientoAdminService.getEmprendimiento(this.emprendimientoId).subscribe({
      next: (data) => {
        this.emprendimiento = data;
      },
      error: (err) => {
        console.error('Error al cargar emprendimiento:', err);
        this.error = 'Error al cargar la información del emprendimiento';
      }
    });
  }

  private loadServicio(): void {
    if (!this.servicioId) return;
    
    this.emprendimientoAdminService.getServicio(this.servicioId).subscribe({
      next: (data) => {
        this.servicio = data;
        this.populateForm();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar servicio:', err);
        this.error = 'Error al cargar el servicio';
        this.loading = false;
      }
    });
  }

  private populateForm(): void {
    if (!this.servicio) return;

    // Llenar datos básicos
    this.servicioForm.patchValue({
      nombre: this.servicio.nombre,
      descripcion: this.servicio.descripcion,
      precio_referencial: this.servicio.precio_referencial,
      emprendedor_id: this.servicio.emprendedor_id,
      estado: this.servicio.estado !== false,
      latitud: this.servicio.latitud,
      longitud: this.servicio.longitud,
      ubicacion_referencia: this.servicio.ubicacion_referencia
    });

    // Cargar horarios
    if (this.servicio.horarios && this.servicio.horarios.length > 0) {
      this.servicio.horarios.forEach(horario => {
        this.horarios.push(this.createHorarioGroup(horario));
      });
    }

    // Cargar sliders
    if (this.servicio.sliders && this.servicio.sliders.length > 0) {
      this.sliders = this.servicio.sliders.map(slider => ({
        id: slider.id,
        nombre: slider.nombre,
        es_principal: slider.es_principal,
        orden: slider.orden,
        url_completa: slider.url_completa,
        imagen: slider.url_completa,
        titulo: slider.titulo || '',
        descripcion: typeof slider.descripcion === 'string' ? slider.descripcion : slider.descripcion?.descripcion || ''
      }));
    }
  }

  // Manejo de ubicación
  onUbicacionChange(ubicacion: {lat: number, lng: number}): void {
    this.servicioForm.patchValue({
      latitud: ubicacion.lat,
      longitud: ubicacion.lng
    });
  }

  // Manejo de horarios
  addHorario(): void {
    this.horarios.push(this.createHorarioGroup());
  }

  removeHorario(index: number): void {
    this.horarios.removeAt(index);
  }

  private createHorarioGroup(horario?: Horario): FormGroup {
    return this.fb.group({
      id: [horario?.id || null],
      dia_semana: [horario?.dia_semana || '', Validators.required],
      hora_inicio: [horario?.hora_inicio || '', Validators.required],
      hora_fin: [horario?.hora_fin || '', Validators.required],
      activo: [horario?.activo !== false]
    });
  }

  // Manejo de sliders
  onSlidersChange(sliders: SliderImage[]): void {
    this.sliders = sliders;
  }

  onDeletedSlidersChange(deletedIds: number[]): void {
    this.deletedSliders = deletedIds;
  }

  // Envío del formulario
  onSubmit(): void {
    if (this.servicioForm.invalid || this.saving) {
      this.markFormGroupTouched(this.servicioForm);
      this.goToFirstInvalidTab();
      return;
    }

    this.saving = true;
    const formData = this.prepareFormData();

    if (this.isEditMode && this.servicioId) {
      this.emprendimientoAdminService.updateServicio(this.servicioId, formData).subscribe({
        next: (data) => {
          this.success = 'Servicio actualizado correctamente';
          this.saving = false;
          setTimeout(() => this.navigateToServices(), 2000);
        },
        error: (err) => {
          console.error('Error al actualizar servicio:', err);
          this.error = err.error?.message || 'Error al actualizar el servicio';
          this.saving = false;
        }
      });
    } else {
      this.emprendimientoAdminService.createServicio(formData).subscribe({
        next: (data) => {
          this.success = 'Servicio creado correctamente';
          this.saving = false;
          setTimeout(() => this.navigateToServices(), 2000);
        },
        error: (err) => {
          console.error('Error al crear servicio:', err);
          this.error = err.error?.message || 'Error al crear el servicio';
          this.saving = false;
        }
      });
    }
  }

  private prepareFormData(): any {
    const formData = { ...this.servicioForm.value };
    
    // Procesar sliders
    formData.sliders = this.sliders.map(slider => ({
      ...slider,
      es_principal: false // Los servicios no tienen sliders principales
    }));
    
    // Agregar IDs de sliders eliminados
    formData.deleted_sliders = this.deletedSliders;
    
    return formData;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl) => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
        });
      }
    });
  }

  private goToFirstInvalidTab(): void {
    // Ir a la primera pestaña con errores
    const basicFields = ['nombre', 'descripcion', 'precio_referencial'];
    const hasBasicErrors = basicFields.some(field => this.isFieldInvalid(field));
    
    if (hasBasicErrors) {
      this.activeTab = 'informacion';
    } else if (this.horarios.invalid) {
      this.activeTab = 'horarios';
    }
  }

  // Métodos de utilidad
  retryLoad(): void {
    this.error = '';
    this.loading = true;
    this.loadData();
  }

  cancel(): void {
    if (this.hasUnsavedChanges()) {
      if (confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?')) {
        this.navigateToServices();
      }
    } else {
      this.navigateToServices();
    }
  }

  private navigateToServices(): void {
    this.router.navigate(['/admin-emprendedores/emprendimiento', this.emprendimientoId, 'servicios']);
  }
}