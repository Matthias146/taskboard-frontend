import { Component, input, output, viewChild } from '@angular/core';
import { Task, TaskStatus } from '../../data/tasks.model';
import { TaskCard } from '../task-card/task-card';
import { CdkDropList, CdkDrag, DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-column',
  imports: [TaskCard, DragDropModule, CdkDropList, CdkDrag],
  templateUrl: './task-column.html',
  styleUrl: './task-column.scss',
})
export class TaskColumn {
  dropList = viewChild(CdkDropList);
  title = input.required<string>();
  status = input.required<TaskStatus>();
  tasks = input.required<Task[]>();
  connectedTo = input<string[]>([]);

  cardDropped = output<{ taskId: number; newStatus: TaskStatus }>();
  delete = output<number>();

  ngAfterViewInit() {}

  onDrop(event: CdkDragDrop<Task[]>) {
    const task = event.item.data as Task | undefined;
    if (!task) return;

    if (event.previousContainer.id === event.container.id) return;

    this.cardDropped.emit({ taskId: task.id, newStatus: this.status() });
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }
}
