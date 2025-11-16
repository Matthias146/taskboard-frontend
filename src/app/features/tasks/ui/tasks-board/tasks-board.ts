import { Component, computed, inject, signal, viewChildren } from '@angular/core';
import { TaskService } from '../../data/Tasks';
import { TaskStatus } from '../../data/tasks.model';
import { TaskColumn } from '../task-column/task-column';
import { firstValueFrom } from 'rxjs';
import { TaskCreate } from '../task-create/task-create';
import { Modal } from '../../../../shared/ui/modal/modal';

@Component({
  selector: 'app-tasks',
  imports: [TaskCreate, TaskColumn, Modal],
  templateUrl: './tasks-board.html',
  styleUrl: './tasks-board.scss',
})
export class TasksBoard {
  private tasksService = inject(TaskService);

  tasks = this.tasksService.tasks;
  openCreateModal = signal(false);

  TaskStatus = TaskStatus;

  columns = viewChildren(TaskColumn);

  tasksOpen = computed(() => this.tasks().filter((t) => t.status === TaskStatus.OPEN));
  tasksProgress = computed(() => this.tasks().filter((t) => t.status === TaskStatus.IN_PROGRESS));
  tasksDone = computed(() => this.tasks().filter((t) => t.status === TaskStatus.DONE));

  connectedLists = computed(() => {
    const ids = [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
    return {
      [TaskStatus.OPEN]: ids.filter((i) => i !== TaskStatus.OPEN),
      [TaskStatus.IN_PROGRESS]: ids.filter((i) => i !== TaskStatus.IN_PROGRESS),
      [TaskStatus.DONE]: ids.filter((i) => i !== TaskStatus.DONE),
    };
  });

  ngAfterViewInit() {
    console.log('Columns connected!', this.connectedLists());
  }

  // UI actions
  openModal() {
    this.openCreateModal.set(true);
  }

  closeModal() {
    this.openCreateModal.set(false);
  }

  async onColumnDrop(event: { taskId: number; newStatus: TaskStatus }) {
    const { taskId, newStatus } = event;

    // optimistic update
    this.tasksService.tasks.update((list) =>
      list.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await firstValueFrom(this.tasksService.updateTask(taskId, { status: newStatus }));
    } catch {
      this.tasksService.refresh();
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
}
