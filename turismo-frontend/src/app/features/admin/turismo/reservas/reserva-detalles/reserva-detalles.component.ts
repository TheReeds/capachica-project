import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurismoService, Reserva, Emprendedor, ReservaDetalle } from '../../../../../core/services/turismo.service';

@Component({
  selector: 'app-reserva-detalles',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Detalles de Reserva</h1>
          <p class="mt-1 text-sm text-gray-500" *ngIf="reserva">
            Gestione los emprendedores para la reserva "{{ reserva.nombre }}" del {{ formatDate(reserva.fecha) }}.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <a 
            routerLink="/admin/reservas" 
            class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver
          </a>
          
          <a 
            [routerLink]="['/admin/reservas/edit', reservaId]" 
            class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Editar Reserva
          </a>
        </div>
      </div>
      
      <!-- Información de la reserva -->
      @if (reserva) {
        <div class="rounded-lg bg-white shadow-sm overflow-hidden">
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900">Información de la Reserva</h2>
            <div class="mt-4 grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Nombre</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ reserva.nombre }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Fecha</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(reserva.fecha) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Tipo</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                        [class.bg-green-100]="reserva.tipo === 'Individual'"
                        [class.text-green-800]="reserva.tipo === 'Individual'"
                        [class.bg-blue-100]="reserva.tipo === 'Grupal'"
                        [class.text-blue-800]="reserva.tipo === 'Grupal'">
                    {{ reserva.tipo }}
                  </span>
                </dd>
              </div>
              <div class="sm:col-span-3">
                <dt class="text-sm font-medium text-gray-500">Descripción</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ reserva.descripcion || 'Sin descripción' }}</dd>
              </div>
            </div>
          </div>
        </div>
      }
      
      <!-- Formulario para añadir emprendedor a la reserva -->
      <div class="rounded-lg bg-white shadow-sm overflow-hidden">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900">Añadir Emprendedor a la Reserva</h2>
          
          <form [formGroup]="detalleForm" (ngSubmit)="addEmprendedor()" class="mt-4 space-y-4">
            <div class="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
              <!-- Emprendedor -->
              <div>
                <label for="emprendedor_id" class="block text-sm font-medium text-gray-700">Emprendedor</label>
                <div class="mt-1">
                  <select 
                    id="emprendedor_id" 
                    formControlName="emprendedor_id"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">Seleccione emprendedor</option>
                    @for (emprendedor of emprendedoresDisponibles; track emprendedor.id) {
                      <option [value]="emprendedor.id">{{ emprendedor.nombre }}</option>
                    }
                  </select>
                </div>
                @if (detalleForm.get('emprendedor_id')?.invalid && detalleForm.get('emprendedor_id')?.touched) {
                  <p class="mt-2 text-sm text-red-600">Seleccione un emprendedor</p>
                }
              </div>
              
              <!-- Cantidad -->
              <div>
                <label for="cantidad" class="block text-sm font-medium text-gray-700">Cantidad</label>
                <div class="mt-1">
                  <input 
                    type="number" 
                    id="cantidad" 
                    formControlName="cantidad"
                    min="1"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                </div>
                @if (detalleForm.get('cantidad')?.invalid && detalleForm.get('cantidad')?.touched) {
                  <p class="mt-2 text-sm text-red-600">La cantidad debe ser al menos 1</p>
                }
              </div>
              
              <!-- Descripción -->
              <div class="sm:col-span-2">
                <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
                <div class="mt-1">
                  <textarea 
                    id="descripcion" 
                    formControlName="descripcion"
                    rows="2"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  ></textarea>
                </div>
                @if (detalleForm.get('descripcion')?.invalid && detalleForm.get('descripcion')?.touched) {
                  <p class="mt-2 text-sm text-red-600">La descripción es obligatoria</p>
                }
              </div>
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                [disabled]="detalleForm.invalid || isSubmitting"
                class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                [class.opacity-50]="detalleForm.invalid || isSubmitting"
                [class.cursor-not-allowed]="detalleForm.invalid || isSubmitting"
              >
                @if (isSubmitting) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Añadiendo...
                } @else {
                  Añadir Emprendedor
                }
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Lista de emprendedores en la reserva -->
      <div class="rounded-lg bg-white shadow-sm overflow-hidden">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900">Emprendedores en la Reserva</h2>
          
          @if (loading) {
            <div class="flex justify-center items-center py-8">
              <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
              <span class="ml-4">Cargando detalles...</span>
            </div>
          } @else if (detallesReserva.length === 0) {
            <div class="py-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No hay emprendedores asignados</h3>
              <p class="mt-1 text-sm text-gray-500">Añada emprendedores utilizando el formulario anterior.</p>
            </div>
          } @else {
            <div class="mt-4 overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emprendedor</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (detalle of detallesReserva; track detalle.id) {
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
                            <span class="text-primary-800 font-medium">{{ getEmprendedorInitials(detalle.emprendedor) }}</span>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ detalle.emprendedor?.nombre }}</div>
                            <div class="text-sm text-gray-500">{{ detalle.emprendedor?.tipo_servicio }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-gray-500">{{ detalle.descripcion || 'Sin descripción' }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ detalle.cantidad }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex items-center justify-end space-x-2">
                          <button 
                            (click)="editDetalle(detalle)" 
                            class="text-primary-600 hover:text-primary-900"
                            title="Editar"
                          >
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          
                          <button 
                            (click)="deleteDetalle(detalle)" 
                            class="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>
    
    <!-- Modal de edición -->
    @if (showEditModal) {
      <div class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Editar Detalle de Reserva
                  </h3>
                  <div class="mt-4">
                    <form [formGroup]="editForm" class="space-y-4">
                      <!-- Emprendedor (solo lectura) -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Emprendedor</label>
                        <div class="mt-1">
                          <input 
                            type="text" 
                            [value]="currentDetalle?.emprendedor?.nombre || ''"
                            readonly
                            class="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                          >
                        </div>
                      </div>
                      
                      <!-- Cantidad -->
                      <div>
                        <label for="edit_cantidad" class="block text-sm font-medium text-gray-700">Cantidad</label>
                        <div class="mt-1">
                          <input 
                            type="number" 
                            id="edit_cantidad" 
                            formControlName="cantidad"
                            min="1"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                        </div>
                        @if (editForm.get('cantidad')?.invalid && editForm.get('cantidad')?.touched) {
                          <p class="mt-2 text-sm text-red-600">La cantidad debe ser al menos 1</p>
                        }
                      </div>
                      
                      <!-- Descripción -->
                      <div>
                        <label for="edit_descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
                        <div class="mt-1">
                          <textarea 
                            id="edit_descripcion" 
                            formControlName="descripcion"
                            rows="2"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          ></textarea>
                        </div>
                        @if (editForm.get('descripcion')?.invalid && editForm.get('descripcion')?.touched) {
                          <p class="mt-2 text-sm text-red-600">La descripción es obligatoria</p>
                        }
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                (click)="updateDetalle()"
                [disabled]="editForm.invalid || isSubmitting"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                [class.opacity-50]="editForm.invalid || isSubmitting"
                [class.cursor-not-allowed]="editForm.invalid || isSubmitting"
              >
                @if (isSubmitting) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                } @else {
                  Guardar Cambios
                }
              </button>
              <button 
                type="button" 
                (click)="cancelEdit()"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ReservaDetallesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private turismoService = inject(TurismoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  reservaId: number | null = null;
  reserva: Reserva | null = null;
  detallesReserva: ReservaDetalle[] = [];
  emprendedoresDisponibles: Emprendedor[] = [];
  allEmprendedores: Emprendedor[] = [];
  
  detalleForm!: FormGroup;
  editForm!: FormGroup;
  
  loading = true;
  isSubmitting = false;
  showEditModal = false;
  currentDetalle: ReservaDetalle | null = null;
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reservaId = +id;
      this.initForms();
      this.loadReserva();
      this.loadEmprendedores();
      this.loadDetallesReserva();
    } else {
      this.router.navigate(['/admin/reservas']);
    }
  }
  
  initForms() {
    this.detalleForm = this.fb.group({
      emprendedor_id: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
    
    this.editForm = this.fb.group({
      descripcion: ['', [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }
  
  loadReserva() {
    if (!this.reservaId) return;
    
    this.turismoService.getReserva(this.reservaId).subscribe({
      next: (reserva) => {
        this.reserva = reserva;
      },
      error: (error) => {
        console.error('Error al cargar reserva:', error);
      }
    });
  }
  
  loadEmprendedores() {
    // Cargar todos los emprendedores
    this.turismoService.getEmprendedores(1, 100).subscribe({
      next: (response) => {
        this.allEmprendedores = response.data;
        this.updateEmprendedoresDisponibles();
      },
      error: (error) => {
        console.error('Error al cargar emprendedores:', error);
      }
    });
  }
  
  loadDetallesReserva() {
    if (!this.reservaId) return;
    
    this.loading = true;
    this.turismoService.getReservaDetallesByReserva(this.reservaId).subscribe({
      next: (detalles) => {
        this.detallesReserva = detalles;
        this.loading = false;
        this.updateEmprendedoresDisponibles();
      },
      error: (error) => {
        console.error('Error al cargar detalles de reserva:', error);
        this.loading = false;
      }
    });
  }
  
  updateEmprendedoresDisponibles() {
    // Filtrar los emprendedores que ya están en la reserva
    const emprendedoresEnReserva = this.detallesReserva.map(d => d.emprendedor_id);
    this.emprendedoresDisponibles = this.allEmprendedores.filter(e => !emprendedoresEnReserva.includes(e.id || 0));
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  getEmprendedorInitials(emprendedor?: Emprendedor): string {
    if (!emprendedor || !emprendedor.nombre) return '';
    
    const nameParts = emprendedor.nombre.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  }
  
  addEmprendedor() {
    if (this.detalleForm.invalid || this.isSubmitting || !this.reservaId) return;
    
    this.isSubmitting = true;
    
    const formData = {
      ...this.detalleForm.value,
      reserva_id: this.reservaId
    };
    
    this.turismoService.createReservaDetalle(formData).subscribe({
      next: (detalle) => {
        // Actualizar la lista de detalles
        this.loadDetallesReserva();
        
        // Limpiar el formulario
        this.detalleForm.reset({
          emprendedor_id: '',
          descripcion: '',
          cantidad: 1
        });
        
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error al añadir emprendedor a la reserva:', error);
        this.isSubmitting = false;
        alert('Error al añadir el emprendedor. Por favor, intente nuevamente.');
      }
    });
  }
  
  editDetalle(detalle: ReservaDetalle) {
    this.currentDetalle = detalle;
    this.editForm.patchValue({
      descripcion: detalle.descripcion,
      cantidad: detalle.cantidad
    });
    this.showEditModal = true;
  }
  
  updateDetalle() {
    if (this.editForm.invalid || this.isSubmitting || !this.currentDetalle?.id) return;
    
    this.isSubmitting = true;
    
    const formData = {
      ...this.currentDetalle,
      ...this.editForm.value
    };
    
    this.turismoService.updateReservaDetalle(this.currentDetalle.id, formData).subscribe({
      next: () => {
        // Actualizar la lista de detalles
        this.loadDetallesReserva();
        
        // Cerrar el modal
        this.showEditModal = false;
        this.currentDetalle = null;
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error al actualizar detalle de reserva:', error);
        this.isSubmitting = false;
        alert('Error al actualizar el detalle. Por favor, intente nuevamente.');
      }
    });
  }
  
  cancelEdit() {
    this.showEditModal = false;
    this.currentDetalle = null;
  }
  
  deleteDetalle(detalle: ReservaDetalle) {
    if (!detalle.id) return;
    
    if (confirm(`¿Está seguro de eliminar el emprendedor "${detalle.emprendedor?.nombre}" de esta reserva? Esta acción no se puede deshacer.`)) {
      this.turismoService.deleteReservaDetalle(detalle.id).subscribe({
        next: () => {
          // Actualizar la lista de detalles
          this.loadDetallesReserva();
        },
        error: (error) => {
          console.error('Error al eliminar detalle de reserva:', error);
          alert('Error al eliminar el detalle. Por favor, intente nuevamente.');
        }
      });
    }
  }
}