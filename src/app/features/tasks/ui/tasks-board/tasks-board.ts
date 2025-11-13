import { Component, effect, inject } from '@angular/core';
import { Tasks } from '../../data/Tasks';

@Component({
  selector: 'app-tasks',
  imports: [],
  templateUrl: './tasks-board.html',
  styleUrl: './tasks-board.scss',
})
export class TasksBoard {
  private tasksService = inject(Tasks);
  tasks = this.tasksService.tasks;
  isLoading = this.tasksService.isLoading;
  error = this.tasksService.error;

  constructor() {
    effect(() => {
      this.tasksService.loadTasks();
    });
  }
}
