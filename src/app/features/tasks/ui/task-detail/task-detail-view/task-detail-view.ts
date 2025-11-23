import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../../../data/tasks.model';

@Component({
  selector: 'app-task-detail-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-detail-view.html',
  styleUrl: './task-detail-view.scss',
})
export class TaskDetailView {
  task = input.required<Task>();
  edit = output<void>();

  formatStatus(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.OPEN:
        return 'Offen';
      case TaskStatus.IN_PROGRESS:
        return 'In Arbeit';
      case TaskStatus.DONE:
        return 'Erledigt';
      default:
        return status;
    }
  }
}
