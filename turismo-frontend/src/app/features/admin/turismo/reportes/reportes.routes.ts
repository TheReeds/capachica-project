import { Routes } from '@angular/router';
import { ReporteListComponent } from './reporte-list/reporte-list.component';
// import { ReporteGeneralComponent } from './reporte-general/reporte-general.component';
import { ReporteEmprendedoresComponent } from './reporte-emprendedores/reporte-emprendedores.component';
import { ReporteAsociacionesComponent } from './reporte-asociaciones/reporte-asociaciones.component';
// import { ReporteCategoriasServiciosComponent } from './reporte-categorias-servicios/reporte-categorias-servicios.component';
import { ReporteLugaresComponent } from './reporte-lugares/reporte-lugares.component';
// import { ReporteMunicipalidadesComponent } from './reporte-municipalidades/reporte-municipalidades.component';
// import { ReporteReservasComponent } from './reporte-reservas/reporte-reservas.component';
// import { ReporteVisitasComponent } from './reporte-visitas/reporte-visitas.component';
// import { ReporteExportarComponent } from './reporte-exportar/reporte-exportar.component';

export const REPORTES_ROUTES: Routes = [
  {
    path: '',
    component: ReporteListComponent
  },
  {
    path: 'emprendedores',
    component: ReporteEmprendedoresComponent
  },
  {
    path: 'asociaciones',
    component: ReporteAsociacionesComponent
  },
  {
    path: 'lugares',
    component: ReporteLugaresComponent
  },
  // {
  //   path: 'municipalidades',
  //   component: ReporteMunicipalidadesComponent
  // },
  // {
  //   path: 'reservas',
  //   component: ReporteReservasComponent
  // },
  // {
  //   path: 'visitas',
  //   component: ReporteVisitasComponent
  // },
  // {
  //   path: 'exportar',
  //   component: ReporteExportarComponent
  // }
];
