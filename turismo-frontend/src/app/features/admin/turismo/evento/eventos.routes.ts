import { Routes } from '@angular/router';
import { EventoListComponent } from './evento-servicios/evento-servicios.component';
import { EventoFormComponent } from './evento-form/evento-form.component';



export const EVENTOS_ROUTES: Routes = [
  {
    path: '',
    component: EventoListComponent
  },
  {
    path: 'create',
    component: EventoFormComponent
  },
  {
    path: 'edit/:id',
    component: EventoFormComponent
  }
  
];
