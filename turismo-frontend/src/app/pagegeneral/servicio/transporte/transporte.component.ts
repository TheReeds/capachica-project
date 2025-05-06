import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServiciosService } from '../servicios/servicios.service';

@Component({
  selector: 'app-transporte',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './transporte.component.html',
  styleUrls: ['./transporte.component.css']
})
export class TransporteComponent implements OnInit {
  transportes: any[] = [];

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.serviciosService.obtenerServicios().subscribe((res: any) => {
      const todos = res?.data?.data ?? [];

      this.transportes = todos
        .filter((servicio: any) =>
          servicio.categorias?.some((cat: any) => cat.id === 4)
        )
        .map((servicio: any) => {
          let imagenPrincipal = 'default.jpg';

          try {
            const imagenes = JSON.parse(servicio.emprendedor?.imagenes || '[]');
            if (imagenes.length > 0) {
              imagenPrincipal = imagenes[0];
            }
          } catch (error) {
            console.warn('Error al parsear imágenes:', error);
          }

          return {
            ...servicio,
            imagenPrincipal,
          };
        });
    });
  }
}

