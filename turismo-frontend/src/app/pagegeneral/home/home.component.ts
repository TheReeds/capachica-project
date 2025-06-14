import { Component, OnInit, inject, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeService } from './home.service';
import { Home, HomeDTO, Reserva, ReservaDTO, Municipalidad, Evento } from './home.model';
import { PaginatedResponse } from '../../core/services/admin.service';
import { ThemeService } from '../../core/services/theme.service';
import { Router, RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { EventoService } from '../../core/services/evento.service';

import Swiper from 'swiper';

import { Navigation, Pagination } from 'swiper/modules';

Swiper.use([Navigation, Pagination]);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit {
  private homeService = inject(HomeService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  eventos: Evento[] = [];
  eventoMasCercano: Evento | null = null;
  currentIndex: number = 0;

  
  homes: Home[] = [];
  reservas: Reserva[] = [];
  municipalidad: Municipalidad | null = null;
  evento: Event | null = null;
  paginacion: PaginatedResponse<Home> | null = null;
  loading = true;
  currentPage = 1;
  searchTerm = '';
  selectedEmprendedor: Home | null = null;
  categorias: any[] = [];
  isDropdownOpen: boolean = false;
  swiperInitialized = false;

  mostrarTodo = false;
  maxVisible = 4;



  get visibleSliders() {
    const sliders = this.municipalidad?.sliders_secundarios ?? [];
    return this.mostrarTodo ? sliders : sliders.slice(0, this.maxVisible);
  }

  get totalSliders(): number {
    return this.municipalidad?.sliders_secundarios?.length ?? 0;
  }

  get imagenHistoriacapachica(): any | null {
    return this.municipalidad?.sliders_secundarios?.find(
      slider => slider.descripcion?.titulo?.toLowerCase() === 'historia de capachica'
    ) ?? null;
  }

  get imagenHistoriafamilia(): any | null {
    return this.municipalidad?.sliders_secundarios?.find(
      slider => slider.descripcion?.titulo?.toLowerCase() === 'historias de familias'
    ) ?? null;
  }

  get slidersComunidad() {
    return this.municipalidad?.sliders_secundarios?.filter(slider =>
      slider.descripcion?.titulo?.toLowerCase().includes('comunidad')
    ) ?? [];
  }

  getImagenesmuni(): any[] {
    // Devuelve las imágenes secundarias si existen
    console.log('llega a verse');
    return this.municipalidad?.sliders_principales || [];


  }

  nextSlide() {
    if (this.currentIndex < this.getImagenesmuni().length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Vuelve al inicio
    }
  }

  // Retroceder a la imagen anterior
  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.getImagenesmuni().length - 1; // Vuelve al final
    }
  }

  // Ir a una imagen específica
  goToSlide(index: number) {
    this.currentIndex = index;
  }

  // Método para obtener la primera imagen del slider
  getSliderImage(evento: Evento): string {
    const slider = evento.sliders.find(s => s.es_principal);  // Busca el slider principal
    return slider ? slider.url_completa : '';  // Devuelve la URL completa del primer slider, o vacío si no existe
  }

  eventoProximo: any;

  cargarEventos() {
    console.log('llego hasta aqui');
    this.homeService.getEventos().subscribe({
      next: (resp: any) => {
        // Accedemos a la propiedad data dentro de la respuesta
        const eventosArray = resp.data?.data;  // Aquí manejamos data.data
        if (Array.isArray(eventosArray)) {
          this.eventos = eventosArray;  // Asignamos los eventos
          console.log('Eventos cargados:', this.eventos);
          this.encontrarEventoMasCercano();
        } else {
          console.error('La propiedad data.data no es un array:', eventosArray);
          this.eventos = [];
        }
      },
      error: (err) => {
        console.error('Error cargando eventos', err);
      }
    });
  }


  encontrarEventoMasCercano() {
    const hoy = new Date();

    // Filtrar solo los eventos que no han pasado
    const eventosFuturos = this.eventos.filter(evento => new Date(evento.fecha_inicio) >= hoy);

    // Ordenar los eventos futuros por fecha de inicio, de más cercano a más lejano
    eventosFuturos.sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime());

    // Seleccionar el primer evento, que será el más cercano
    this.eventoMasCercano = eventosFuturos[0] || null;
    console.log('Evento más cercano:', this.eventoMasCercano);
  }


  toggleMostrarTodo(galeria: HTMLElement) {
    this.mostrarTodo = !this.mostrarTodo;

    // Scroll suave solo cuando se expande
    if (this.mostrarTodo) {
      setTimeout(() => {
        galeria.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100); // pequeño delay para esperar que renderice
    }
  }

  toggleZoom(event: Event) {
  const img = event.target as HTMLImageElement;
  img.classList.toggle('zoom-active');
}

navegarImagen(direccion: 'anterior' | 'siguiente') {
  const currentIndex = this.visibleSliders.findIndex(slider => slider.url_completa === this.imagenSeleccionada);
  let nextIndex = currentIndex;

  if (direccion === 'anterior') {
    nextIndex = currentIndex === 0 ? this.visibleSliders.length - 1 : currentIndex - 1;
  } else if (direccion === 'siguiente') {
    nextIndex = currentIndex === this.visibleSliders.length - 1 ? 0 : currentIndex + 1;
  }

  this.imagenSeleccionada = this.visibleSliders[nextIndex].url_completa;
}


  // Año actual para el footer
  currentYear = new Date().getFullYear();

  imagenSeleccionada: string | null = null;

  abrirImagen(url: string) {
    this.imagenSeleccionada = url;
  }

  cerrarImagen() {
    this.imagenSeleccionada = null;
  }

  cargando = true;
  historiaCapachicaSlider?: any;

  ngOnInit() {
    this.loadEmprendedores();
    this.loadReservas();
    this.loadCategorias();

    this.cargarEventos();

    this.homeService.getMunicipalidad().subscribe({
      next: (response) => {
        this.municipalidad = response; // 👈 aquí el fix
      },
      error: (err) => console.error('Error cargando municipalidad', err)
    });

    setTimeout(() => {
      this.cargando = false; // cduando termines de cargar los datos
    }, 2000);





  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.swiperInitialized) {
        const swiper = new Swiper('.mySwiper', {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: true,  // Para que se repita infinitamente
          autoplay: {
            delay: 4000,  // Tiempo entre cada cambio de diapositiva (en milisegundos)
            disableOnInteraction: false,  // Para que no se desactive el autoplay si el usuario interactúa
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          },
        });
        this.swiperInitialized = true;
      }
    }, 100);  // Asegúrate de que el DOM esté completamente cargado
  }




  loadEmprendedores(page: number = 1) {
    this.homeService.getEmprendedores(page, 10, this.searchTerm).subscribe({
      next: (data) => {
        this.paginacion = data;
        this.homes = data.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar emprendedores:', error);
        this.loading = false;
      }
    });
  }

  loadReservas() {
    this.homeService.getReserva().subscribe({
      next: (data) => {
        this.reservas = data;
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
      }
    });
  }

  loadCategorias() {
    this.homeService.getCategorias().subscribe({
      next: (res) => {
        if (res.success) {
          this.categorias = res.data;
        }
      },
      error: (err) => {
        console.error('Error al obtener categorías', err);
      }
    });
  }

  viewEmprendedorDetails(id: number) {
    this.homeService.getEmprendedor(id).subscribe({
      next: (data) => {
        this.selectedEmprendedor = data;
        document.body.style.overflow = 'hidden';
      },
      error: (error) => {
        console.error('Error al cargar detalles del emprendedor:', error);
      }
    });
  }

  closeEmprendedorDetails() {
    this.selectedEmprendedor = null;
    document.body.style.overflow = '';
  }

  searchEmprendedores() {
    this.loadEmprendedores(1);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isDropdownOpen = false;
    }
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  initSwiper() {
    if (typeof Swiper !== 'undefined' && !this.swiperInitialized) {
      try {
        const swiper = new Swiper('.mySwiper', {  // Cambié esto de '.swiper-container' a '.mySwiper'
          loop: true,
          autoplay: {
            delay: 3500,
            disableOnInteraction: false,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          effect: 'fade',
          fadeEffect: {
            crossFade: true
          },
          speed: 1000,
        });
        this.swiperInitialized = true;
        console.log('Swiper initialized successfully');
      } catch (error) {
        console.error('Error initializing Swiper:', error);
      }
    } else {
      console.warn('Swiper not loaded yet or already initialized');
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
