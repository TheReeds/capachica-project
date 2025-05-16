import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { Evento, EventosService } from './evento.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CalendarEvent, CalendarModule, CalendarUtils, DateAdapter } from 'angular-calendar';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule,

 CalendarModule

  ],
  providers: [CalendarUtils],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventos: Evento[] = [];
   viewDate: Date = new Date();

  calendarEvents: CalendarEvent[] = [];
  eventoDestacado: Evento | undefined; // Para el evento principal en la cabecera

  constructor(private eventosService: EventosService) { }

  ngOnInit(): void {
    this.cargarEventos();


      // Simula JSON de eventos
    const eventosJson = [
      { id: 1, titulo: 'Evento 1', fecha: '2025-05-15' },
      { id: 2, titulo: 'Evento 2', fecha: '2025-05-18' },
      { id: 3, titulo: 'Evento 3', fecha: '2025-05-20' }
    ];

    this.calendarEvents = eventosJson.map(e => ({
      start: new Date(e.fecha),
      title: e.titulo,
      allDay: true
    }));

  }
openCalendar(){
  console.log("=====");
}
 cargarEventos(): void {
    this.eventos = this.eventosService.getEventos();
    if (this.eventos.length > 0) {
      this.eventoDestacado = this.eventos.find(e => e.id === 1) || this.eventos[0];
    }
  }
  toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
}
mostrarModalCalendario = false;

}
