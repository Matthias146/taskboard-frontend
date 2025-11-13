import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Tasks } from './features/tasks/tasks/tasks';
import { AuthGuard } from './core/guards/auth-guard';
import { GuestGuard } from './core/guards/guest-guard';
import { Layout } from './core/layout/layout';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },

  {
    path: '',
    canActivate: [GuestGuard],
    children: [
      { path: 'login', component: Login, title: 'Anmelden' },
      { path: 'register', component: Register, title: 'Registrieren' },
    ],
  },
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [{ path: 'tasks', component: Tasks, title: 'Deine Tasks' }],
  },

  { path: '**', redirectTo: 'login' },
];
