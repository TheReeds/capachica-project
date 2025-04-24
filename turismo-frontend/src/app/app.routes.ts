import { Routes } from '@angular/router';
import { authGuard, nonAuthGuard } from './core/guards/auth.guard';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';
import { SobrenosotrosComponent } from './pagegeneral/sobrenosotros/sobrenosotros.component'; 
import { ContactosComponent } from './pagegeneral/contactos/contactos.component';
import { HomeComponent } from './pagegeneral/home/home.component';
import { FamiliasComponent } from './pagegeneral/familia/familias/familias.component';
import { ServiciosComponent } from './pagegeneral/servicio/servicios/servicios.component';
import { DetallefamiliasComponent } from './pagegeneral/familia/detallefamilias/detallefamilias.component';
import { GastronomiaComponent } from './pagegeneral/servicio/gastronomia/gastronomia.component';
import { ArteytextiComponent } from './pagegeneral/servicio/arteytexti/arteytexti.component';
import { AlojamientoComponent } from './pagegeneral/servicio/alojamiento/alojamiento.component';
import { ActividadesComponent } from './pagegeneral/servicio/actividades/actividades.component';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'sobrenosotros',
        pathMatch: 'full'
    },
    {
        path: '',
        canActivate: [nonAuthGuard],
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    
    {
        path: 'sobrenosotros',
        component: SobrenosotrosComponent
        // Sin guardia de autenticación
    },
    // Ruta pública para Sobre Contactos
    {
        path: 'contactos',
        component: ContactosComponent
    },
    {
        path: 'servicios',
        component: ServiciosComponent
    },
    {
        path: 'familias',
        component: FamiliasComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'detallefamilias',
        component: DetallefamiliasComponent
    },
    {
        path: 'servicios/actividades',
        component: ActividadesComponent
    },
    {
        path: 'servicios/alojamiento',
        component: AlojamientoComponent
    },
    {
        path: 'servicios/artesaniaytextileria',
        component: ArteytextiComponent
    },
    {
        path: 'servicios/gastronomia',
        component: GastronomiaComponent
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
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
    
];
