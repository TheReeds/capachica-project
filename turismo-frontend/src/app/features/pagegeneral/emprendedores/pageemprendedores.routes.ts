
import { Routes } from '@angular/router';
import { PageemprendedoresComponent } from './pageemprendedores.component';

export const PAGEEMPRENDEDORES_ROUTES: Routes = [
  {
    path: '',
    component: PageemprendedoresComponent,
    title: 'Pagina de Emprendedores'
  }
];

// Para exportación fácil de los componentes
export * from './pageemprendedores.component';