import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmprendimientoAdminService } from '../../../core/services/emprendimiento-admin.service';
import { 
  Emprendimiento, 
  CalendarioEmprendimiento,
  CalendarioEvento,
  EventoCalendario
} from '../../../core/models/emprendimiento-admin.model';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  eventos: EventoCalendario[];
  totalEventos: number;
  ingresosDia: number;
}

@Component({
  selector: 'app-calendario-emprendimiento',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
                      <a [routerLink]="['/admin-emprendedores/emprendimiento', emprendimientoId, 'dashboard']" 
                         class="ml-1 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">
                        {{ emprendimiento?.nombre || 'Emprendimiento' }}
                      </a>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center">
                      <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="ml-1 text-gray-500 dark:text-gray-400">Calendario</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                Calendario - {{ emprendimiento?.nombre || 'Cargando...' }}
              </h1>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                Vista de calendario con reservas y eventos
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <button (click)="goToToday()" 
                      class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                Hoy
              </button>
              <button (click)="refreshData()" 
                      [disabled]="loading"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50">
                <svg *ngIf="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <div *ngIf="loading" class="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Calendar Navigation -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <button (click)="previousMonth()" 
                      class="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ currentDate | date:'MMMM yyyy':'':'es' | titlecase }}
              </h2>
              <button (click)="nextMonth()" 
                      class="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            
            <!-- Summary Stats -->
            <div *ngIf="calendarioData" class="flex items-center space-x-6 text-sm">
              <div class="text-center">
                <p class="font-medium text-gray-900 dark:text-white">{{ calendarioData.total_reservas }}</p>
                <p class="text-gray-500 dark:text-gray-400">Reservas</p>
              </div>
              <div class="text-center">
                <p class="font-medium text-green-600 dark:text-green-400">S/. {{ calendarioData.ingresos_periodo | number:'1.2-2' }}</p>
                <p class="text-gray-500 dark:text-gray-400">Ingresos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading && !calendarDays.length" class="flex justify-center items-center py-20">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-orange-200 rounded-full"></div>
          <div class="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error al cargar el calendario</h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">{{ error }}</div>
              <div class="mt-4">
                <button (click)="loadCalendar()" 
                        class="bg-red-100 dark:bg-red-800 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700">
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div *ngIf="!error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          <!-- Days of Week Header -->
          <div class="grid grid-cols-7 bg-gray-50 dark:bg-gray-700">
            <div *ngFor="let day of daysOfWeek" 
                 class="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 last:border-r-0">
              {{ day }}
            </div>
          </div>

          <!-- Calendar Days -->
          <div class="grid grid-cols-7">
            <div *ngFor="let day of calendarDays; trackBy: trackByDay" 
                 class="relative border-r border-b border-gray-200 dark:border-gray-600 last:border-r-0 h-32 overflow-hidden"
                 [ngClass]="{
                   'bg-gray-50 dark:bg-gray-700': !day.isCurrentMonth,
                   'bg-white dark:bg-gray-800': day.isCurrentMonth,
                   'bg-orange-50 dark:bg-orange-900/20': day.isToday,
                   'bg-blue-50 dark:bg-blue-900/20': day.isSelected
                 }"
                 (click)="selectDay(day)">
              
              <!-- Day Number -->
              <div class="p-2">
                <span class="text-sm font-medium"
                      [ngClass]="{
                        'text-gray-400 dark:text-gray-500': !day.isCurrentMonth,
                        'text-gray-900 dark:text-white': day.isCurrentMonth && !day.isToday,
                        'text-orange-600 dark:text-orange-400 font-bold': day.isToday
                      }">
                  {{ day.date.getDate() }}
                </span>
                
                <!-- Events indicator -->
                <div *ngIf="day.totalEventos > 0" class="flex items-center justify-between mt-1">
                  <span class="text-xs text-gray-600 dark:text-gray-400">
                    {{ day.totalEventos }} evento{{ day.totalEventos > 1 ? 's' : '' }}
                  </span>
                  <span *ngIf="day.ingresosDia > 0" class="text-xs text-green-600 dark:text-green-400 font-medium">
                    S/. {{ day.ingresosDia | number:'1.0-0' }}
                  </span>
                </div>
              </div>

              <!-- Events Preview -->
              <div class="px-2 pb-2 space-y-1">
                <div *ngFor="let evento of day.eventos.slice(0, 2); trackBy: trackByEvento" 
                     class="text-xs p-1 rounded truncate cursor-pointer"
                     [ngClass]="getEventoClass(evento)"
                     [title]="evento.titulo + ' - ' + evento.hora_inicio + ' a ' + evento.hora_fin">
                  {{ evento.titulo }}
                </div>
                <div *ngIf="day.eventos.length > 2" 
                     class="text-xs text-gray-500 dark:text-gray-400 pl-1">
                  +{{ day.eventos.length - 2 }} más
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Day Details -->
        <div *ngIf="selectedDay" class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Eventos del {{ selectedDay.date | date:'fullDate':'':'es' | titlecase }}
            </h3>
            <div *ngIf="selectedDay.totalEventos > 0" class="mt-2 flex items-center space-x-4 text-sm">
              <span class="text-gray-600 dark:text-gray-400">
                {{ selectedDay.totalEventos }} evento{{ selectedDay.totalEventos > 1 ? 's' : '' }}
              </span>
              <span *ngIf="selectedDay.ingresosDia > 0" class="text-green-600 dark:text-green-400 font-medium">
                Ingresos: S/. {{ selectedDay.ingresosDia | number:'1.2-2' }}
              </span>
            </div>
          </div>
          
          <div class="p-6">
            <!-- No events -->
            <div *ngIf="selectedDay.eventos.length === 0" class="text-center py-8">
              <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No hay eventos</h3>
              <p class="mt-2 text-gray-500 dark:text-gray-400">
                No tienes reservas ni eventos programados para este día.
              </p>
            </div>

            <!-- Events list -->
            <div *ngIf="selectedDay.eventos.length > 0" class="space-y-4">
              <div *ngFor="let evento of selectedDay.eventos; trackBy: trackByEvento" 
                   class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <div class="w-3 h-3 rounded-full"
                           [ngClass]="evento.tipo === 'reserva' ? 'bg-blue-500' : 'bg-green-500'"></div>
                      <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                        {{ evento.titulo }}
                      </h4>
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            [ngClass]="getEventoEstadoBadge(evento.estado)">
                        {{ evento.estado | titlecase }}
                      </span>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span class="text-gray-500 dark:text-gray-400">Horario:</span>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ evento.hora_inicio }} - {{ evento.hora_fin }}
                        </p>
                      </div>
                      <div *ngIf="evento.cliente">
                        <span class="text-gray-500 dark:text-gray-400">Cliente:</span>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ evento.cliente }}
                        </p>
                      </div>
                      <div *ngIf="evento.servicio">
                        <span class="text-gray-500 dark:text-gray-400">Servicio:</span>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ evento.servicio }}
                        </p>
                      </div>
                    </div>

                    <div *ngIf="evento.precio" class="mt-3">
                      <span class="text-gray-500 dark:text-gray-400 text-sm">Precio:</span>
                      <span class="ml-2 font-medium text-green-600 dark:text-green-400">
                        S/. {{ evento.precio | number:'1.2-2' }}
                      </span>
                    </div>
                  </div>

                  <!-- Event Actions -->
                  <div class="ml-4">
                    <button *ngIf="evento.tipo === 'reserva'"
                            [routerLink]="['/admin-emprendedores/emprendimiento', emprendimientoId, 'reservas']"
                            class="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium">
                      Ver Reserva
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Leyenda</h3>
          <div class="flex flex-wrap items-center space-x-6 text-sm">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span class="text-gray-700 dark:text-gray-300">Reservas</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-gray-700 dark:text-gray-300">Planes</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded"></div>
              <span class="text-gray-700 dark:text-gray-300">Día actual</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded"></div>
              <span class="text-gray-700 dark:text-gray-300">Día seleccionado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CalendarioEmprendimientoComponent implements OnInit {
  private emprendimientoAdminService = inject(EmprendimientoAdminService);
  private route = inject(ActivatedRoute);

  emprendimientoId!: number;
  emprendimiento?: Emprendimiento;
  calendarioData?: CalendarioEmprendimiento;
  loading = true;
  error = '';

  currentDate = new Date();
  selectedDay?: CalendarDay;
  calendarDays: CalendarDay[] = [];

  daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.emprendimientoId = +params['id'];
      this.loadData();
    });
  }

  private loadData(): void {
    this.loadEmprendimiento();
    this.loadCalendar();
  }

  private loadEmprendimiento(): void {
    this.emprendimientoAdminService.getEmprendimiento(this.emprendimientoId).subscribe({
      next: (data) => {
        this.emprendimiento = data;
      },
      error: (err) => {
        console.error('Error al cargar emprendimiento:', err);
      }
    });
  }

  loadCalendar(): void {
    this.loading = true;
    this.error = '';

    const startOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const endOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

    const fechaInicio = this.formatDate(startOfMonth);
    const fechaFin = this.formatDate(endOfMonth);

    this.emprendimientoAdminService.getCalendario(this.emprendimientoId, fechaInicio, fechaFin).subscribe({
      next: (data) => {
        this.calendarioData = data;
        this.buildCalendar();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar calendario:', err);
        this.error = err.error?.message || 'Error al cargar el calendario';
        this.loading = false;
        // Build empty calendar even on error
        this.buildCalendar();
      }
    });
  }

  private buildCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the first Sunday before or on the first day of the month
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // End on the last Saturday after or on the last day of the month
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days: CalendarDay[] = [];
    const currentDate = new Date(startDate);
    const today = new Date();
    
    while (currentDate <= endDate) {
      const dateStr = this.formatDate(currentDate);
      const eventosDia = this.getEventosForDate(dateStr);
      
      const day: CalendarDay = {
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: this.isSameDay(currentDate, today),
        isSelected: this.selectedDay ? this.isSameDay(currentDate, this.selectedDay.date) : false,
        eventos: eventosDia,
        totalEventos: eventosDia.length,
        ingresosDia: this.calculateDayIngresos(eventosDia)
      };
      
      days.push(day);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    this.calendarDays = days;
  }

  private getEventosForDate(dateStr: string): EventoCalendario[] {
    if (!this.calendarioData?.eventos_por_dia) return [];
    
    const eventoDelDia = this.calendarioData.eventos_por_dia.find(
      evento => evento.fecha === dateStr
    );
    
    return eventoDelDia?.eventos || [];
  }

  private calculateDayIngresos(eventos: EventoCalendario[]): number {
    return eventos.reduce((total, evento) => {
      if (evento.precio) {
        return total + parseFloat(evento.precio.toString());
      }
      return total;
    }, 0);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  selectDay(day: CalendarDay): void {
    // Update selection state
    this.calendarDays.forEach(d => d.isSelected = false);
    day.isSelected = true;
    this.selectedDay = day;
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.selectedDay = undefined;
    this.loadCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.selectedDay = undefined;
    this.loadCalendar();
  }

  goToToday(): void {
    const today = new Date();
    this.currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.selectedDay = undefined;
    this.loadCalendar();
    
    // After calendar is built, select today
    setTimeout(() => {
      const todayDay = this.calendarDays.find(day => day.isToday);
      if (todayDay) {
        this.selectDay(todayDay);
      }
    }, 100);
  }

  refreshData(): void {
    this.loadCalendar();
  }

  getEventoClass(evento: EventoCalendario): string {
    if (evento.tipo === 'reserva') {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    } else {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
  }

  getEventoEstadoBadge(estado: string): string {
    const classes = {
      'pendiente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'confirmado': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'confirmada': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'cancelada': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'completado': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'completada': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'activo': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }

  // Track by functions for performance
  trackByDay(index: number, day: CalendarDay): string {
    return day.date.toISOString();
  }

  trackByEvento(index: number, evento: EventoCalendario): number {
    return evento.id;
  }
}