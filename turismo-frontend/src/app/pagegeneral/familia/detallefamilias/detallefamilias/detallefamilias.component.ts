import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Servicio } from './servicio.model'; // tu modelo
import { ServicioService } from './servicios.service'; 



@Component({
  selector: 'app-detallefamilias',
  templateUrl: './detallefamilias.component.html',
  styleUrls: ['./detallefamilias.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DetallefamiliasComponent implements OnInit {

  servicios: Servicio[] = [];

  constructor(private serviciosService: ServicioService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios() {
    this.serviciosService.obtenerServicios().subscribe((data: Servicio[]) => {
      this.servicios = data;
    });
  }
}
