import { inject, Injectable, signal } from '@angular/core';
import { Task, TaskStatus } from './tasks.model';
import { TasksApi } from './tasks.api';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Tasks {
  private api = inject(TasksApi);

  tasks = signal<Task[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  async loadTasks() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const data = await firstValueFrom(this.api.getAll());
      this.tasks.set(data);
    } catch (err: any) {
      this.error.set(err.error?.message ?? 'Fehler beim Laden der Tasks');
    } finally {
      this.isLoading.set(false);
    }
  }

  async createTask(title: string, description?: string) {
    const newTask = await firstValueFrom(this.api.create({ title, description }));
    this.tasks.update((list) => [...list, newTask]);
  }

  async updateTask(id: number, data: Partial<Task>) {
    const updated = await firstValueFrom(this.api.update(id, data));
    this.tasks.update((tasks) => tasks.map((t) => (t.id === id ? updated : t)));
  }

  async deleteTask(id: number) {
    await firstValueFrom(this.api.delete(id));
    this.tasks.update((list) => list.filter((t) => t.id !== id));
  }

  async updateStatus(id: number, status: TaskStatus) {
    const updated = await firstValueFrom(this.api.updateStatus(id, status));
    this.tasks.update((list) => list.map((t) => (t.id === id ? updated : t)));
  }
}
