import { Routes } from '@angular/router';
import { EventosComponent } from './eventos/eventos.component';
import { ContactosComponent } from './contactos/contactos.component';
import { HomeComponent } from './home/home.component';
import { FamiliasComponent } from './familia/familias/familias/familias.component';
import { DetallefamiliasComponent } from './familia/detallefamilias/detallefamilias.component';
import { ServiciosComponent } from './servicio/servicios/servicios.component';
import { AlojamientoComponent } from './servicio/alojamiento/alojamiento.component';
import { ActividadesComponent } from './servicio/actividades/actividades.component';
import { GeneralHeaderComponent } from '../shared/components/header/general-header.component';
import { AlimentacionComponent } from './servicio/alimentacion/alimentacion.component';
import { ArtesaniaComponent } from './servicio/artesania/artesania.component';
import { GuiadoComponent } from './servicio/guiado/guiado.component';
import { TransporteComponent } from './servicio/transporte/transporte.component';
import { ReservasComponent } from './reservas/reservas.component';


export const PAGEGENERAL_ROUTES: Routes = [
  {
    path: '',
    component: GeneralHeaderComponent,
    children: [
    {
      path: 'home',
      component: HomeComponent,
      title: 'Home'
    },
    {
      path: 'eventos',
      loadChildren: () =>
        import('./eventos/eventos.routes').then(m => m.EVENTOS_ROUTES)
    },

    {
      path: 'contactos',
      component: ContactosComponent,
      title: 'Contactos'
    },
    {
      path: 'servicios',
      component: ServiciosComponent,
      title: 'Servicios'
    },
    {
      path: 'servicios/actividades',
      component: ActividadesComponent,
      title: 'Actividades'
    },
    {
      path: 'servicios/alimentacion',
      component: AlimentacionComponent,
      title: 'Alimentacion'
    },
    {
      path: 'servicio/alojamiento',
      component: AlojamientoComponent,
      title: 'Alojamiento'
    },
    {
      path: 'servicios/artesania',
      component: ArtesaniaComponent,
      title: 'Artesanía'
    },
    {
      path: 'servicios/transporte',
      component: TransporteComponent,
      title: 'Transporte'
    },
    {
      path: 'servicios/guiado',
      component: GuiadoComponent,
      title: 'Guiado'
    },
    {
      path: 'familias',
      component: FamiliasComponent,
      title: 'Familias'
    },

    {
      path: 'servicios',
      loadChildren: () => import('./servicio/servicios/servicios.routes').then(m => m.SERVICIOS_ROUTES)
    },


    {
      path: 'servicios',
      loadChildren: () =>
        import('./servicio/servicios/servicios.routes').then(m => m.SERVICIOS_ROUTES)
    },
   { path: 'contactos', 
      component: ContactosComponent, 
      title: 'Contactos' 
    },

    { path: 'reservas/:id', 
      component: ReservasComponent, 
      title: 'Reservas' 
    },
    {
      path: 'detallefamilias/:id',
      component: DetallefamiliasComponent,
      title: 'Detalle de Familias'
    }],
    


   }
];

// Para exportación fácil de los componentes
export * from './eventos/eventos.component';
export * from './contactos/contactos.component';
export * from './home/home.component';
export * from './familia/familias/familias/familias.component';
export * from './familia/detallefamilias/detallefamilias.component';
export * from './servicio/servicios/servicios.component';
export * from './servicio/actividades/actividades.component';
export * from './servicio/alimentacion/alimentacion.component';
export * from './servicio/alojamiento/alojamiento.component';
export * from './servicio/artesania/artesania.component';
export * from './servicio/guiado/guiado.component';
export * from './servicio/transporte/transporte.component';
