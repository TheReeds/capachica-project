// home.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeService } from './home.service';
import { Home, HomeDTO, Reserva, ReservaDTO, Municipalidad } from './home.model';
import { PaginatedResponse } from '../../core/services/admin.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private homeService = inject(HomeService);

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

  // ✅ Año actual para el footer
  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.loadEmprendedores();
    this.loadReservas();
    this.loadMunicipalidad();

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

  viewEmprendedorDetails(id: number) {
    this.homeService.getEmprendedor(id).subscribe({
      next: (data) => {
        this.selectedEmprendedor = data;
      },
      error: (error) => {
        console.error('Error al cargar detalles del emprendedor:', error);
      }
    });
  }

  closeEmprendedorDetails() {
    this.selectedEmprendedor = null;
  }

  searchEmprendedores() {
    this.loadEmprendedores(1);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
