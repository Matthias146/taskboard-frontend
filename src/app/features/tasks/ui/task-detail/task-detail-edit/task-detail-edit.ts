import { Component, effect, inject, input, output, signal } from '@angular/core';
import { TaskService } from '../../../data/Tasks';
import { Task, TaskStatus } from '../../../data/tasks.model';
import { firstValueFrom } from 'rxjs';
import { form, Field, required } from '@angular/forms/signals';

interface TaskEditData {
  title: string;
  description: string;
  status: TaskStatus;
}

@Component({
  selector: 'app-task-detail-edit',
  standalone: true,
  imports: [Field],
  templateUrl: './task-detail-edit.html',
  styleUrl: './task-detail-edit.scss',
})
export class TaskDetailEdit {
  private tasksService = inject(TaskService);

  task = input.required<Task>();
  saved = output<Task>();
  cancel = output<void>();

  isSaving = signal(false);
  triedSubmit = signal(false);

  TaskStatus = TaskStatus;

  model = signal<TaskEditData>({
    title: '',
    description: '',
    status: TaskStatus.OPEN,
  });

  editForm = form(this.model as any, (f: any) => {
    required(f.title);
  }) as any;

  constructor() {
    effect(() => {
      const t = this.task();
      if (!t) return;

      this.model.set({
        title: t.title,
        description: t.description ?? '',
        status: t.status,
      });
    });
  }

  hasError(field: any, kind: string): boolean {
    const errors = field().errors();
    return Array.isArray(errors) && errors.some((e: any) => e.kind === kind);
  }

  isInvalid(field: any): boolean {
    const errors = field().errors();
    return Array.isArray(errors) && errors.length > 0;
  }

  async save(event: Event) {
    event.preventDefault();
    this.triedSubmit.set(true);

    // Validierung prüfen
    if (this.isInvalid(this.editForm.title)) {
      return;
    }

    this.isSaving.set(true);
    try {
      const formData = this.model();

      const result = await firstValueFrom(
        this.tasksService.updateTask(this.task().id, {
          title: formData.title,
          description: formData.description,
          status: formData.status,
        })
      );

      this.saved.emit(result);
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
    } finally {
      this.isSaving.set(false);
    }
  }
}
