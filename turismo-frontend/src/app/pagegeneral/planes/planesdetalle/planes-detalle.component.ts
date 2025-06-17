import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanesService } from '../../../core/services/planes.service';
import { AuthService } from '../../../core/services/auth.service';
import { Plan, PlanInscripcion } from '../../../core/models/plan.model';

@Component({
  selector: 'app-planes-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <section class="relative bg-[#fdf4ec] text-gray-800 py-20 font-sans min-h-screen">
      <!-- Loading -->
      <div *ngIf="loading()" class="flex justify-center items-center min-h-screen">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p class="mt-4 text-lg text-gray-600">Cargando información del plan...</p>
        </div>
      </div>

      <!-- Error -->
      <div *ngIf="error()" class="container mx-auto px-6 py-20">
        <div class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center">
          <h2 class="text-xl font-bold mb-2">Error al cargar el plan</h2>
          <p class="mb-4">{{ error() }}</p>
          <button 
            (click)="cargarPlan()"
            class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>

      <!-- Contenido del plan -->
      <div *ngIf="plan() && !loading()">
        
        <!-- Imagen de fondo detrás del encabezado -->
        <div class="absolute inset-0 z-0">
          <img [src]="plan()!.imagen_principal_url || '/assets/images/default-plan.jpg'" 
               [alt]="plan()!.nombre" 
               class="w-full h-full object-cover opacity-20 blur-sm">
        </div>
      
        <!-- Imagen de fondo solo para encabezado -->
        <div class="absolute top-0 left-0 right-0 h-[550px] z-0">
          <img [src]="plan()!.imagen_principal_url || '/assets/images/default-plan.jpg'" 
               [alt]="plan()!.nombre" 
               class="w-full h-full object-cover">
        </div>
      
        <!-- Encabezado sobre imagen -->
        <div class="relative z-10 text-center container mx-auto px-6 py-32">
          <h1 class="text-5xl md:text-6xl font-extrabold text-white drop-shadow-2xl font-serif mb-4 tracking-wide">
            {{ plan()!.nombre }}
          </h1>
          <p class="text-xl md:text-2xl text-white font-medium italic drop-shadow-md tracking-wide">
            {{ plan()!.descripcion }}
          </p>
          
          <!-- Badges informativos -->
          <div class="flex justify-center gap-4 mt-6">
            <span class="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
              S/ {{ plan()!.precio_total || 0 }}
            </span>
          </div>
        </div>
      
        <!-- Contenido del formulario y detalles -->
        <div class="relative z-10 container mx-auto px-6 mt-[-80px]">
          <div class="grid md:grid-cols-2 gap-8">
      
            <!-- Detalles del Tour -->
            <div class="space-y-8">
              
              <!-- Galería de imágenes -->
              <div *ngIf="plan() as p">
                <div *ngIf="p.imagenes_galeria_urls && p.imagenes_galeria_urls.length > 0" 
                    class="bg-white shadow-lg rounded-lg p-6 overflow-hidden">
                    <h3 class="text-xl font-bold text-blue-700 mb-4">Galería de Imágenes</h3>
                    <div class="grid grid-cols-2 gap-4">
                    <img *ngFor="let imagen of p.imagenes_galeria_urls" 
                        [src]="imagen" 
                        [alt]="p.nombre"
                        class="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                        (click)="abrirImagenModal(imagen)">
                    </div>
                </div>
              </div>


              <!-- Información del organizador -->
              <div class="bg-white shadow-lg rounded-lg p-6">
                <h3 class="text-xl font-bold text-blue-700 mb-4">Organizador Principal</h3>
                <div *ngIf="plan()!.organizador_principal" class="space-y-3">
                  <div class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-8m-5 0H3m2 0h8M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span class="font-semibold">{{ plan()!.organizador_principal!.nombre }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="text-gray-600">{{ plan()!.organizador_principal!.ubicacion }}</span>
                  </div>
                  <div *ngIf="plan()!.organizador_principal!.telefono" class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span class="text-gray-600">{{ plan()!.organizador_principal!.telefono }}</span>
                  </div>
                </div>
              </div>

              <!-- Actividades por días -->
              <div class="bg-white shadow-lg rounded-lg p-8 overflow-hidden" *ngIf="plan() as p">
                <h3 class="text-xl font-bold text-blue-700 mb-6">Itinerario del Plan</h3>

                <div class="space-y-6" *ngIf="p.dias && p.dias.length > 0">
                    <div *ngFor="let dia of p.dias; let i = index" 
                        class="border-l-4 pl-4 py-2"
                        [ngClass]="{
                        'border-amber-500': i % 4 === 0,
                        'border-blue-500': i % 4 === 1,
                        'border-green-500': i % 4 === 2,
                        'border-purple-500': i % 4 === 3
                        }">
                    <h4 class="text-lg font-bold flex items-center gap-2"
                        [ngClass]="{
                            'text-amber-700': i % 4 === 0,
                            'text-blue-700': i % 4 === 1,
                            'text-green-700': i % 4 === 2,
                            'text-purple-700': i % 4 === 3
                        }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Día {{ dia.numero_dia }}: {{ dia.titulo }}
                    </h4>
                    <p class="text-gray-600 mt-2">{{ dia.descripcion }}</p>
                    <div *ngIf="dia.hora_inicio || dia.hora_fin" class="text-sm text-gray-500 mt-1">
                        <span *ngIf="dia.hora_inicio">Inicio: {{ dia.hora_inicio }}</span>
                        <span *ngIf="dia.hora_fin"> - Fin: {{ dia.hora_fin }}</span>
                    </div>
                    <div *ngIf="dia.notas_adicionales" class="text-sm text-blue-600 mt-2 font-medium">
                        📝 {{ dia.notas_adicionales }}
                    </div>
                    </div>
                </div>

                <div *ngIf="!p.dias || p.dias.length === 0" class="text-gray-500 text-center py-8">
                    El itinerario detallado se proporcionará al confirmar la inscripción.
                </div>
                </div>


              <!-- Qué incluye -->
              <div *ngIf="plan()!.que_incluye" class="bg-white shadow-lg rounded-lg p-6">
                <h3 class="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  ¿Qué incluye?
                </h3>
                <div class="prose prose-lg">
                  <p class="text-gray-700 leading-relaxed">{{ plan()!.que_incluye }}</p>
                </div>
              </div>

              <!-- Requerimientos y qué llevar -->
              <div class="grid md:grid-cols-2 gap-6">
                <div *ngIf="plan()!.requerimientos" class="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h4 class="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Requerimientos
                  </h4>
                  <p class="text-amber-700">{{ plan()!.requerimientos }}</p>
                </div>
                
                <div *ngIf="plan()!.que_llevar" class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 class="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Qué llevar
                  </h4>
                  <p class="text-blue-700">{{ plan()!.que_llevar }}</p>
                </div>
              </div>
            </div>
      
            <!-- Formulario de inscripción -->
            <div class="bg-white shadow-lg rounded-lg p-8">
              
              <!-- Estado del plan -->
              <div *ngIf="plan()!.cupos_disponibles === 0" class="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
                <div class="flex items-center gap-2 text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span class="font-semibold">Sin cupos disponibles</span>
                </div>
                <p class="text-red-600 text-sm mt-1">Este plan no tiene cupos disponibles en este momento.</p>
              </div>

              <!-- Información de precio y disponibilidad -->
              <div class="mb-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                <div class="text-center">
                  <div class="text-3xl font-bold text-amber-700 mb-2">
                    S/ {{ plan()!.precio_total || 0 }}
                  </div>
                  <div class="text-sm text-amber-600">
                    Por persona - {{ plan()!.duracion_dias }} {{ plan()!.duracion_dias === 1 ? 'día' : 'días' }}
                  </div>
                  <div *ngIf="plan() as p">
                        <div *ngIf="p.cupos_disponibles !== undefined && p.cupos_disponibles > 0" 
                            class="text-sm text-green-600 font-medium mt-2">
                            ✅ {{ p.cupos_disponibles }} cupos disponibles
                        </div>
                    </div>

                </div>
              </div>

              <!-- Formulario -->
              <div *ngIf="plan()!.cupos_disponibles !== 0">
                
                <!-- Verificación de autenticación -->
                <div *ngIf="!isLoggedIn()" class="mb-6 p-4 bg-blue-100 border border-blue-400 rounded-lg">
                  <div class="text-center">
                    <div class="flex items-center justify-center gap-2 text-blue-700 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span class="font-semibold">Inicia sesión para inscribirte</span>
                    </div>
                    <p class="text-blue-600 text-sm mb-4">Necesitas una cuenta para poder inscribirte a este plan.</p>
                    <div class="space-x-3">
                      <button 
                        (click)="irALogin()"
                        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Iniciar Sesión
                      </button>
                      <button 
                        (click)="irARegistro()"
                        class="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Registrarse
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Formulario de inscripción (solo si está logueado) -->
                <form *ngIf="isLoggedIn()" [formGroup]="inscripcionForm" (ngSubmit)="onSubmitInscripcion()">
                  
                  <h2 class="text-2xl font-bold mb-6 text-amber-600">Formulario de Inscripción</h2>

                  <!-- Número de participantes -->
                  <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      <span class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Número de Participantes
                      </span>
                    </label>
                    
                    <div class="flex items-center border-2 border-amber-200 rounded-lg w-fit">
                      <button type="button" 
                              (click)="decrementParticipantes()"
                              class="px-3 py-2 text-amber-600 hover:bg-amber-50 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <input type="number" 
                             formControlName="numero_participantes"
                             min="1" 
                             [max]="plan()!.cupos_disponibles || 1"
                             class="w-16 text-center border-x-2 border-amber-200 bg-transparent text-gray-800 py-2 focus:outline-none">
                      
                      <button type="button" 
                              (click)="incrementParticipantes()"
                              class="px-3 py-2 text-amber-600 hover:bg-amber-50 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    <p class="mt-2 text-sm text-amber-600 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Máximo {{ plan()!.cupos_disponibles || 1 }} participantes disponibles
                    </p>

                    <!-- Cálculo de precio total -->
                    <div *ngIf="totalCalculado() > 0" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div class="text-green-800 font-semibold">
                        Total a pagar: S/ {{ totalCalculado() }}
                      </div>
                      <div class="text-green-600 text-sm">
                        {{ inscripcionForm.get('numero_participantes')?.value }} × S/ {{ plan()!.precio_total || 0 }}
                      </div>
                    </div>
                  </div>

                  <!-- Método de pago -->
                  <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      <span class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Método de Pago Preferido
                      </span>
                    </label>
                    <select formControlName="metodo_pago"
                            class="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia Bancaria</option>
                      <option value="yape">Yape</option>
                      <option value="plin">Plin</option>
                    </select>
                  </div>

                  <!-- Requerimientos especiales -->
                  <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      <span class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Requerimientos Especiales
                      </span>
                    </label>
                    <textarea formControlName="requerimientos_especiales"
                              rows="3" 
                              placeholder="Alergias alimentarias, necesidades médicas, etc."
                              class="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
                  </div>

                  <!-- Notas adicionales -->
                  <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      <span class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Comentarios Adicionales
                      </span>
                    </label>
                    <textarea formControlName="comentarios_adicionales"
                              rows="3" 
                              placeholder="Cualquier comentario o solicitud especial..."
                              class="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
                  </div>

                  <!-- Botones -->
                  <div class="flex justify-end mt-8 space-x-4">
                    <button type="button" 
                            (click)="volverALista()"
                            class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Volver
                    </button>
                    
                    <button type="submit" 
                            [disabled]="!inscripcionForm.valid || enviandoInscripcion()"
                            class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                      <svg *ngIf="!enviandoInscripcion()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <div *ngIf="enviandoInscripcion()" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {{ enviandoInscripcion() ? 'Enviando...' : 'Inscribirse Ahora' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de imagen (opcional) -->
      <div *ngIf="imagenModalAbierta()" 
           class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
           (click)="cerrarImagenModal()">
        <div class="relative max-w-4xl max-h-full p-4">
          <img [src]="imagenModalSrc()" 
               [alt]="plan()?.nombre"
               class="max-w-full max-h-full object-contain rounded-lg">
          <button (click)="cerrarImagenModal()"
                  class="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal de éxito -->
      <div *ngIf="mostrarExito()" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 max-w-md mx-4">
          <div class="text-center">
            <div class="mb-4">
              <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">¡Inscripción Exitosa!</h3>
            <p class="text-gray-600 mb-6">
              Tu inscripción ha sido enviada. El organizador revisará tu solicitud y te contactará pronto.
            </p>
            <div class="space-y-3">
              <button 
                (click)="irAMisInscripciones()"
                class="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700">
                Ver Mis Inscripciones
              </button>
              <button 
                (click)="cerrarModalExito()"
                class="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
                Continuar Navegando
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class PlanesDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private planesService = inject(PlanesService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  // Signals
  loading = signal<boolean>(false);
  error = signal<string>('');
  plan = signal<Plan | null>(null);
  enviandoInscripcion = signal<boolean>(false);
  mostrarExito = signal<boolean>(false);
  imagenModalAbierta = signal<boolean>(false);
  imagenModalSrc = signal<string>('');

  // Computed
  totalCalculado = computed(() => {
    const numeroParticipantes = this.inscripcionForm.get('numero_participantes')?.value || 1;
    const precioUnitario = this.plan()?.precio_total || 0;
    return numeroParticipantes * precioUnitario;
  });

  // Form
  inscripcionForm: FormGroup;

  constructor() {
    this.inscripcionForm = this.fb.group({
      numero_participantes: [1, [Validators.required, Validators.min(1)]],
      metodo_pago: ['efectivo', Validators.required],
      requerimientos_especiales: [''],
      comentarios_adicionales: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const planId = +params['id'];
      if (planId) {
        this.cargarPlan(planId);
      }
    });
  }

  cargarPlan(id?: number) {
    const planId = id || +this.route.snapshot.params['id'];
    
    this.loading.set(true);
    this.error.set('');
    
    this.planesService.getPlanPublico(planId).subscribe({
      next: (plan) => {
        this.plan.set(plan);
        this.loading.set(false);
        
        // Actualizar validadores basados en cupos disponibles
        if (plan.cupos_disponibles !== undefined) {
          this.inscripcionForm.get('numero_participantes')?.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(plan.cupos_disponibles)
          ]);
          this.inscripcionForm.get('numero_participantes')?.updateValueAndValidity();
        }
      },
      error: (err) => {
        this.error.set('No se pudo cargar la información del plan. Verifica que el plan existe y está disponible.');
        this.loading.set(false);
        console.error('Error al cargar plan:', err);
      }
    });
  }

  onSubmitInscripcion() {
    if (!this.inscripcionForm.valid || !this.plan() || !this.isLoggedIn()) {
      return;
    }

    this.enviandoInscripcion.set(true);

    const inscripcionData = {
      plan_id: this.plan()!.id!,
      numero_participantes: this.inscripcionForm.get('numero_participantes')?.value,
      metodo_pago: this.inscripcionForm.get('metodo_pago')?.value,
      requerimientos_especiales: this.inscripcionForm.get('requerimientos_especiales')?.value,
      comentarios_adicionales: this.inscripcionForm.get('comentarios_adicionales')?.value
    };

    this.planesService.inscribirseAPlan(inscripcionData).subscribe({
      next: (inscripcion) => {
        this.enviandoInscripcion.set(false);
        this.mostrarExito.set(true);
        this.inscripcionForm.reset({
          numero_participantes: 1,
          metodo_pago: 'efectivo',
          requerimientos_especiales: '',
          comentarios_adicionales: ''
        });
        
        // Recargar el plan para actualizar cupos disponibles
        this.cargarPlan();
      },
      error: (err) => {
        this.enviandoInscripcion.set(false);
        console.error('Error al inscribirse:', err);
        
        let errorMessage = 'Error al procesar la inscripción. Inténtalo nuevamente.';
        if (err.error?.message) {
          errorMessage = err.error.message;
        }
        
        alert(errorMessage); // Podrías usar un toast o modal más elegante
      }
    });
  }

  incrementParticipantes() {
    const current = this.inscripcionForm.get('numero_participantes')?.value || 1;
    const max = this.plan()?.cupos_disponibles || 1;
    
    if (current < max) {
      this.inscripcionForm.patchValue({
        numero_participantes: current + 1
      });
    }
  }

  decrementParticipantes() {
    const current = this.inscripcionForm.get('numero_participantes')?.value || 1;
    
    if (current > 1) {
      this.inscripcionForm.patchValue({
        numero_participantes: current - 1
      });
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  irALogin() {
    const currentUrl = this.router.url;
    this.router.navigate(['/login'], {
      queryParams: {
        redirect: currentUrl,
        action: 'inscripcion',
        planId: this.plan()?.id
      }
    });
  }

  irARegistro() {
    const currentUrl = this.router.url;
    this.router.navigate(['/register'], {
      queryParams: {
        redirect: currentUrl,
        action: 'inscripcion',
        planId: this.plan()?.id
      }
    });
  }

  volverALista() {
    this.router.navigate(['/planes']);
  }

  irAMisInscripciones() {
    this.mostrarExito.set(false);
    this.router.navigate(['/dashboard/inscripciones']); // Ajustar según tu estructura de rutas
  }

  cerrarModalExito() {
    this.mostrarExito.set(false);
  }

  abrirImagenModal(imagenUrl: string) {
    this.imagenModalSrc.set(imagenUrl);
    this.imagenModalAbierta.set(true);
  }

  cerrarImagenModal() {
    this.imagenModalAbierta.set(false);
    this.imagenModalSrc.set('');
  }

  getDificultadLabel(dificultad: string): string {
    const labels: {[key: string]: string} = {
      'facil': 'Fácil',
      'moderado': 'Moderado',
      'dificil': 'Difícil'
    };
    return labels[dificultad] || dificultad;
  }
}