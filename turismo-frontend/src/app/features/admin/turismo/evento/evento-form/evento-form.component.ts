import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-evento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
     <div class="bg-white rounded-lg shadow-lg">
      <!-- Header con imagen de fondo -->
      <div class="relative h-48 rounded-t-lg overflow-hidden bg-gradient-to-r from-green-600 to-primary-600">
        <div class="absolute inset-0 flex items-center justify-center">
          <h1 class="text-3xl font-bold text-white drop-shadow-lg">
            {{ isEditMode ? 'Editar Evento' : 'Crear Nuevo Evento' }}
          </h1>
        </div>
        <div class="absolute bottom-4 left-4">
          <a 
            routerLink="/admin/evento" 
            class="inline-flex items-center rounded-md bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver al listado
          </a>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="px-6 py-8">
        <form [formGroup]="eventoForm" (ngSubmit)="onSubmit()" class="space-y-8">
          <!-- Pestañas de navegación -->
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button 
                type="button"
                [class]="activeTab === 'informacion-general' ? 'border-b-2 border-primary-500 text-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                class="py-4 px-1 text-center text-sm"
                (click)="activeTab = 'informacion-general'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Información General
              </button>
              <button 
                type="button"
                [class]="activeTab === 'ubicacion' ? 'border-b-2 border-primary-500 text-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                class="py-4 px-1 text-center text-sm"
                (click)="activeTab = 'ubicacion'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ubicación
              </button>
              <button 
                type="button"
                [class]="activeTab === 'detalles' ? 'border-b-2 border-primary-500 text-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                class="py-4 px-1 text-center text-sm"
                (click)="activeTab = 'detalles'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Detalles adicionales
              </button>
            </nav>
          </div>

          <!-- Contenido de pestañas -->
          <div [ngSwitch]="activeTab" class="mt-6">
            <!-- Pestaña Información General -->
            <div *ngSwitchCase="'informacion-general'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nombre del Evento -->
                <div class="col-span-1 md:col-span-2">
                  <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre del evento *</label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="nombre" 
                      formControlName="nombre" 
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" 
                      [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('nombre')}"
                      placeholder="Ingrese el nombre del evento"
                    />
                    <p *ngIf="isFieldInvalid('nombre')" class="mt-2 text-sm text-red-600">El nombre del evento es obligatorio</p>
                  </div>
                </div>

                <!-- Descripción -->
                <div class="col-span-1 md:col-span-2">
                  <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción *</label>
                  <div class="mt-1">
                    <textarea 
                      id="descripcion" 
                      formControlName="descripcion" 
                      rows="4"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" 
                      [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('descripcion')}"
                      placeholder="Describa el evento..."
                    ></textarea>
                    <p *ngIf="isFieldInvalid('descripcion')" class="mt-2 text-sm text-red-600">La descripción del evento es obligatoria</p>
                  </div>
                </div>

                <!-- Tipo de Evento -->
                <div>
                  <label for="tipo_evento" class="block text-sm font-medium text-gray-700">Tipo de Evento *</label>
                  <div class="mt-1">
                    <select 
                      id="tipo_evento" 
                      formControlName="tipo_evento" 
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('tipo_evento')}"
                    >
                      <option value="" disabled selected>Seleccione un tipo</option>
                      <option value="conferencia">Conferencia</option>
                      <option value="taller">Taller</option>
                      <option value="networking">Networking</option>
                      <option value="exposicion">Exposición</option>
                      <option value="otro">Otro</option>
                    </select>
                    <p *ngIf="isFieldInvalid('tipo_evento')" class="mt-2 text-sm text-red-600">Debe especificar el tipo de evento</p>
                  </div>
                </div>

                <!-- Idioma Principal -->
                <div>
                  <label for="idioma_principal" class="block text-sm font-medium text-gray-700">Idioma Principal *</label>
                  <div class="mt-1">
                    <select 
                      id="idioma_principal" 
                      formControlName="idioma_principal" 
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('idioma_principal')}"
                    >
                      <option value="" disabled selected>Seleccione un idioma</option>
                      <option value="es">Español</option>
                      <option value="en">Inglés</option>
                      <option value="fr">Francés</option>
                      <option value="pt">Portugués</option>
                      <option value="otro">Otro</option>
                    </select>
                    <p *ngIf="isFieldInvalid('idioma_principal')" class="mt-2 text-sm text-red-600">Debe indicar el idioma principal del evento</p>
                  </div>
                </div>

                <!-- URL de la imagen -->
                <div class="col-span-1 md:col-span-2">
                  <label for="imagen_url" class="block text-sm font-medium text-gray-700">URL de la imagen *</label>
                  <div class="mt-1">
                    <input 
                      type="url" 
                      id="imagen_url" 
                      formControlName="imagen_url" 
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" 
                      [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('imagen_url')}"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    <p *ngIf="isFieldInvalid('imagen_url')" class="mt-2 text-sm text-red-600">Debe proporcionar una URL válida para la imagen</p>
                  </div>
                </div>

                <!-- Emprendedor Asociado -->
                <div class="col-span-1 md:col-span-2">
                  <label for="id_emprendedor" class="block text-sm font-medium text-gray-700">Emprendedor Asociado *</label>
                  <div class="mt-1">
                    <select 
                      id="id_emprendedor" 
                      formControlName="id_emprendedor" 
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('id_emprendedor')}"
                    >
                      <option value="" disabled selected>Seleccione un emprendedor</option>
                      <option value="1">Emprendedor 1</option>
                      <option value="2">Emprendedor 2</option>
                      <option value="3">Emprendedor 3</option>
                      <!-- Aquí irían opciones cargadas dinámicamente desde el backend -->
                    </select>
                    <p *ngIf="isFieldInvalid('id_emprendedor')" class="mt-2 text-sm text-red-600">Debe seleccionar un emprendedor</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pestaña Ubicación -->
            <div *ngSwitchCase="'ubicacion'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Mapa de referencia (simulado) -->
                <div class="col-span-1 md:col-span-2 bg-gray-100 rounded-lg p-4">
                  <div class="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                    <p class="text-gray-500 text-center">Mapa de referencia<br>
                      <span class="text-sm">Utilice las coordenadas para indicar la ubicación exacta</span>
                    </p>
                  </div>
                </div>
                
                <!-- Coordenadas -->
                <div>
                  <label for="coordenada_x" class="block text-sm font-medium text-gray-700">Latitud *</label>
                  <div class="mt-1">
                    <input 
                      type="number" 
                      id="coordenada_x" 
                      formControlName="coordenada_x" 
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('coordenada_x')}"
                      placeholder="Ej. 40.7128"
                      step="0.000001"
                    />
                    <p *ngIf="isFieldInvalid('coordenada_x')" class="mt-2 text-sm text-red-600">La latitud debe estar entre -90 y 90</p>
                  </div>
                </div>

                <div>
                  <label for="coordenada_y" class="block text-sm font-medium text-gray-700">Longitud *</label>
                  <div class="mt-1">
                    <input 
                      type="number" 
                      id="coordenada_y" 
                      formControlName="coordenada_y" 
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('coordenada_y')}"
                      placeholder="Ej. -74.0060" 
                      step="0.000001"
                    />
                    <p *ngIf="isFieldInvalid('coordenada_y')" class="mt-2 text-sm text-red-600">La longitud debe estar entre -180 y 180</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pestaña Detalles adicionales -->
            <div *ngSwitchCase="'detalles'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Fecha de Inicio -->
                <div>
                  <label for="fecha_inicio" class="block text-sm font-medium text-gray-700">Fecha de Inicio *</label>
                  <div class="mt-1">
                    <input 
                      type="date" 
                      id="fecha_inicio" 
                      formControlName="fecha_inicio" 
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('fecha_inicio')}"
                    />
                    <p *ngIf="isFieldInvalid('fecha_inicio')" class="mt-2 text-sm text-red-600">Debe indicar la fecha de inicio</p>
                  </div>
                </div>

                <!-- Fecha de Fin -->
                <div>
                  <label for="fecha_fin" class="block text-sm font-medium text-gray-700">Fecha de Fin *</label>
                  <div class="mt-1">
                    <input 
                      type="date" 
                      id="fecha_fin" 
                      formControlName="fecha_fin" 
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('fecha_fin')}"
                    />
                    <p *ngIf="isFieldInvalid('fecha_fin')" class="mt-2 text-sm text-red-600">La fecha de fin debe ser igual o posterior a la fecha de inicio</p>
                  </div>
                </div>

                <!-- Hora de Inicio -->
                <div>
                  <label for="hora_inicio" class="block text-sm font-medium text-gray-700">Hora de Inicio *</label>
                  <div class="mt-1">
                    <input 
                      type="time" 
                      id="hora_inicio" 
                      formControlName="hora_inicio" 
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('hora_inicio')}"
                      step="1"  
                    />
                    <p *ngIf="isFieldInvalid('hora_inicio')" class="mt-2 text-sm text-red-600">La hora de inicio es obligatoria</p>
                  </div>
                </div>

                <!-- Hora de Fin -->
                <div>
                  <label for="hora_fin" class="block text-sm font-medium text-gray-700">Hora de Fin *</label>
                  <div class="mt-1">
                    <input 
                      type="time" 
                      id="hora_fin" 
                      formControlName="hora_fin" 
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('hora_fin')}"
                      step="1" 
                    />
                    <p *ngIf="isFieldInvalid('hora_fin')" class="mt-2 text-sm text-red-600">La hora de fin debe ser posterior a la hora de inicio</p>
                  </div>
                </div>

                <!-- Duración -->
                <div>
                  <label for="duracion_horas" class="block text-sm font-medium text-gray-700">Duración (Horas) *</label>
                  <div class="mt-1">
                    <input 
                      type="number" 
                      id="duracion_horas" 
                      formControlName="duracion_horas" 
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      [ngClass]="{'border-red-300 ring-red-300 focus:border-red-500 focus:ring-red-500': isFieldInvalid('duracion_horas')}"
                      min="0"
                      step="0.5"
                      placeholder="Ej. 2.5"
                    />
                    <p *ngIf="isFieldInvalid('duracion_horas')" class="mt-2 text-sm text-red-600">La duración debe ser un número válido</p>
                  </div>
                </div>

                <!-- Información adicional -->
                <div class="col-span-1 md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">¿Qué llevar?</label>
                  <div class="mt-1">
                    <textarea 
                      id="que_llevar" 
                      formControlName="que_llevar" 
                      rows="3"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" 
                      placeholder="Indique lo que los asistentes deben llevar al evento..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Barra de navegación inferior y botones -->
          <div class="pt-6 border-t border-gray-200 flex justify-between items-center">
            <div class="flex items-center">
              <div class="flex space-x-1">
                <span 
                  [ngClass]="activeTab === 'informacion-general' ? 'bg-primary-600' : 'bg-gray-300'"
                  class="h-2 w-2 rounded-full"
                ></span>
                <span 
                  [ngClass]="activeTab === 'ubicacion' ? 'bg-primary-600' : 'bg-gray-300'"
                  class="h-2 w-2 rounded-full"
                ></span>
                <span 
                  [ngClass]="activeTab === 'detalles' ? 'bg-primary-600' : 'bg-gray-300'"
                  class="h-2 w-2 rounded-full"
                ></span>
              </div>
              <span class="ml-3 text-sm text-gray-500">* Campos obligatorios</span>
            </div>
            
            <div class="flex space-x-3">
              <button 
                type="button"
                routerLink="/admin/evento"
                class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                [disabled]="saving"
              >
                <svg *ngIf="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ saving ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EventoFormComponent implements OnInit {
  eventoForm!: FormGroup;
  isEditMode: boolean = false;
  submitted: boolean = false;
  error: string = '';
  saving: boolean = false;  
  activeTab: string = 'informacion-general';

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.eventoForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo_evento: ['', Validators.required],
      idioma_principal: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', [Validators.required, this.fechaFinValidator]],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', [Validators.required, this.horaFinValidator]],
      duracion_horas: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      coordenada_x: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      coordenada_y: ['', [Validators.required, Validators.min(-180), Validators.max(180)]]
    });

    // Lógica para editar si hay un ID
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.cargarEvento(id);
    }
  }

  cargarEvento(id: string): void {
    // Lógica para cargar los datos del evento si está en modo edición
  }

  fechaFinValidator(control: any) {
    if (control.value && this.eventoForm) {
      const fechaInicio = this.eventoForm.get('fecha_inicio')?.value;
      if (fechaInicio && control.value < fechaInicio) {
        return { 'fecha_fin.after_or_equal': true };
      }
    }
    return null;
  }

  horaFinValidator(control: any) {
    const horaInicio = this.eventoForm.get('hora_inicio')?.value;
    if (control.value && horaInicio && control.value <= horaInicio) {
      return { 'hora_fin.after': true };
    }
    return null;
  }

  isFieldInvalid(field: string): boolean {
  const control = this.eventoForm?.get(field); 
  return !!(control && control.invalid && (control.dirty || control.touched));
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

}
