import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../servicios/servicios.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-alojamiento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './alojamiento.component.html',
  styleUrls: ['./alojamiento.component.css']
})
export class AlojamientoComponent implements OnInit {
  alojamientos: any[] = [];

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.serviciosService.obtenerServicios().subscribe((res: any) => {
      const todos = res?.data?.data ?? [];

      this.alojamientos = todos
        .filter((servicio: any) =>
          servicio.categorias?.some((cat: any) => cat.id === 1)
        )
        .map((servicio: any) => {
          // Obtener imagen principal del slider
          let sliderPrincipal = servicio.sliders?.find((s: any) => s.es_principal) || servicio.sliders?.[0];
          let imagenPrincipal = sliderPrincipal?.url_completa || 'assets/default.jpg';

          return {
            ...servicio,
            imagenPrincipal,
          };
        });
    });
  }
}
