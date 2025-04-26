/*import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}*/
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeService } from './home.service';
import { Home, HomeDTO, Reserva, ReservaDTO } from './home.model';

import { PaginatedResponse } from '../../core/services/admin.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  private homeService = inject(HomeService);
  

  homes: Home[] = [];
  reservas: Reserva[] = [];
  paginacion: PaginatedResponse<Home> | null = null;
  loading = true;
  currentPage = 1;
  searchTerm = '';

  ngOnInit() {
    this.loadEmprendedores();
    this.loadReservas();
  }

  loadEmprendedores(page: number = 1){
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

  loadReservas(){
    this.homeService.getReserva().subscribe({
      next: (data) => {
        //console.log("prueba");
        //console.log(data);
        this.reservas = data;
      },
      error: (error) => {
        console.error('Error al cargar emprendedores:', error);
      }
    });
  }
}
