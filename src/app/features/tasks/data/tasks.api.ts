import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskStatus } from './tasks.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TasksApi {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/tasks`;

  getAll() {
    return this.http.get<Task[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  create(data: { title: string; description?: string }) {
    return this.http.post<Task>(this.baseUrl, data);
  }

  update(id: number, data: Partial<Task>) {
    return this.http.patch<Task>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: number, status: TaskStatus) {
    return this.http.patch<Task>(`${this.baseUrl}/${id}`, { status });
  }
}
