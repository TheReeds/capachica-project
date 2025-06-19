import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ContactosComponent {
  constructor(private router: Router) {}

  seleccionarTour(familia: string) {
    console.log('Tour seleccionado:', familia);
    this.router.navigate(['/reservas', familia])
      .then(() => {
        console.log('Navegación exitosa a reservas de familia:', familia);
      })
      .catch((error: any) => {
        console.error('Error en la navegación:', error);
        window.location.href = `/reservas/${familia}`;
      });
  }
}
