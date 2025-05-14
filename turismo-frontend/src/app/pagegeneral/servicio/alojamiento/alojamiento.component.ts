import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../servicios/servicios.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alojamiento',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './alojamiento.component.html',
  styleUrls: ['./alojamiento.component.css']
})
export class AlojamientoComponent implements OnInit {
  alojamientos: any[] = [];

  // Modal
  selectedServicio: any = null;
  mostrarModal = false;
  horarioSeleccionado: any = null;

  // Paquete (carrito)
  paquete: any[] = [];

  constructor(
    private serviciosService: ServiciosService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  private cargarServicios(): void {
    this.serviciosService.obtenerServicios().subscribe((res: any) => {
      const todos = res?.data?.data ?? [];

      this.alojamientos = todos
        .filter((servicio: any) =>
          servicio.categorias?.some((cat: any) => cat.id === 1) // Solo alojamiento
        )
        .map((servicio: any) => {
          const sliderPrincipal = servicio.sliders?.find((s: any) => s.es_principal) || servicio.sliders?.[0];
          const imagenPrincipal = sliderPrincipal?.url_completa || 'assets/default.jpg';

          return {
            ...servicio,
            imagenPrincipal,
          };
        });
    });
  }

  // Modal handlers
  abrirModal(servicio: any): void {
    this.selectedServicio = servicio;
    this.horarioSeleccionado = null;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.selectedServicio = null;
    this.mostrarModal = false;
  }

  getMapaUrl(lat: string, lng: string): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  agregarAPaquete(): void {
    if (!this.horarioSeleccionado) {
      alert('Por favor selecciona un horario antes de agregar al paquete.');
      return;
    }

    const nuevoItem = {
      servicio: this.selectedServicio,
      horario: this.horarioSeleccionado
    };

    // Evitar duplicados
    const yaExiste = this.paquete.some(item =>
      item.servicio.id === nuevoItem.servicio.id &&
      item.horario === nuevoItem.horario
    );

    if (!yaExiste) {
      this.paquete.push(nuevoItem);
      console.log('✅ Servicio agregado al paquete:', nuevoItem);
    } else {
      alert('Este servicio ya ha sido agregado con ese horario.');
    }

    this.cerrarModal();
  }

  eliminarDelPaquete(item: any): void {
    this.paquete = this.paquete.filter(p =>
      !(p.servicio.id === item.servicio.id && p.horario === item.horario)
    );
  }

  toggleModalPaquete(): void {
    this.mostrarModal = !this.mostrarModal;
  }
}
