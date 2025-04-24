
import { Routes } from '@angular/router';
import { EmprendedoresComponent } from './emprendedores.component';

export const EMPRENDEDORES_ROUTES: Routes = [
  {
    path: '',
    component: EmprendedoresComponent,
    title: 'Emprendedores'
  }
];

// Para exportación fácil de los componentes
export * from './emprendedores.component';