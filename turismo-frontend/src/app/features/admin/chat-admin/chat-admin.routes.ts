import { Routes } from '@angular/router';
import { ChatAdminComponent } from './chat-admin.component';

export const CHAT_ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: ChatAdminComponent,
    title: 'Administración del Chat'
  }
]; 