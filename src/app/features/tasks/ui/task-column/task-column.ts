import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common'; // Wichtig für lowercase pipe
import { Task, TaskStatus } from '../../data/tasks.model';
import { TaskCard } from '../task-card/task-card';
import { CdkDropList, CdkDrag, DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-column',
  standalone: true,
  imports: [CommonModule, TaskCard, DragDropModule, CdkDropList, CdkDrag],
  templateUrl: './task-column.html',
  styleUrl: './task-column.scss',
})
export class TaskColumn {
  title = input.required<string>();
  status = input.required<TaskStatus>();
  tasks = input.required<Task[]>();
  connectedTo = input<string[]>([]);

  cardDropped = output<{ taskId: number; newStatus: TaskStatus }>();
  delete = output<number>();
  openDetails = output<Task>();

  onDrop(event: CdkDragDrop<Task[]>) {
    const task = event.item.data as Task | undefined;
    if (!task) return;

    if (event.previousContainer === event.container && event.previousIndex === event.currentIndex) {
      return;
    }

    if (event.previousContainer.id !== event.container.id) {
      this.cardDropped.emit({ taskId: task.id, newStatus: this.status() });
    }
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }
}
