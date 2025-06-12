/**
 * Nombre del archivo: reportes.routes.ts
 *
 * Propósito: Definir las rutas para los diferentes componentes de reportes en el módulo correspondiente.
 *
 * Autor: Eliazar Noa Llascanoa
 *
 * Fecha de creación: 01-06-2025
 */

import { Routes } from '@angular/router';

import { ReporteEmprendedoresComponent } from './reporte-emprendedoress/reporte-emprendedores.component';
import { ReporteAsociacionesComponent } from './reporte-asociaciones/reporte-asociaciones.component';
import { ReporteLugaresComponent } from './reporte-lugares/reporte-lugares.component';

/**
 * Arreglo de rutas para la sección de reportes.
 * Cada ruta está asociada a un componente específico encargado de renderizar el contenido correspondiente.
 */
export const REPORTES_ROUTES: Routes = [
  {
    path: 'emprendedores', // Muestra el reporte de emprendedores
    component: ReporteEmprendedoresComponent
  },
  {
    path: 'asociaciones', // Muestra el reporte de asociaciones
    component: ReporteAsociacionesComponent
  },
  {
    path: 'lugares', // Muestra el reporte de lugares turísticos
    component: ReporteLugaresComponent
  }
];
