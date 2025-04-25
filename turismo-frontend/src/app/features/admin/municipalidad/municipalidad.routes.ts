import { Routes } from '@angular/router';
import { MunicipalidadListComponent } from './municipalidad-list/municipalidad-list.component';

export const MUNICIPALIDAD_ROUTES: Routes = [
  {
    path: '',
    component: MunicipalidadListComponent,
    title: 'Municipalidad'
  }
];