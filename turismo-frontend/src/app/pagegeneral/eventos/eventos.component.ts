import { Component, OnInit } from '@angular/core';
import { Evento, EventosService } from './evento.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventos: Evento[] = [];
  eventoDestacado: Evento | undefined; // Para el evento principal en la cabecera

  constructor(private eventosService: EventosService) { }

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.eventos = this.eventosService.getEventos();
    // Selecciona un evento destacado, por ejemplo, el primero o uno específico
    if (this.eventos.length > 0) {
      // Podrías tener una lógica más compleja para seleccionar el evento destacado
      this.eventoDestacado = this.eventos.find(e => e.id === 1) || this.eventos[0];
    }
  }
}
