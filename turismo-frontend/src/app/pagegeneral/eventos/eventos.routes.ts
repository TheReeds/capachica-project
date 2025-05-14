import { Routes } from '@angular/router';
import { EventosComponent } from './eventos.component';
import { DetallefamiliasComponent } from '../pagegeneral.routes';

export const EVENTOS_ROUTES: Routes = [
  {
    path: '',
    component: EventosComponent,
    title: 'Eventos'
  },
  {
    path: 'eventosdetalle/:id',
    component: DetallefamiliasComponent,
    title: 'Detalle de Evento'
  },
];
