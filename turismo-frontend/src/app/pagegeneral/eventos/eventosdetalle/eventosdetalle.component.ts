import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento, EventosService } from '../evento.service';

@Component({
  selector: 'app-eventosdetalle',  // Cambiado para que sea acorde
  templateUrl: './eventosdetalle.component.html',  // Cambiado para que coincida con el nuevo nombre
  styleUrls: ['./eventosdetalle.component.css']  // Cambiado para que coincida con el nuevo nombre
})
export class EventosdetalleComponent implements OnInit {

  evento: Evento | undefined;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventosService: EventosService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const eventoId = +idParam;
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
    setTimeout(() => {
      this.evento = this.eventosService.getEventoById(id);
      this.isLoading = false;
      if (!this.evento) {
        this.errorMessage = 'Evento no encontrado.';
      }
    }, 500);
  }

  private showErrorAndRedirect(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    console.error(message);
  }

  regresarAListado(): void {
    this.router.navigate(['/eventos']);
  }
}
