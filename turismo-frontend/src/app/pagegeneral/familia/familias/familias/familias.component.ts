import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmprendedorService } from './emprendedores.service';
import { Emprendedor } from './emprendedor.model';

@Component({
  selector: 'app-familias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './familias.component.html',
  styleUrls: ['./familias.component.css']
})
export class FamiliasComponent implements OnInit {
  private emprendedorService = inject(EmprendedorService);
  emprendedores: Emprendedor[] = [];

  ngOnInit() {
    this.cargarEmprendedores();
  }

  cargarEmprendedores() {
    this.emprendedorService.getEmprendedores().subscribe({
      next: (data) => {
        this.emprendedores = data;
      },
      error: (err) => {
        console.error('Error al cargar los emprendedores:', err);
      }
    });
  }
  
  
}
