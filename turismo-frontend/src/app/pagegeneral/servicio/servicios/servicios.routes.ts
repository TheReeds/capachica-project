import { Routes } from '@angular/router';
import { ServiciosComponent } from './servicios.component';
import { AlojamientoComponent } from '../alojamiento/alojamiento.component';

export const SERVICIOS_ROUTES: Routes = [
  
  {
    path: '',
    loadComponent: () => import('./servicios.component').then(m => m.ServiciosComponent)
  },
  {
    path: 'alojamiento',
    loadComponent: () => import('../alojamiento/alojamiento.component').then(m => m.AlojamientoComponent)
  },
  {
    path: 'actividades',
    loadComponent: () => import('../actividades/actividades.component').then(m => m.ActividadesComponent)
  },
  {
    path: 'alimentacion',
    loadComponent: () => import('../alimentacion/alimentacion.component').then(m => m.AlimentacionComponent)
  },
  {
    path: 'artesania',
    loadComponent: () => import('../artesania/artesania.component').then(m => m.ArtesaniaComponent)
  },
  {
    path: 'transporte',
    loadComponent: () => import('../transporte/transporte.component').then(m => m.TransporteComponent)
  },
  {
    path: 'guiado',
    loadComponent: () => import('../guiado/guiado.component').then(m => m.GuiadoComponent)
  }
];
