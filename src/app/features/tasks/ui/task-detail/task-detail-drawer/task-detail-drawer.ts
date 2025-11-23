import { Component, input, output, signal } from '@angular/core';
import { Task } from '../../../data/tasks.model';
import { TaskDetailView } from '../task-detail-view/task-detail-view';
import { TaskDetailEdit } from '../task-detail-edit/task-detail-edit';

@Component({
  selector: 'app-task-detail-drawer',
  standalone: true,
  imports: [TaskDetailView, TaskDetailEdit],
  templateUrl: './task-detail-drawer.html',
  styleUrl: './task-detail-drawer.scss',
})
export class TaskDetailDrawer {
  task = input<Task | null>(null);

  closed = output<void>();
  saved = output<Task>();

  mode = signal<'view' | 'edit'>('view');

  startEdit() {
    this.mode.set('edit');
  }

  cancelEdit() {
    this.mode.set('view');
  }

  onClose() {
    this.closed.emit();
  }

  onSaved(task: Task) {
    this.saved.emit(task);
    this.mode.set('view');
  }
}
