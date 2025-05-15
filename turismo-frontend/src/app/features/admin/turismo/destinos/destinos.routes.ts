import { Routes } from '@angular/router';
import { DestinoListComponent } from './destino-list/destino-list.component';
import { DestinoFormComponent } from './destino-form/destino-form.component';
import { DestinoDetalleComponent } from './destino-detalle/destino-detalle.component';
import { DestinoActividadesComponent } from './destino-actividades/destino-actividades.component';

export const DESTINOS_ROUTES: Routes = [
  {
    path: '',
    component: DestinoListComponent
  },
  {
    path: 'create',
    component: DestinoFormComponent
  },
  {
    path: 'edit/:id',
    component: DestinoFormComponent
  },
  {
    path: ':id/detalle',
    component: DestinoDetalleComponent
  },
  {
    path: ':id/actividades',
    component: DestinoActividadesComponent
  }
];
