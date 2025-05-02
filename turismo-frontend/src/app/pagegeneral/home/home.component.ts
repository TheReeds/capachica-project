// home.component.ts
import { Component, OnInit, inject, ViewEncapsulation, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeService } from './home.service';
import { Home, HomeDTO, Reserva, ReservaDTO, Municipalidad } from './home.model';
import { PaginatedResponse } from '../../core/services/admin.service';
import { ThemeService } from '../../core/services/theme.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SwiperModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  private homeService = inject(HomeService);
  private themeService = inject(ThemeService);
  private router = inject(Router);
  
  @Inject(PLATFORM_ID) private platformId: Object;

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
    this.loadMunicipalidad();
    this.loadCategorias();
    
    // Initialize Swiper after content is loaded
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initSwiper();
      }, 500);
    }
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

  loadMunicipalidad() {
    this.homeService.getMunicipalidad().subscribe({
      next: (data) => {
        this.municipalidad = data;
      },
      error: (error) => {
        console.error('Error al cargar municipalidad:', error);
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
        
        // Prevent body scrolling when modal is open
        if (isPlatformBrowser(this.platformId)) {
          document.body.style.overflow = 'hidden';
        }
      },
      error: (error) => {
        console.error('Error al cargar detalles del emprendedor:', error);
      }
    });
  }

  closeEmprendedorDetails() {
    this.selectedEmprendedor = null;
    
    // Restore body scrolling when modal is closed
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  searchEmprendedores() {
    this.loadEmprendedores(1);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  closeDropdown(event: MouseEvent) {
    if (isPlatformBrowser(this.platformId)) {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        this.isDropdownOpen = false;
      }
    }
  }
  
  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  initSwiper() {
    if (isPlatformBrowser(this.platformId) && !this.swiperInitialized) {
      // Check if Swiper is loaded
      if (typeof Swiper !== 'undefined') {
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
      } else {
        console.warn('Swiper not loaded yet, retrying in 500ms');
        setTimeout(() => this.initSwiper(), 500);
      }
    }
  }
  
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}