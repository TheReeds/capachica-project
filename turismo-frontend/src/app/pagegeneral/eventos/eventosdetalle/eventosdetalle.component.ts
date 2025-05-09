import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento, EventosService } from '../evento.service';


@Component({
  selector: 'app-detallefamilias', // Asegúrate que este selector sea único y correcto
  templateUrl: './detallefamilias.component.html',
  styleUrls: ['./detallefamilias.component.css'] // Puedes crear este archivo CSS si necesitas estilos específicos
})
export class DetallefamiliasComponent implements OnInit {

  evento: Evento | undefined;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Para posible redirección si el evento no se encuentra
    private eventosService: EventosService
  ) { }

  ngOnInit(): void {
    // Obtener el ID del evento de los parámetros de la ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const eventoId = +idParam; // El '+' convierte el string a número
      if (!isNaN(eventoId)) {
        this.cargarDetalleEvento(eventoId);
      } else {
        this.showErrorAndRedirect('ID de evento inválido.');
      }
    } else {
      this.showErrorAndRedirect('No se proporcionó ID de evento.');
    }
  }

  cargarDetalleEvento(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    // Simula una pequeña demora como si fuera una llamada API real
    setTimeout(() => {
      this.evento = this.eventosService.getEventoById(id);
      this.isLoading = false;
      if (!this.evento) {
        this.errorMessage = 'Evento no encontrado.';
        // Opcionalmente, redirigir después de un tiempo
        // setTimeout(() => this.router.navigate(['/eventos']), 3000);
      }
    }, 500); // Simulación de carga
  }

  private showErrorAndRedirect(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    console.error(message);
    // Opcionalmente, redirigir al usuario a la página de listado de eventos
    // setTimeout(() => this.router.navigate(['/eventos']), 3000);
  }

  regresarAListado(): void {
    this.router.navigate(['/eventos']);
  }
}
