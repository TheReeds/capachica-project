import { Routes } from '@angular/router';
import { authGuard, nonAuthGuard } from './core/guards/auth.guard';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '',
        canActivate: [nonAuthGuard],
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',  // Ruta raíz para todas las secciones que necesitan el AdminLayout
        component: AdminLayoutComponent,  // AdminLayout como componente padre
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
            },
            {
                path: 'admin',
                loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
            },
            {
                path: 'profile',
                loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES)
            },
            {
                path: 'emprendedores',
                loadChildren: () => import('./features/emprendedores/emprendedores.routes').then(m => m.EMPRENDEDORES_ROUTES)
            },      
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
    
];
