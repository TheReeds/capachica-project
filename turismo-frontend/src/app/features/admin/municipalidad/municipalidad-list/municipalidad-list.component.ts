import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { AdminLayoutComponent } from '../../../../shared/layouts/admin-layout/admin-layout.component';
import { Permission } from '../../../../core/models/user.model';
import { Municipalidad, MunicipalidadService } from '../../../../core/services/municipalidad.service';

@Component({
    selector: 'app-permission-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './municipalidad-list.component.html'

})
export class MunicipalidadListComponent implements OnInit {
    municipalidades = signal<Municipalidad[]>([]);
    
  loading = signal<boolean>(true);

  constructor(private municipalidadService: MunicipalidadService) {}

  ngOnInit(): void {
    this.loadMunicipalidades();
  }

  loadMunicipalidades(): void {
    this.loading.set(true);
  
    this.municipalidadService.getAll().subscribe({
      next: (municipalidades) => {
        console.log('Datos cargados:', municipalidades);
        this.municipalidades.set(municipalidades);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar municipalidades:', error);
        this.loading.set(false);
      }
    });
  
  }

}