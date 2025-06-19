import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const ADMIN_EMPRENDEDORES_ROUTES: Routes = [
  {
    path: 'seleccion-panel',
    loadComponent: () => import('./seleccion-panel/seleccion-panel.component').then(c => c.SeleccionPanelComponent),
    canActivate: [authGuard],
    title: 'Selección de Panel'
  },
  {
    path: 'mis-emprendimientos',
    loadComponent: () => import('./mis-emprendimientos/mis-emprendimientos.component').then(c => c.MisEmprendimientosComponent),
    canActivate: [authGuard],
    title: 'Mis Emprendimientos'
  },
  {
    path: 'mis-emprendimientos/:id',
    loadComponent: () => import('./mis-emprendimientos-detalle/mis-emprendimientos-detalle.component').then(c => c.MisEmprendimientoDetalleComponent),
    canActivate: [authGuard],
    title: 'Detalle de mi Emprendimiento'
  },
  {
    path: 'admin-emprendedores/emprendimiento/:id',
    loadComponent: () => import('./emprendimiento-detalle/emprendimiento-detalle.component').then(c => c.EmprendimientoDetalleComponent),
    canActivate: [authGuard],
    title: 'Detalle de Emprendimiento'
  },
  {
    path: 'admin-emprendedores/emprendimiento/:id/dashboard',
    loadComponent: () => import('./emprendimiento-dashboard/emprendimiento-dashboard.component').then(c => c.EmprendimientoDashboardComponent),
    canActivate: [authGuard],
    title: 'Dashboard del Emprendimiento'
  },
  {
    path: 'admin-emprendedores/emprendimiento/:id/servicios',
    loadComponent: () => import('./servicios-list/servicios-list.component').then(c => c.ServiciosListComponent),
    canActivate: [authGuard],
    title: 'Servicios del Emprendimiento'
  },
  {
    path: 'admin-emprendedores/emprendimiento/:id/servicio/nuevo',
    loadComponent: () => import('./servicios-form/servicio-form.component').then(c => c.ServicioFormComponent),
    canActivate: [authGuard],
    title: 'Nuevo Servicio'
  },
  {
    path: 'admin-emprendedores/emprendimiento/:id/servicio/:servicioId',
    loadComponent: () => import('./servicios-form/servicio-form.component').then(c => c.ServicioFormComponent),
    canActivate: [authGuard],
    title: 'Editar Servicio'
  },
  {
    path: 'admin-emprendedores/emprendimiento/:id/administradores',
    loadComponent: () => import('./administradores-list/administradores-list.component').then(c => c.AdministradoresListComponent),
    canActivate: [authGuard],
    title: 'Administradores del Emprendimiento'
  },
  {
    path: 'admin-emprendedores/emprendimiento/:id/reservas',
    loadComponent: () => import('./reservas-list/reservas-list.component').then(c => c.ReservasListComponent),
    canActivate: [authGuard],
    title: 'Reservas del Emprendimiento'
  },
  {
    path: 'admin-emprendedores/emprendimiento/:id/calendario',
    loadComponent: () => import('./calendario-emprendimiento/calendario-emprendimiento.component').then(c => c.CalendarioEmprendimientoComponent),
    canActivate: [authGuard],
    title: 'Calendario del Emprendimiento'
  },
  {
    path: 'admin-emprendedores/emprendimiento/:id/planes',
    loadComponent: () => import('./planes-list/planes-list.component').then(c => c.PlanesListComponent),
    canActivate: [authGuard],
    title: 'Planes del Emprendimiento'
  },
  {
    path: 'admin-emprendedores/emprendimiento/:id/estadisticas',
    loadComponent: () => import('./estadisticas-emprendimiento/estadisticas-emprendimiento.component').then(c => c.EstadisticasEmprendimientoComponent),
    canActivate: [authGuard],
    title: 'Estadísticas del Emprendimiento'
  }
];