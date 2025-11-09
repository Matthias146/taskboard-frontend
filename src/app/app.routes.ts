import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Tasks } from './features/tasks/tasks/tasks';
import { AuthGuard } from './core/guards/auth-guard';
import { GuestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
    title: 'Anmelden',
    canActivate: [GuestGuard],
  },
  {
    path: 'register',
    component: Register,
    title: 'Registrieren',
    canActivate: [GuestGuard],
  },
  {
    path: 'tasks',
    component: Tasks,
    canActivate: [AuthGuard],
    title: 'Deine Tasks',
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
