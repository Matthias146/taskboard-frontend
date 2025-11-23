import { Component, inject, output, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TaskService } from '../../data/Tasks';
import { form, Field, required } from '@angular/forms/signals';

interface TaskData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [Field],
  templateUrl: './task-create.html',
  styleUrl: './task-create.scss',
})
export class TaskCreate {
  private tasksService = inject(TaskService);

  isSubmitting = signal(false);
  triedSubmit = signal(false);

  saved = output<void>();
  cancel = output<void>();

  model = signal<TaskData>({
    title: '',
    description: '',
  });

  createForm = form(this.model as any, (f: any) => {
    required(f.title);
  }) as any;

  hasError(field: any, kind: string): boolean {
    const errors = field().errors();
    return Array.isArray(errors) && errors.some((e: any) => e.kind === kind);
  }

  isInvalid(field: any): boolean {
    const errors = field().errors();
    return Array.isArray(errors) && errors.length > 0;
  }

  async submit(event: Event) {
    event.preventDefault();
    this.triedSubmit.set(true);

    if (this.isInvalid(this.createForm.title)) {
      return;
    }

    this.isSubmitting.set(true);

    try {
      const taskData = this.model();

      await firstValueFrom(this.tasksService.createTask(taskData));

      this.saved.emit();
      this.tasksService.refresh();
    } catch (err) {
      console.error('Fehler beim Erstellen:', err);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  close() {
    this.saved.emit();
  }
}
