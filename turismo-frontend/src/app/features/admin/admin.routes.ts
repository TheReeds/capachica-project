import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../shared/layouts/admin-layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users',
        loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES),
        title: 'Gestión de Usuarios'
      },
      {
        path: 'roles',
        loadChildren: () => import('./roles/roles.routes').then(m => m.ROLES_ROUTES),
        title: 'Gestión de Roles'
      },
      {
        path: 'permissions',
        loadChildren: () => import('./permissions/permissions.routes').then(m => m.PERMISSIONS_ROUTES),
        title: 'Gestión de Permisos'
      }
    ]
  }
];