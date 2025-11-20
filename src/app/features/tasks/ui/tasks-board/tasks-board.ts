import { Component, computed, inject, signal } from '@angular/core';
import { TaskService } from '../../data/Tasks';
import { Task, TaskStatus } from '../../data/tasks.model';
import { TaskColumn } from '../task-column/task-column';
import { firstValueFrom } from 'rxjs';
import { TaskCreate } from '../task-create/task-create';
import { Modal } from '../../../../shared/ui/modal/modal';
import { TaskDetailDrawer } from '../task-detail/task-detail-drawer/task-detail-drawer';

@Component({
  selector: 'app-tasks',
  imports: [TaskCreate, TaskColumn, Modal, TaskDetailDrawer],
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

  // Columns
  tasksOpen = computed(() => this.tasks().filter((t) => t.status === TaskStatus.OPEN));
  tasksProgress = computed(() => this.tasks().filter((t) => t.status === TaskStatus.IN_PROGRESS));
  tasksDone = computed(() => this.tasks().filter((t) => t.status === TaskStatus.DONE));

  // Drawer-Steuerung
  openDetails(task: Task) {
    this.selectedTask.set(task);
  }

  closeDetails() {
    this.selectedTask.set(null);
  }

  onTaskSaved(updated: Task) {
    // Optimistic Update im lokalen State
    this.tasksService.tasks.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
    this.closeDetails();
  }

  async nextStatus(task: Task) {
    const next = this.getNextStatus(task.status);

    this.tasksService.tasks.update((list) =>
      list.map((t) => (t.id === task.id ? { ...t, status: next } : t))
    );

    try {
      await firstValueFrom(this.tasksService.updateTask(task.id, { status: next }));
    } catch {
      this.tasksService.refresh();
    }
  }

  getNextStatus(status: TaskStatus): TaskStatus {
    switch (status) {
      case TaskStatus.OPEN:
        return TaskStatus.IN_PROGRESS;
      case TaskStatus.IN_PROGRESS:
        return TaskStatus.DONE;
      case TaskStatus.DONE:
      default:
        return TaskStatus.OPEN;
    }
  }

  async removeTask(id: number) {
    this.tasksService.tasks.update((list) => list.filter((t) => t.id !== id));

    try {
      await firstValueFrom(this.tasksService.deleteTask(id));
    } catch {
      this.tasksService.refresh();
    }
  }

  onColumnDrop(event: { taskId: number; newStatus: TaskStatus }) {
    const { taskId, newStatus } = event;

    this.tasksService.tasks.update((list) =>
      list.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    this.tasksService.updateTask(taskId, { status: newStatus }).subscribe({
      error: () => this.tasksService.refresh(),
    });
  }
}
