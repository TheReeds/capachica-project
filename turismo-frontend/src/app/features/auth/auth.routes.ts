import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Iniciar sesión'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Registrarse'
  }
];

// Para exportación fácil de los componentes
export * from './login/login.component';
export * from './register/register.component';