import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../../data/tasks.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCard {
  task = input.required<Task>();

  delete = output<number>();
  openDetails = output<Task>();

  TaskStatus = TaskStatus;

  onDelete(event?: MouseEvent) {
    event?.stopPropagation();
    this.delete.emit(this.task().id);
  }

  onOpenDetails(event?: MouseEvent) {
    event?.stopPropagation();
    this.openDetails.emit(this.task());
  }

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
