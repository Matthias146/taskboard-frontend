import { Component, computed, inject, signal } from '@angular/core';
import { TaskService } from '../../data/Tasks';
import { Task, TaskStatus } from '../../data/tasks.model';
import { TaskColumn } from '../task-column/task-column';
import { firstValueFrom } from 'rxjs';
import { TaskCreate } from '../task-create/task-create';
import { TaskDetailDrawer } from '../task-detail/task-detail-drawer/task-detail-drawer';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskCreate, TaskColumn, TaskDetailDrawer],
  templateUrl: './tasks-board.html',
  styleUrl: './tasks-board.scss',
})
export class TasksBoard {
  private tasksService = inject(TaskService);

  tasks = this.tasksService.tasks;
  isLoading = this.tasksService.isLoading;
  error = this.tasksService.error;

  TaskStatus = TaskStatus;

  openCreateModal = signal(false);
  selectedTask = signal<Task | null>(null);

  openModal() {
    this.openCreateModal.set(true);
  }

  closeModal() {
    this.openCreateModal.set(false);
  }

  tasksOpen = computed(() => this.tasks().filter((t) => t.status === TaskStatus.OPEN));
  tasksProgress = computed(() => this.tasks().filter((t) => t.status === TaskStatus.IN_PROGRESS));
  tasksDone = computed(() => this.tasks().filter((t) => t.status === TaskStatus.DONE));

  openDetails(task: Task) {
    this.selectedTask.set(task);
  }

  closeDetails() {
    this.selectedTask.set(null);
  }

  onTaskSaved(updated: Task) {
    this.tasksService.tasks.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
    this.closeDetails();
  }

  // Task löschen
  async removeTask(id: number) {
    const oldList = this.tasks();
    this.tasksService.tasks.update((list) => list.filter((t) => t.id !== id));

    try {
      await firstValueFrom(this.tasksService.deleteTask(id));
    } catch {
      this.tasksService.tasks.set(oldList);
    }
  }

  onColumnDrop(event: { taskId: number; newStatus: TaskStatus }) {
    const { taskId, newStatus } = event;
    const oldList = this.tasks();

    this.tasksService.tasks.update((list) =>
      list.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    this.tasksService.updateTask(taskId, { status: newStatus }).subscribe({
      error: () => {
        this.tasksService.tasks.set(oldList);
        this.tasksService.refresh();
      },
    });
  }
}
