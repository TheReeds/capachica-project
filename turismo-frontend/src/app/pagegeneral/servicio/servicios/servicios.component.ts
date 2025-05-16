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
  categorias: any[] = [];
  categoriaSeleccionada: string = '';
  emprendedorSeleccionado: any = null;
  municipalidad: any = null;

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.cargarMunicipalidad();
    this.cargarCategorias();
  }

  cargarMunicipalidad() {
    this.serviciosService.obtenerMunicipalidad().subscribe((res: any) => {
      this.municipalidad = res.data ?? res;

      const sliders = this.municipalidad?.sliders_principales;
      if (sliders && !Array.isArray(sliders)) {
        this.municipalidad.sliders_principales = [sliders];
      }

      console.log('✔ Sliders corregidos:', this.municipalidad.sliders_principales);
    });
  }

  cargarCategorias() {
    this.serviciosService.obtenerCategorias().subscribe((res: any) => {
      const data = res.data ?? res;
      const categorias = Array.isArray(data) ? data : [data];

      // Aseguramos que cada categoría tenga imágenes (o al menos una por defecto)
      this.categorias = categorias.map(categoria => ({
        ...categoria,
        imagenes: categoria.imagenes && categoria.imagenes.length
          ? categoria.imagenes
          : [
              'https://turismocapachica.wordpress.com/files/2009/11/tiko.jpg',
              'https://turismocapachica.wordpress.com/files/2009/11/tiko.jpg',
              'https://turismocapachica.wordpress.com/files/2009/11/tiko.jpg',
              'https://turismocapachica.wordpress.com/files/2009/11/tiko.jpg'
            ]
      }));

      console.log('✔ Categorías procesadas:', this.categorias);
    });
  }

  abrirDetalleEmprendedor(servicio: any): void {
    this.emprendedorSeleccionado = servicio;
  }

  cerrarDetalleEmprendedor(): void {
    this.emprendedorSeleccionado = null;
  }

  obtenerEmoji(nombre: string): string {
    const lower = nombre.toLowerCase();
    if (lower.includes('alojamiento')) return '🛏️';
    if (lower.includes('actividades')) return '🎯';
    if (lower.includes('alimentación')) return '🍽️';
    if (lower.includes('artesanía')) return '🎨';
    if (lower.includes('transporte')) return '🚗';
    if (lower.includes('guiado')) return '🧭';
    return '🌐';
  }

  obtenerColorBorde(nombre: string): any {
    const lower = nombre.toLowerCase();
    return {
      'border-orange-400 dark:border-orange-500': lower.includes('alojamiento'),
      'border-blue-400 dark:border-blue-500': lower.includes('actividades'),
      'border-green-400 dark:border-green-500': lower.includes('alimentación'),
      'border-pink-400 dark:border-pink-500': lower.includes('artesanía'),
      'border-purple-400 dark:border-purple-500': lower.includes('transporte'),
      'border-yellow-400 dark:border-yellow-500': lower.includes('guiado'),
      'border-gray-300 dark:border-gray-600': true
    };
  }

  obtenerColorTexto(nombre: string): any {
    const lower = nombre.toLowerCase();
    return {
      'text-orange-600 dark:text-orange-400': lower.includes('alojamiento'),
      'text-blue-600 dark:text-blue-400': lower.includes('actividades'),
      'text-green-600 dark:text-green-400': lower.includes('alimentación'),
      'text-pink-600 dark:text-pink-400': lower.includes('artesanía'),
      'text-purple-600 dark:text-purple-400': lower.includes('transporte'),
      'text-yellow-600 dark:text-yellow-400': lower.includes('guiado'),
      'text-gray-600 dark:text-gray-300': true
    };
  }
}
