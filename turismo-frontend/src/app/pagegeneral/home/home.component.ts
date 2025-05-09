import { Component, OnInit, inject, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeService } from './home.service';
import { Home, HomeDTO, Reserva, ReservaDTO, Municipalidad } from './home.model';
import { PaginatedResponse } from '../../core/services/admin.service';
import { ThemeService } from '../../core/services/theme.service';
import { Router } from '@angular/router';

declare var Swiper: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit {
  private homeService = inject(HomeService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  homes: Home[] = [];
  reservas: Reserva[] = [];
  municipalidad: Municipalidad | null = null;
  paginacion: PaginatedResponse<Home> | null = null;
  loading = true;
  currentPage = 1;
  searchTerm = '';
  selectedEmprendedor: Home | null = null;
  categorias: any[] = [];
  isDropdownOpen: boolean = false;
  swiperInitialized = false;

  // Año actual para el footer
  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.loadEmprendedores();
    this.loadReservas();
    this.loadCategorias();

    this.homeService.getMunicipalidad().subscribe({
      next: (response) => {
        this.municipalidad = response; // 👈 aquí el fix
      },
      error: (err) => console.error('Error cargando municipalidad', err)
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initSwiper();
    }, 500);
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
        const swiper = new Swiper('.swiper-container', {
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
