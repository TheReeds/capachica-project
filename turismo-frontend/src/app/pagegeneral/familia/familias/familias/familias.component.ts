import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmprendedorService } from '../familias/emprendedores.service';
import { Emprendedor } from './emprendedor.model';
import { RouterModule } from '@angular/router'; 
@Component({
  selector: 'app-familias',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './familias.component.html',
  styleUrls: ['./familias.component.css']
})
export class FamiliasComponent implements OnInit {
  emprendedores: Emprendedor[] = [];

constructor(private emprendedorService: EmprendedorService) {}

cargando = true;

ngOnInit() {

  setTimeout(() => {
    this.cargando = false; // cuando termines de cargar los datos
  }, 2000);

  this.emprendedorService.getAllEmprendedores().subscribe(data => {
    this.emprendedores = data;
    console.log('Emprendedores cargados:', this.emprendedores);
  });

  
  
}

getPrimeraImagen(imagenes: string[] | undefined): string {
  if (imagenes && imagenes.length > 0) {
    return `/storage/emprendedores/${imagenes[0]}`;
  }
  return 'ruta/por-defecto.jpg'; // Puedes cambiar esta ruta por una imagen por defecto real
}

getImagenPrincipal(e: any): string {
  if (e?.sliders_principales?.length > 0) {
    return e.sliders_principales[0].url_completa;
  }

  if (e?.imagenes) {
    try {
      const imagenes = JSON.parse(e.imagenes);
      if (imagenes.length > 0) {
        return `/storage/emprendedores/${imagenes[0]}`;
      }
    } catch {
      // imagenes no es un JSON válido
    }
  }

  return 'ruta/imagen-default.jpg'; // Imagen por defecto si no hay nada
}





  
}
