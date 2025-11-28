import { Injectable, effect, inject, signal, OnDestroy } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Task, TaskStatus } from './tasks.model';
import { SocketService } from '../../../core/services/socket.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService implements OnDestroy {
  private http = inject(HttpClient);
  private socketService = inject(SocketService);

  private readonly tasksResource = httpResource<Task[]>(() => ({
    url: `${environment.apiUrl}/tasks`,
    method: 'GET',
  }));

  tasks = signal<Task[]>([]);
  isLoading = this.tasksResource.isLoading;
  error = this.tasksResource.error;

  private socketSub = this.socketService.getTaskUpdates().subscribe(() => {
    console.log('🔄 Refreshing Tasks via WebSocket...');
    this.refresh();
  });

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

  createTask(data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: string;
    contactId?: number | null;
  }) {
    return this.http.post<Task>(`${environment.apiUrl}/tasks`, {
      ...data,
      status: data.status ?? TaskStatus.OPEN,
      contactId: data.contactId ?? undefined,
    });
  }

  updateTask(id: number, data: Partial<Task> & { contactId?: number | null }) {
    return this.http.patch<Task>(`${environment.apiUrl}/tasks/${id}`, data);
  }

  deleteTask(id: number) {
    return this.http.delete(`${environment.apiUrl}/tasks/${id}`);
  }

  ngOnDestroy() {
    this.socketSub.unsubscribe();
    this.socketService.disconnect();
  }
}
