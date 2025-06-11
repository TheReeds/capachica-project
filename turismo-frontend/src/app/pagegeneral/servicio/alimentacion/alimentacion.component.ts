import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../servicios/servicios.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alimentacion',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ Agrega aquí CommonModule
  templateUrl: './alimentacion.component.html',
  styleUrls: ['./alimentacion.component.css']
})
export class AlimentacionComponent implements OnInit {

  alimentaciones: any[] = [];

  // Modal
  selectedServicio: any = null;
  mostrarModal = false;
  horarioSeleccionado: any = null;

  // Paquete (carrito)
  paquete: any[] = [];

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  private cargarServicios(): void {
    this.serviciosService.obtenerServicios().subscribe((res: any) => {
      const todos = res?.data?.data ?? [];

      this.alimentaciones = todos
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
