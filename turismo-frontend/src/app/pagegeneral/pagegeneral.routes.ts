import { Routes } from '@angular/router';
import { SobrenosotrosComponent } from './sobrenosotros/sobrenosotros.component';
import { ContactosComponent } from './contactos/contactos.component';
import { HomeComponent } from './home/home.component';
import { FamiliasComponent } from './familia/familias/familias/familias.component';
import { DetallefamiliasComponent } from './familia/detallefamilias/detallefamilias/detallefamilias.component';
import { ServiciosComponent } from './servicio/servicios/servicios.component';
import { GastronomiaComponent } from './servicio/gastronomia/gastronomia.component';
import { ArteytextiComponent } from './servicio/arteytexti/arteytexti.component';
import { AlojamientoComponent } from './servicio/alojamiento/alojamiento.component';
import { ActividadesComponent } from './servicio/actividades/actividades.component';
import { GeneralHeaderComponent } from '../shared/components/header/general-header.component';


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
      path: 'sobrenosotros',
      component: SobrenosotrosComponent,
      title: 'Sobre Nosotros'
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
      path: 'servicios/alojamiento',
      component: AlojamientoComponent,
      title: 'Alojamiento'
    },
    {
      path: 'servicios/artesaniaytextileria',
      component: ArteytextiComponent,
      title: 'Artesanía y Textilería'
    },
    {
      path: 'servicios/gastronomia',
      component: GastronomiaComponent,
      title: 'Gastronomía'
    },
    {
      path: 'familias',
      component: FamiliasComponent,
      title: 'Familias'
    },
    {
      path: 'detallefamilias',
      component: DetallefamiliasComponent,
      title: 'Detalle de Familias'
    }]
   }
];

// Para exportación fácil de los componentes
export * from './sobrenosotros/sobrenosotros.component';
export * from './contactos/contactos.component';
export * from './home/home.component';
export * from './familia/familias/familias/familias.component';
export * from './familia/detallefamilias/detallefamilias/detallefamilias.component';
export * from './servicio/servicios/servicios.component';
export * from './servicio/gastronomia/gastronomia.component';
export * from './servicio/arteytexti/arteytexti.component';
export * from './servicio/alojamiento/alojamiento.component';
export * from './servicio/actividades/actividades.component';