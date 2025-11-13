import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { TasksBoard } from './features/tasks/ui/tasks-board/tasks-board';
import { AuthGuard } from './core/guards/auth-guard';
import { GuestGuard } from './core/guards/guest-guard';
import { Layout } from './core/layout/layout';
import { Dashboard } from './features/dashboard/dashboard';

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
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'tasks', component: TasksBoard, title: 'Deine Tasks' },
      { path: 'dashboard', component: Dashboard, title: 'Dashboard' },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
