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
<<<<<<< HEAD
export class PlanesComponent {
=======
export class ContactosComponent {
  constructor(private router: Router) {}
>>>>>>> 7a8e4ea488c5a5e7b154995835e3e7b713725430

  seleccionarTour(familia: string) {
    console.log('Tour seleccionado:', familia);
    this.router.navigate(['/reservas', familia])
      .then(() => {
        console.log('Navegación exitosa a reservas de familia:', familia);
      })
      .catch(error => {
        console.error('Error en la navegación:', error);
        // Fallback a navegación directa si falla el router
        window.location.href = `/reservas/${familia}`;
      });
  }
}
