import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiciosService } from './servicios.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})


export class ServiciosComponent implements OnInit {
  servicios: any[] = [];
  categorias: any[] = [];
  serviciosFiltrados: any[] = [];
  emprendedorSeleccionado: any = null;
  municipalidad: any = null;

  // ✅ NUEVO: estructura para agrupar por nombre de categoria_servicio
  serviciosAgrupadosPorCategoria: { [categoria: string]: any[] } = {};

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.cargarMunicipalidad();
    this.cargarServicios();
    this.cargarCategorias();
  }

  cargarMunicipalidad() {
    this.serviciosService.obtenerMunicipalidad().subscribe((res: any) => {
      this.municipalidad = res.data ?? res;

      // ✅ Solución: forzar sliders_principales a array si es objeto
      const sliders = this.municipalidad?.sliders_principales;
      if (sliders && !Array.isArray(sliders)) {
        this.municipalidad.sliders_principales = [sliders];
      }

      console.log('✔ Sliders corregidos:', this.municipalidad.sliders_principales);
    });
  }

  cargarServicios() {
    this.serviciosService.obtenerServicios().subscribe((res: any) => {
      this.servicios = res.data;
      this.serviciosFiltrados = this.servicios;

      // ✅ Agrupamos servicios por categoria_servicio.nombre
      this.serviciosAgrupadosPorCategoria = {};
      for (const servicio of this.servicios) {
        const categoriaNombre = servicio.categoria_servicio?.nombre || 'Sin categoría';
        if (!this.serviciosAgrupadosPorCategoria[categoriaNombre]) {
          this.serviciosAgrupadosPorCategoria[categoriaNombre] = [];
        }
        this.serviciosAgrupadosPorCategoria[categoriaNombre].push(servicio);
      }

      console.log('✔ Servicios agrupados:', this.serviciosAgrupadosPorCategoria);
    });
  }

  cargarCategorias() {
    this.serviciosService.obtenerCategorias().subscribe((res: any) => {
      this.categorias = res.data ?? res;
  
      // ✅ Si no es un array, lo corregimos
      if (!Array.isArray(this.categorias)) {
        console.error('❌ categorias no es un arreglo:', this.categorias);
        this.categorias = [];
      }
    });
  }
  

  categoriaSeleccionada: string = '';

  filtrarPorCategoria(categoriaId: number): void {
    // 🔍 Buscar categoría por ID
    const categoria = this.categorias.find((c: any) => c?.id === categoriaId);
  
    // ✅ Validación defensiva
    if (!categoria) {
      console.warn(`⚠️ Categoría con ID ${categoriaId} no encontrada.`);
      this.categoriaSeleccionada = '';
      this.serviciosFiltrados = [];
      return;
    }
  
    // ✅ Seteamos nombre seleccionado
    this.categoriaSeleccionada = categoria.nombre;
  
    // 🔎 Filtramos los servicios por esa categoría
    this.serviciosFiltrados = this.servicios.filter(servicio =>
      Array.isArray(servicio.categorias) &&
      servicio.categorias.some((cat: any) => cat?.id === categoriaId)
    );
  }
  

  abrirDetalleEmprendedor(servicio: any): void {
    this.emprendedorSeleccionado = servicio;
  }

  cerrarDetalleEmprendedor(): void {
    this.emprendedorSeleccionado = null;
  }
  
  
}
