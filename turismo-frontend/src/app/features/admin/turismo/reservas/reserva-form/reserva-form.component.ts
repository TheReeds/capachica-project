import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurismoService, Reserva } from '../../../../../core/services/turismo.service';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ isEditMode ? 'Editar' : 'Crear' }} Reserva</h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ isEditMode ? 'Actualice la información de la reserva.' : 'Complete el formulario para crear una nueva reserva.' }}
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <a 
            routerLink="/admin/reservas" 
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
        <form [formGroup]="reservaForm" (ngSubmit)="submitForm()" class="space-y-6">
          <div class="rounded-lg bg-white shadow-sm overflow-hidden">
            <div class="p-6 space-y-6">
              <!-- Información básica -->
              <div>
                <h2 class="text-lg font-medium text-gray-900">Información de la Reserva</h2>
                <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <!-- Nombre -->
                  <div class="sm:col-span-4">
                    <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre de la Reserva</label>
                    <div class="mt-1">
                      <input 
                        type="text" 
                        id="nombre" 
                        formControlName="nombre"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                    </div>
                    @if (reservaForm.get('nombre')?.invalid && reservaForm.get('nombre')?.touched) {
                      <p class="mt-2 text-sm text-red-600">El nombre es obligatorio</p>
                    }
                  </div>
                  
                  <!-- Fecha -->
                  <div class="sm:col-span-2">
                    <label for="fecha" class="block text-sm font-medium text-gray-700">Fecha</label>
                    <div class="mt-1">
                      <input 
                        type="date" 
                        id="fecha" 
                        formControlName="fecha"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                    </div>
                    @if (reservaForm.get('fecha')?.invalid && reservaForm.get('fecha')?.touched) {
                      <p class="mt-2 text-sm text-red-600">La fecha es obligatoria</p>
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
                  </div>
                  
                  <!-- Tipo -->
                  <div class="sm:col-span-3">
                    <label for="tipo" class="block text-sm font-medium text-gray-700">Tipo de Reserva</label>
                    <div class="mt-1">
                      <select 
                        id="tipo" 
                        formControlName="tipo"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="">Seleccione tipo</option>
                        <option value="Individual">Individual</option>
                        <option value="Grupal">Grupal</option>
                      </select>
                    </div>
                    @if (reservaForm.get('tipo')?.invalid && reservaForm.get('tipo')?.touched) {
                      <p class="mt-2 text-sm text-red-600">El tipo es obligatorio</p>
                    }
                  </div>
                  
                  <!-- Redes URL -->
                  <div class="sm:col-span-3">
                    <label for="redes_url" class="block text-sm font-medium text-gray-700">URL de Redes</label>
                    <div class="mt-1">
                      <input 
                        type="url" 
                        id="redes_url" 
                        formControlName="redes_url"
                        placeholder="https://ejemplo.com/reserva"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
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
                [disabled]="reservaForm.invalid || isSubmitting"
                class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                [class.opacity-50]="reservaForm.invalid || isSubmitting"
                [class.cursor-not-allowed]="reservaForm.invalid || isSubmitting"
              >
                @if (isSubmitting) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                } @else {
                  {{ isEditMode ? 'Actualizar' : 'Crear' }} Reserva
                }
              </button>
            </div>
          </div>
        </form>
      }
      
      @if (isEditMode && !loading) {
        <div class="mt-4 rounded-lg bg-white shadow-sm overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-medium text-gray-900">Emprendedores Asignados</h2>
              <a [routerLink]="['/admin/reservas', reservaId, 'detalles']" class="text-sm text-primary-600 hover:text-primary-500">
                Gestionar emprendedores
              </a>
            </div>
            
            @if (emprendedoresCount === 0) {
              <div class="text-center py-6">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No hay emprendedores asignados</h3>
                <p class="mt-1 text-sm text-gray-500">Añada emprendedores a esta reserva.</p>
                <div class="mt-6">
                  <a [routerLink]="['/admin/reservas', reservaId, 'detalles']" class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Añadir emprendedores
                  </a>
                </div>
              </div>
            } @else {
              <div class="text-center p-4 bg-gray-50 rounded-md">
                <p class="text-sm text-gray-700">
                  Esta reserva tiene <span class="font-medium">{{ emprendedoresCount }}</span> emprendedor(es) asignado(s).
                </p>
                <a [routerLink]="['/admin/reservas', reservaId, 'detalles']" class="mt-2 inline-block text-sm text-primary-600 hover:text-primary-500">
                  Ver y gestionar emprendedores
                </a>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class ReservaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private turismoService = inject(TurismoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  reservaForm!: FormGroup;
  reserva: Reserva | null = null;
  
  loading = true;
  isSubmitting = false;
  isEditMode = false;
  reservaId: number | null = null;
  
  emprendedoresCount = 0;
  
  ngOnInit() {
    this.initForm();
    
    // Verificar si es modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.reservaId = +id;
      this.loadReserva(this.reservaId);
    } else {
      this.loading = false;
    }
  }
  
  initForm() {
    this.reservaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      descripcion: [''],
      tipo: ['', [Validators.required]],
      redes_url: ['']
    });
  }
  
  loadReserva(id: number) {
    this.loading = true;
    this.turismoService.getReserva(id).subscribe({
      next: (reserva) => {
        this.reserva = reserva;
        
        // Formatear la fecha para el input date (YYYY-MM-DD)
        const fechaObj = new Date(reserva.fecha);
        const fechaFormateada = fechaObj.toISOString().split('T')[0];
        
        // Llenar el formulario con los datos de la reserva
        this.reservaForm.patchValue({
          nombre: reserva.nombre,
          fecha: fechaFormateada,
          descripcion: reserva.descripcion,
          tipo: reserva.tipo,
          redes_url: reserva.redes_url
        });
        
        // Cargar también los emprendedores asociados
        this.loadEmprendedores(id);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar reserva:', error);
        this.loading = false;
      }
    });
  }
  
  loadEmprendedores(reservaId: number) {
    this.turismoService.getEmprendedoresByReserva(reservaId).subscribe({
      next: (emprendedores) => {
        this.emprendedoresCount = emprendedores.length;
      },
      error: (error) => {
        console.error('Error al cargar emprendedores de la reserva:', error);
      }
    });
  }
  
  submitForm() {
    if (this.reservaForm.invalid || this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Preparar datos para enviar
    const formData = this.reservaForm.value;
    
    // Crear o actualizar reserva
    if (this.isEditMode && this.reservaId) {
      this.turismoService.updateReserva(this.reservaId, formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          alert('Reserva actualizada correctamente');
          this.router.navigate(['/admin/reservas']);
        },
        error: (error) => {
          console.error('Error al actualizar reserva:', error);
          this.isSubmitting = false;
          alert('Error al actualizar la reserva. Por favor, intente nuevamente.');
        }
      });
    } else {
      this.turismoService.createReserva(formData).subscribe({
        next: (reserva) => {
          this.isSubmitting = false;
          alert('Reserva creada correctamente');
          // Redirigir a la página de detalles para añadir emprendedores
          this.router.navigate(['/admin/reservas', reserva.id, 'detalles']);
        },
        error: (error) => {
            console.error('Error al crear reserva:', error);
            this.isSubmitting = false;
            alert('Error al crear la reserva. Por favor, intente nuevamente.');
          }
        });
      }
    }
    
    cancel() {
      this.router.navigate(['/admin/reservas']);
    }
  }