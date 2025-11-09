import { HttpClient, httpResource } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tasks',
  imports: [],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly tasksResource = httpResource<
    { id: number; title: string; completed: boolean }[]
  >(() => ({
    url: 'http://localhost:3000/tasks',
    method: 'GET',
  }));

  tasks = this.tasksResource.value;
  isLoading = this.tasksResource.isLoading;
  error = this.tasksResource.error;

  logout() {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}
