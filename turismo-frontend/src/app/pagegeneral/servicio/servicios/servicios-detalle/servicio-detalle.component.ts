import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TurismoService } from '../../../../core/services/turismo.service';
import { UbicacionMapComponent } from '../../../../shared/components/ubicacion-map/ubicacion-map.component';
import { ServicioDetalle } from '../servicios.component';
import { AuthService } from '../../../../core/services/auth.service';
import { CarritoService, CarritoItem } from '../../../../core/services/carrito.service';
import { TimePickerComponent } from '../components/time-picker/time-picker.component';


@Component({
  selector: 'app-servicio-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, UbicacionMapComponent,TimePickerComponent],
  templateUrl: './servicio-detalle.component.html',
  styleUrls: ['./servicio-detalle.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class ServicioDetalleComponent implements OnInit, OnDestroy {
  private turismoService = inject(TurismoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private carritoService = inject(CarritoService);
  private destroy$ = new Subject<void>();

  // Signals
  servicio = signal<ServicioDetalle | null>(null);
  serviciosRelacionados = signal<ServicioDetalle[]>([]);
  cargando = signal<boolean>(false);
  error = signal<boolean>(false);
  imagenIndex = signal<number>(0);
  verificandoDisponibilidad = signal<boolean>(false);
  agregandoAlCarrito = signal<boolean>(false);
  mensajeCarrito = signal<string>('');
  tipoMensajeCarrito = signal<'success' | 'error' | null>(null);

  // Estados para verificación de disponibilidad
  mostrarCalendario = false;
  fechaConsulta = '';
  horaInicio = '';
  horaFin = '';
  resultadoDisponibilidad: boolean | null = null;
  fechaMinima = '';
  fechaSeleccionada: Date | null = null;

  // Variables para el calendario
  fechaActual = new Date();
  mesActual = this.fechaActual.toLocaleString('es-ES', { month: 'long' });
  anioActual = this.fechaActual.getFullYear();
  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  diasCalendario: Date[] = [];

  ngOnInit() {
    this.fechaMinima = new Date().toISOString().split('T')[0];
    this.actualizarCalendario();

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = +params['id'];
        if (id) {
          this.cargarServicio(id);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los datos del servicio desde el API
   * @param id ID del servicio a cargar
   */
  private async cargarServicio(id: number) {
    this.cargando.set(true);
    this.error.set(false);
    this.resultadoDisponibilidad = null;

    try {
      const servicio = await this.turismoService.getServicio(id).toPromise();

      if (servicio) {
        const servicioTransformado = this.transformarServicio(servicio);
        this.servicio.set(servicioTransformado);
        this.imagenIndex.set(0);
        await this.cargarServiciosRelacionados(servicioTransformado);
      } else {
        this.error.set(true);
      }
    } catch (error) {
      console.error('Error al cargar servicio:', error);
      this.error.set(true);
    } finally {
      this.cargando.set(false);
    }
  }

  /**
   * Transforma los datos del servicio desde el API al modelo interno
   * @param servicio Datos del servicio desde el API
   * @returns Objeto ServicioDetalle transformado
   */
  private transformarServicio(servicio: any): ServicioDetalle {
    return {
      id: servicio.id || 0,
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio_referencial: servicio.precio_referencial ? parseFloat(servicio.precio_referencial.toString()) : undefined,
      emprendedor_id: servicio.emprendedor_id,
      estado: servicio.estado,
      capacidad: servicio.capacidad,
      latitud: servicio.latitud ? parseFloat(servicio.latitud.toString()) : undefined,
      longitud: servicio.longitud ? parseFloat(servicio.longitud.toString()) : undefined,
      ubicacion_referencia: servicio.ubicacion_referencia,
      emprendedor: servicio.emprendedor ? {
        id: servicio.emprendedor.id || 0,
        nombre: servicio.emprendedor.nombre,
        tipo_servicio: servicio.emprendedor.tipo_servicio,
        telefono: servicio.emprendedor.telefono,
        email: servicio.emprendedor.email,
        ubicacion: servicio.emprendedor.ubicacion,
        precio_rango: servicio.emprendedor.precio_rango,
        categoria: servicio.emprendedor.categoria
      } : undefined,
      categorias: servicio.categorias?.map((cat: any) => ({
        id: cat.id || 0,
        nombre: cat.nombre,
        descripcion: cat.descripcion,
        icono_url: cat.icono_url
      })),
      horarios: servicio.horarios?.map((horario: any) => ({
        id: horario.id || 0,
        dia_semana: horario.dia_semana,
        hora_inicio: horario.hora_inicio,
        hora_fin: horario.hora_fin,
        activo: horario.activo || false
      })),
      sliders: servicio.sliders?.map((slider: any) => ({
        id: slider.id || 0,
        url: slider.url || '',
        url_completa: slider.url_completa || '',
        nombre: slider.nombre,
        orden: slider.orden
      }))
    };
  }

  /**
   * Carga servicios relacionados basados en la categoría principal
   * @param servicio Servicio del cual cargar relacionados
   */
  private async cargarServiciosRelacionados(servicio: ServicioDetalle) {
    try {
      if (servicio.categorias && servicio.categorias.length > 0) {
        const serviciosCategoria = await this.turismoService.getServiciosByCategoria(
          servicio.categorias[0].id
        ).toPromise();

        if (serviciosCategoria) {
          const relacionados = serviciosCategoria
            .filter(s => s.id !== servicio.id)
            .slice(0, 5)
            .map(s => this.transformarServicio(s));
          this.serviciosRelacionados.set(relacionados);
        }
      }
    } catch (error) {
      console.error('Error al cargar servicios relacionados:', error);
    }
  }

  /**
   * Actualiza el calendario con los días del mes actual y adyacentes
   */
  actualizarCalendario() {
  const fecha = new Date(this.fechaActual);
  this.mesActual = fecha.toLocaleDateString('es-ES', { month: 'long' });
  this.anioActual = fecha.getFullYear();  // Usar getFullYear() en lugar de getUTCFullYear()

  // Primer y último día del mes actual (sin UTC)
  const primerDiaMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  const ultimoDiaMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

  // Días de la semana (0=domingo, 1=lunes, etc.)
  const primerDiaSemana = primerDiaMes.getDay(); 
  const ultimoDiaSemana = ultimoDiaMes.getDay();

  const diasMostrar: Date[] = [];

  // 1. Agregar días del mes anterior (para completar la primera semana)
  if (primerDiaSemana !== 0) { // Si el primer día no es domingo
    const ultimoDiaMesAnterior = new Date(fecha.getFullYear(), fecha.getMonth(), 0).getDate();
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      diasMostrar.push(new Date(fecha.getFullYear(), fecha.getMonth() - 1, ultimoDiaMesAnterior - i));
    }
  }

  // 2. Agregar días del mes actual
  for (let i = 1; i <= ultimoDiaMes.getDate(); i++) {
    diasMostrar.push(new Date(fecha.getFullYear(), fecha.getMonth(), i));
  }

  // 3. Agregar días del mes siguiente (para completar la última semana)
  const diasRestantes = 6 - ultimoDiaSemana;
  for (let i = 1; i <= diasRestantes; i++) {
    diasMostrar.push(new Date(fecha.getFullYear(), fecha.getMonth() + 1, i));
  }

  this.diasCalendario = diasMostrar;
}

  /**
   * Navega al mes anterior en el calendario
   */
  mesAnterior() {
    this.fechaActual = new Date(
      this.fechaActual.getFullYear(),
      this.fechaActual.getMonth() - 1,
      1
    );
    this.actualizarCalendario();
  }

  /**
   * Navega al mes siguiente en el calendario
   */
  mesSiguiente() {
    this.fechaActual = new Date(
      this.fechaActual.getFullYear(),
      this.fechaActual.getMonth() + 1,
      1
    );
    this.actualizarCalendario();
  }

  /**
   * Determina las clases CSS para un día del calendario
   * @param dia Fecha a evaluar
   * @returns Cadena de clases CSS
   */
  getClaseDia(dia: Date): string {
    const hoyUTC = new Date();
    hoyUTC.setUTCHours(0, 0, 0, 0);
    const esHoy = dia.toDateString() === hoyUTC.toDateString();
    const esMesActual = dia.getMonth() === this.fechaActual.getMonth();
    const esPasado = dia < hoyUTC && !esHoy;
    const esSeleccionado = this.fechaSeleccionada?.toDateString() === dia.toDateString();
    const esDisponible = this.diaDisponible(dia);
    const diaUTC = new Date(Date.UTC(dia.getFullYear(), dia.getMonth(), dia.getDate()));
    
    let clases = 'cursor-pointer p-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-110 ';
    
    if (esPasado) {
      clases += 'text-gray-300 cursor-not-allowed hover:scale-100';
    } else if (esSeleccionado) {
      clases += 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg';
    } else if (esHoy) {
      clases += 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200';
    } else if (esMesActual && esDisponible) {
      clases += 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30';
    } else if (esMesActual && !esDisponible) {
      clases += 'text-gray-400 line-through cursor-not-allowed';
    } else {
      clases += 'text-gray-400 hover:text-gray-600';
    }
    
    return clases;
  }

  /**
   * Verifica si un día está disponible según los horarios del servicio
   * @param dia Fecha a verificar
   * @returns true si el día está disponible
   */
  diaDisponible(dia: Date): boolean {
  if (!this.servicio()?.horarios) return false;

  const diaSemana = dia.getDay(); // <-- Usar getDay() local
  const diasMap: {[key: number]: string} = {
    0: 'domingo', 1: 'lunes', 2: 'martes', 3: 'miercoles',
    4: 'jueves', 5: 'viernes', 6: 'sabado'
  };

  const diaNombre = diasMap[diaSemana];
  return this.servicio()!.horarios!.some(h => 
    h.dia_semana.toLowerCase() === diaNombre && h.activo
  );
}
getDiaSeleccionadoFormateado(): string {
  if (!this.fechaSeleccionada) return '';

  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diaSemana = this.fechaSeleccionada.getDay(); // <-- Local
  const fechaFormateada = this.fechaSeleccionada.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `${dias[diaSemana]}, ${fechaFormateada}`;
}  /**
   * Selecciona una fecha en el calendario
   * @param dia Fecha seleccionada
   */
  seleccionarFecha(dia: Date) {
  // Usar fecha local (sin UTC)
  const diaLocal = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate());

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (diaLocal < hoy && diaLocal.toDateString() !== hoy.toDateString()) {
    return; // No permitir fechas pasadas
  }

  if (!this.diaDisponible(diaLocal)) {
    return; // No permitir días no disponibles
  }

  this.fechaSeleccionada = diaLocal;
  this.fechaConsulta = diaLocal.toISOString().split('T')[0]; // Guardar como ISO para el backend
  this.mostrarCalendario = false;
  this.resultadoDisponibilidad = null;

  console.log('Fecha seleccionada (local):', diaLocal);
  console.log('Día de la semana (local):', diaLocal.getDay()); // 0=domingo, 6=sábado
}

  /**
   * Alterna la visibilidad del calendario
   */
  toggleCalendario() {
    this.mostrarCalendario = !this.mostrarCalendario;
    if (this.mostrarCalendario) {
      this.actualizarCalendario();
    }
  }

  /**
   * Genera horas disponibles para selección
   * @param horaMinima Hora mínima a partir de la cual generar opciones
   * @returns Array de horas disponibles formateadas
   */
  generarHorasDisponibles(horaMinima?: string): string[] {
    const horas: string[] = [];
    for (let i = 8; i <= 20; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hora = `${i.toString().padStart(2, '0')}:${j.toString().padStart(2, '0')}`;
        if (!horaMinima || hora > horaMinima) {
          horas.push(hora);
        }
      }
    }
    return horas;
  }

  /**
   * Verifica la disponibilidad del servicio para la fecha y hora seleccionadas
   */
  async verificarDisponibilidad() {
    if (!this.fechaConsulta || !this.horaInicio || !this.horaFin || !this.servicio()) {
      return;
    }

    this.verificandoDisponibilidad.set(true);
    this.resultadoDisponibilidad = null;

    try {
      // Verificar contra horarios del servicio
      const diaSemana = new Date(this.fechaConsulta).getDay();
      const diasMap: {[key: number]: string} = {
        0: 'domingo', 1: 'lunes', 2: 'martes', 3: 'miercoles', 
        4: 'jueves', 5: 'viernes', 6: 'sabado'
      };
      
      const diaNombre = diasMap[diaSemana];
      const horarioDia = this.servicio()?.horarios?.find(h => 
        h.dia_semana.toLowerCase() === diaNombre && h.activo
      );

      if (!horarioDia) {
        this.resultadoDisponibilidad = false;
        return;
      }

      // Verificar contra reservas existentes
      const resultado = await this.turismoService.verificarDisponibilidadServicio(
        this.servicio()!.id,
        this.fechaConsulta,
        this.horaInicio + ':00',
        this.horaFin + ':00'
      ).toPromise();

      this.resultadoDisponibilidad = resultado?.disponible || false;
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      this.resultadoDisponibilidad = false;
    } finally {
      this.verificandoDisponibilidad.set(false);
    }
  }

  /**
   * Obtiene la URL de la imagen actual a mostrar
   */
  get imagenActual(): string {
    const serv = this.servicio();
    if (serv?.sliders && serv.sliders.length > 0) {
      return serv.sliders[this.imagenIndex()].url_completa;
    }
    return '/assets/general/placeholder-service.jpg';
  }

  /**
   * Cambia a una imagen específica de la galería
   * @param index Índice de la imagen a mostrar
   */
  cambiarImagen(index: number) {
    this.imagenIndex.set(index);
  }

  /**
   * Navega a la imagen anterior en la galería
   */
  imagenAnterior() {
    const serv = this.servicio();
    if (serv?.sliders && serv.sliders.length > 0) {
      const currentIndex = this.imagenIndex();
      const newIndex = currentIndex === 0 ? serv.sliders.length - 1 : currentIndex - 1;
      this.imagenIndex.set(newIndex);
    }
  }

  /**
   * Navega a la siguiente imagen en la galería
   */
  imagenSiguiente() {
    const serv = this.servicio();
    if (serv?.sliders && serv.sliders.length > 0) {
      const currentIndex = this.imagenIndex();
      const newIndex = currentIndex === serv.sliders.length - 1 ? 0 : currentIndex + 1;
      this.imagenIndex.set(newIndex);
    }
  }

  /**
   * Agrupa y ordena los horarios del servicio por día
   * @returns Array de horarios agrupados y ordenados
   */
  obtenerHorariosAgrupados() {
    const servicio = this.servicio();
    if (!servicio?.horarios) return [];

    const diasOrden = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const horariosAgrupados = new Map<string, any>();

    servicio.horarios
      .sort((a, b) => diasOrden.indexOf(a.dia_semana) - diasOrden.indexOf(b.dia_semana))
      .forEach(horario => {
        if (!horariosAgrupados.has(horario.dia_semana)) {
          horariosAgrupados.set(horario.dia_semana, {
            ...horario,
            formateado: this.formatearRangoHorario(horario.hora_inicio, horario.hora_fin)
          });
        }
      });

    return diasOrden.map(dia => {
      return horariosAgrupados.get(dia) || {
        dia_semana: dia,
        hora_inicio: '',
        hora_fin: '',
        activo: false,
        formateado: 'Cerrado'
      };
    });
  }

  /**
   * Formatea un rango de horas
   * @param inicio Hora de inicio
   * @param fin Hora de fin
   * @returns Rango de horas formateado
   */
  formatearRangoHorario(inicio: string, fin: string): string {
    if (!inicio || !fin) return '';
    return `${this.formatearHora(inicio)} - ${this.formatearHora(fin)}`;
  }

  /**
   * Formatea un nombre de día completo
   * @param dia Nombre del día a formatear
   * @returns Nombre del día formateado
   */
  formatearDiaCompleto(dia: string): string {
    const dias: {[key: string]: string} = {
      'lunes': 'Lunes',
      'martes': 'Martes',
      'miercoles': 'Miércoles',
      'jueves': 'Jueves',
      'viernes': 'Viernes',
      'sabado': 'Sábado',
      'domingo': 'Domingo'
    };
    return dias[dia.toLowerCase()] || dia;
  }

  /**
   * Formatea una hora de 24h a 12h
   * @param hora Hora a formatear
   * @returns Hora formateada en formato 12h
   */
  formatearHora(hora: string): string {
    if (!hora) return '';

    try {
      const [horasStr, minutosStr] = hora.split(':');
      const horas = parseInt(horasStr, 10);
      const minutos = minutosStr ? parseInt(minutosStr, 10) : 0;
      
      const periodo = horas >= 12 ? 'PM' : 'AM';
      const horas12 = horas % 12 || 12;
      
      return `${horas12}:${minutos.toString().padStart(2, '0')} ${periodo}`;
    } catch (error) {
      console.error('Error al formatear hora:', error);
      return hora;
    }
  }

  /**
   * Formatea una fecha completa
   * @param fecha Fecha a formatear
   * @returns Fecha formateada
   */
  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  /**
   * Limpia el formulario de reserva
   */
  limpiarFormulario() {
    this.fechaConsulta = '';
    this.horaInicio = '';
    this.horaFin = '';
    this.fechaSeleccionada = null;
    this.resultadoDisponibilidad = null;
    this.mostrarCalendario = false;
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si el usuario está autenticado
   */
  estaAutenticado(): boolean {
    return this.authService.isLoggedIn();
  }

  /**
   * Navega a la página de login con parámetros de redirección
   */
  irAlLogin() {
    const currentUrl = this.router.url;
    this.router.navigate(['/login'], {
      queryParams: { 
        redirect: currentUrl,
        servicio: this.servicio()?.id 
      },
      state: { 
        mostrarMensaje: true 
      }
    });
  }

  /**
   * Agrega el servicio al carrito de compras
   */
 async agregarAlCarrito() {
    if (!this.estaAutenticado()) {
      this.irAlLogin();
      return;
    }

    if (!this.validarDatosCarrito()) {
      return;
    }

    this.agregandoAlCarrito.set(true);
    this.limpiarMensajesCarrito();

    try {
      const servicio = this.servicio()!;
      const duracionMinutos = this.calcularDuracionMinutos();

      const item: CarritoItem = {
        servicio_id: servicio.id,
        emprendedor_id: servicio.emprendedor_id,
        fecha_inicio: this.fechaConsulta,
        fecha_fin: this.fechaConsulta,
        hora_inicio: this.horaInicio + ':00',
        hora_fin: this.horaFin + ':00',
        duracion_minutos: duracionMinutos,
        cantidad: 1,
        notas_cliente: `Servicio: ${servicio.nombre}`,
        ...(this.imagenActual && { imagen_url: this.imagenActual }),
        ...(servicio.nombre && { nombre_servicio: servicio.nombre })
      };

      const respuesta = await this.carritoService.agregarAlCarrito(item).toPromise();

      if (respuesta?.exito) {
        this.mostrarMensajeExito('¡Servicio agregado al carrito exitosamente!');
        this.limpiarFormulario();
        // El servicio debería emitir la actualización automáticamente
      } else {
        throw new Error(respuesta?.mensaje || 'Error desconocido al agregar al carrito');
      }

    } catch (error: any) {
      console.error('Error al agregar al carrito:', error);
      this.mostrarMensajeError(error?.message || 'Error al agregar el servicio al carrito');
    } finally {
      this.agregandoAlCarrito.set(false);
    }
}

  /**
   * Valida los datos del formulario de reserva
   * @returns true si los datos son válidos
   */
  private validarDatosCarrito(): boolean {
    const errores: string[] = [];

    if (!this.fechaConsulta) {
      errores.push('Selecciona una fecha para la reserva');
    }

    if (!this.horaInicio) {
      errores.push('Selecciona una hora de inicio');
    }

    if (!this.horaFin) {
      errores.push('Selecciona una hora de fin');
    }

    if (this.resultadoDisponibilidad !== true) {
      errores.push('Primero verifica la disponibilidad del servicio');
    }

    const fechaSeleccionada = new Date(this.fechaConsulta);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
      errores.push('La fecha no puede ser anterior a hoy');
    }

    if (!this.validarHorarios()) {
      errores.push('La hora de fin debe ser posterior a la hora de inicio');
    }

    if (errores.length > 0) {
      this.mostrarMensajeError(errores.join('<br>'));
      return false;
    }

    return true;
  }

  /**
   * Valida que la hora de fin sea posterior a la de inicio
   * @returns true si los horarios son válidos
   */
  private validarHorarios(): boolean {
    try {
      const inicio = new Date(`1970-01-01T${this.horaInicio}:00`);
      const fin = new Date(`1970-01-01T${this.horaFin}:00`);
      return fin > inicio;
    } catch (error) {
      console.error('Error al validar horarios:', error);
      return false;
    }
  }

  /**
   * Calcula la duración en minutos entre hora de inicio y fin
   * @returns Duración en minutos
   */
  calcularDuracionMinutos(): number {
    if (!this.horaInicio || !this.horaFin) return 0;

    try {
      const inicio = new Date(`1970-01-01T${this.horaInicio}:00`);
      const fin = new Date(`1970-01-01T${this.horaFin}:00`);
      return Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60));
    } catch (error) {
      console.error('Error al calcular duración:', error);
      return 0;
    }
  }

  /**
   * Muestra un mensaje de éxito
   * @param mensaje Mensaje a mostrar
   */
  private mostrarMensajeExito(mensaje: string) {
    this.mensajeCarrito.set(mensaje);
    this.tipoMensajeCarrito.set('success');
    
    setTimeout(() => {
      if (this.tipoMensajeCarrito() === 'success') {
        this.limpiarMensajesCarrito();
      }
    }, 5000);
  }

  /**
   * Muestra un mensaje de error
   * @param mensaje Mensaje a mostrar
   */
  private mostrarMensajeError(mensaje: string) {
    this.mensajeCarrito.set(mensaje);
    this.tipoMensajeCarrito.set('error');
    
    setTimeout(() => {
      if (this.tipoMensajeCarrito() === 'error') {
        this.limpiarMensajesCarrito();
      }
    }, 8000);
  }

  /**
   * Limpia los mensajes del carrito
   */
  private limpiarMensajesCarrito() {
    this.mensajeCarrito.set('');
    this.tipoMensajeCarrito.set(null);
  }

  /**
   * Navega a la página del carrito
   */
  irAlCarrito() {
    this.router.navigate(['/carrito'], {
      queryParams: { 
        source: 'servicio_detalle',
        servicio_id: this.servicio()?.id 
      }
    });
  }

  /**
   * Obtiene el número total de items en el carrito
   * @returns Número total de items
   */
  getTotalItemsCarrito(): number {
    return this.carritoService.getTotalItems();
  }

  /**
   * Navega de vuelta a la lista de servicios
   */
  volverAServicios() {
    this.router.navigate(['/servicios']);
  }

  /**
   * Navega a la página de otro servicio
   * @param servicioId ID del servicio a ver
   */
  verOtroServicio(servicioId: number) {
    this.router.navigate(['/servicios', servicioId]);
  }

  /**
   * Inicia una conversación por WhatsApp con el emprendedor
   */
  contactarWhatsApp() {
    const servicio = this.servicio();
    if (servicio?.emprendedor?.telefono) {
      const telefono = servicio.emprendedor.telefono.replace(/\D/g, '');
      const nombreServicio = encodeURIComponent(servicio.nombre);
      const mensaje = `Hola, estoy interesado en el servicio "${nombreServicio}" que vi en su catálogo. ¿Podría darme más información?`;
      const url = `https://wa.me/51${telefono}?text=${mensaje}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Verifica si el dispositivo es móvil
   * @returns true si es un dispositivo móvil
   */
  esMobile(): boolean {
    return window.innerWidth < 768;
  }

  /**
   * Función trackBy para optimizar rendimiento de ngFor
   * @param index Índice del elemento
   * @param servicio Objeto servicio
   * @returns ID único del servicio
   */
  trackByServicioId(index: number, servicio: ServicioDetalle): number {
    return servicio.id;
  }
}