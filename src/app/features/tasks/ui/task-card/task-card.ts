import { Component, input, output } from '@angular/core';
import { Task, TaskStatus } from '../../data/tasks.model';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCard {
  task = input.required<Task>();

  changeStatus = output<Task>();
  delete = output<number>();
  openDetails = output<Task>();

  TaskStatus = TaskStatus;

  onChangeStatus(event?: MouseEvent) {
    event?.stopPropagation();
    this.changeStatus.emit(this.task());
  }

  onDelete(event?: MouseEvent) {
    event?.stopPropagation();
    this.delete.emit(this.task().id);
  }

  onOpenDetails() {
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
