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

  TaskStatus = TaskStatus;

  onChangeStatus() {
    this.changeStatus.emit(this.task());
  }

  onDelete() {
    this.delete.emit(this.task().id);
  }

  formatStatus(status: TaskStatus): string {
    return (
      {
        [TaskStatus.OPEN]: 'Offen',
        [TaskStatus.IN_PROGRESS]: 'In Arbeit',
        [TaskStatus.DONE]: 'Erledigt',
      }[status] ?? status
    );
  }
}
