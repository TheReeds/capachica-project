import { Routes } from '@angular/router';
import { ReservaListComponent } from './reserva-list/reserva-list.component';
import { ReservaFormComponent } from './reserva-form/reserva-form.component';
import { ReservaDetallesComponent } from './reserva-detalles/reserva-detalles.component';

export const RESERVAS_ROUTES: Routes = [
    {
      path: '',
      component: ReservaListComponent
    },
    {
      path: 'create',
      component: ReservaFormComponent
    },
    {
      path: 'edit/:id',
      component: ReservaFormComponent
    },
    {
      path: ':id/detalles',
      component: ReservaDetallesComponent
    }
];