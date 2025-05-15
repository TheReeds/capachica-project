import { Routes } from '@angular/router';
import { LugarListComponent } from './lugar-list/lugar-list.component';
import { LugarFormComponent } from './lugar-form/lugar-form.component';
import { LugarDetalleComponent } from './lugar-detalle/lugar-detalle.component';

export const LUGARES_TURISTICOS_ROUTES: Routes = [
  {
    path: '',
    component: LugarListComponent
  },
  {
    path: 'create',
    component: LugarFormComponent
  },
  {
    path: 'edit/:id',
    component: LugarFormComponent
  },
  {
    path: 'detail/:id',
    component: LugarDetalleComponent
  }
];
