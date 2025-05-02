import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core'; 

import { EmprendedorService } from './emprendedores.service';
import { ServicioService } from './servicios.service';
import { Servicio } from './servicio.model';
import { Emprendedor } from './emprendedor.model';

@Component({
  selector: 'app-detallefamilias',
  templateUrl: './detallefamilias.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule] 
})
export class DetallefamiliasComponent implements OnInit {
  emprendedor!: Emprendedor | null;
  servicios: Servicio[] = [];
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private emprendedorService: EmprendedorService,
    private servicioService: ServicioService // nombre correcto
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.cargarEmprendedor();
      this.cargarServicios();
    });
  }
  

 

  cargarEmprendedor() {
    this.emprendedorService.getEmprendedorById(this.id).subscribe(emprendedor => {
      this.emprendedor = emprendedor;
      if (!emprendedor) {
        console.warn('Emprendedor no encontrado con ID:', this.id);
      } else {
        console.log('Emprendedor cargado:', emprendedor);
      }
    });
  }

  cargarServicios() {
    this.servicioService.obtenerServicios().subscribe((data: Servicio[]) => {
      this.servicios = data.filter(s => s.emprendedor_id === this.id);
    });
  }

  getImagenesSecundarias(): string[] {
    return this.emprendedor?.sliders_secundarios?.map(s => s.url_completa) || [];
  }
}
