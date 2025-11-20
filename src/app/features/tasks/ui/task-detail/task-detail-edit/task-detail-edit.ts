import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../data/Tasks';
import { Task, TaskStatus } from '../../../data/tasks.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-task-detail-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './task-detail-edit.html',
  styleUrl: './task-detail-edit.scss',
})
export class TaskDetailEdit {
  private fb = inject(FormBuilder);
  private tasksService = inject(TaskService);

  task = input.required<Task>();
  saved = output<Task>();
  cancel = output<void>();

  isSaving = signal(false);

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    status: [TaskStatus.OPEN as TaskStatus, Validators.required],
  });

  TaskStatus = TaskStatus;

  constructor() {
    effect(() => {
      const t = this.task();
      if (!t) return; // <-- Safety fallback

      this.form.patchValue({
        title: t.title,
        description: t.description ?? '',
        status: t.status,
      });
    });
  }

  async save() {
    if (this.form.invalid) return;

    this.isSaving.set(true);
    try {
      const result = await firstValueFrom(
        this.tasksService.updateTask(this.task().id, this.form.getRawValue())
      );

      this.saved.emit(result);
    } finally {
      this.isSaving.set(false);
    }
  }
}
