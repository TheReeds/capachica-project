import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServiciosService } from '../servicios/servicios.service';
import { FormsModule } from '@angular/forms'; // necesario para [(ngModel)]

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit {
  actividades: any[] = [];
  mostrarModal: boolean = false;
  selectedActividad: any = null;
  horarioSeleccionado: any = null;

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.serviciosService.obtenerServicios().subscribe((res: any) => {
      const todos = res?.data?.data ?? [];

      this.actividades = todos
        .filter((servicio: any) =>
          servicio.categorias?.some((cat: any) => cat.id === 5)  // Solo actividades
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

  abrirModal(actividad: any): void {
    this.selectedActividad = actividad;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.selectedActividad = null;
    this.mostrarModal = false;
  }

  getMapaUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
    // Alternativa sin API key. Puedes usar Google Maps Embed API si deseas control total.
  }

  agregarAPaquete(): void {
    console.log('Agregado:', this.selectedActividad, this.horarioSeleccionado);
    // Aquí puedes hacer push a una lista o emitir un evento a otro componente
  }
}
