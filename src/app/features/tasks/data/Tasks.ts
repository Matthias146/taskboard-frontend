import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Task, TaskStatus } from './tasks.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);

  private readonly tasksResource = httpResource<Task[]>(() => ({
    url: `${environment.apiUrl}/tasks`,
    method: 'GET',
  }));

  tasks = signal<Task[]>([]);
  isLoading = this.tasksResource.isLoading;
  error = this.tasksResource.error;

  constructor() {
    effect(() => {
      const value = this.tasksResource.value();
      if (value) {
        this.tasks.set(value);
      }
    });

    this.refresh();
  }

  refresh() {
    this.tasksResource.reload();
  }

  createTask(data: { title: string; description?: string; status?: TaskStatus }) {
    return this.http.post<Task>(`${environment.apiUrl}/tasks`, {
      ...data,
      status: data.status ?? TaskStatus.OPEN,
    });
  }

  updateTask(id: number, data: Partial<Task>) {
    return this.http.patch<Task>(`http://localhost:3000/tasks/${id}`, data);
  }

  deleteTask(id: number) {
    return this.http.delete(`http://localhost:3000/tasks/${id}`);
  }
}
