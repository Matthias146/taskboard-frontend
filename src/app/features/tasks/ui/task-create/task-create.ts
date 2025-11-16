import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { TaskService } from '../../data/Tasks';

@Component({
  selector: 'app-task-create',
  imports: [ReactiveFormsModule],
  templateUrl: './task-create.html',
  styleUrl: './task-create.scss',
})
export class TaskCreate {
  private fb = inject(FormBuilder);
  private tasksService = inject(TaskService);
  isSubmitting = signal(false);

  saved = output<void>();

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
  });

  async submit() {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);

    try {
      await firstValueFrom(this.tasksService.createTask(this.form.getRawValue()));

      this.form.reset();
      this.saved.emit();
    } finally {
      this.isSubmitting.set(false);
    }
    this.tasksService.refresh();
  }

  close() {
    this.saved.emit();
  }
}
