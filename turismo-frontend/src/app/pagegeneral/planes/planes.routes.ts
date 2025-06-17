import { Routes } from '@angular/router';
import { PlanesDetalleComponent } from './planesdetalle/planes-detalle.component';
import { PlanesComponent } from './planes.component';

export const PLANES_GENERAL_ROUTES: Routes = [
  {
    path: '',
    component: PlanesComponent,
    title: 'Eventos'
  },
  {
    path: 'plandetalle/:id',
    component: PlanesDetalleComponent,
    title: 'Detalle del plan'
  },

];
