import { Routes } from '@angular/router';
import { ReporteListComponent } from './reporte-list/reporte-list.component';
import { ReporteAsociacionComponent } from './reporte-asociacion/reporte-asociacion.component';
import { ReporteDestinoComponent } from './reporte-destino/reporte-destino.component';
import { ReporteEmprendedoresComponent } from './reporte-emprendedores/reporte-emprendedores.component';
import { ReportePersonalizadoComponent } from './reporte-personalizado/reporte-personalizado.component';

export const REPORTES_ROUTES: Routes = [
  {
    path: '',
    component: ReporteListComponent
  },
  {
    path: 'asociaciones',
    component: ReporteAsociacionComponent
  },
  {
    path: 'destinos',
    component: ReporteDestinoComponent
  },
  {
    path: 'emprendedores',
    component: ReporteEmprendedoresComponent
  },
  {
    path: 'personalizado',
    component: ReportePersonalizadoComponent
  }
];
