import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { EmprendedorService } from './emprendedores.service';
import { ServicioService } from './servicios.service';
import { Servicio } from './servicio.model';
import { Emprendedor } from './emprendedor.model';

import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { Navigation, Pagination } from 'swiper/modules';

Swiper.use([Navigation, Pagination]);

@Component({
  selector: 'app-detallefamilias',
  templateUrl: './detallefamilias.component.html',
  styleUrls: ['./detallefamilias.component.css'],
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
    // Captura el ID de la URL
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id')); // Convierte el ID a número
      this.cargarEmprendedor();
      this.cargarServicios();
    });
  }

  cargarEmprendedor() {
    // Llama al servicio para obtener el emprendedor por ID
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
    // Llama al servicio para obtener los servicios filtrados por el emprendedor
    this.servicioService.obtenerServicios().subscribe((data: Servicio[]) => {
      this.servicios = data.filter(s => s.emprendedor_id === this.id);
    });
  }

  getImagenesSecundarias(): string[] {
    // Devuelve las imágenes secundarias si existen
    return this.emprendedor?.sliders_secundarios?.map(s => s.url_completa) || [];
  }

  getImagenesPrincipal(): string[] {
    // Devuelve las imágenes principales si existen
    return this.emprendedor?.sliders_principales?.map(s => s.url_completa) || [];
  }

  ngAfterViewInit() {
    // Inicializa Swiper para el carrusel de imágenes
    new Swiper('.mySwiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }
}
