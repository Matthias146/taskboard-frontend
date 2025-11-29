import { Component, computed, inject } from '@angular/core';
import { Contacts } from '../contacts/data/contacts';
import { TaskService } from '../tasks/data/Tasks';
import { TaskStatus } from '../tasks/data/tasks.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private tasksService = inject(TaskService);
  private contactsService = inject(Contacts);

  tasks = this.tasksService.tasks;
  contacts = this.contactsService.contacts;

  now = new Date();

  countOpen = computed(() => this.tasks().filter((t) => t.status === TaskStatus.OPEN).length);

  countProgress = computed(
    () => this.tasks().filter((t) => t.status === TaskStatus.IN_PROGRESS).length
  );

  countDone = computed(() => this.tasks().filter((t) => t.status === TaskStatus.DONE).length);

  countContacts = computed(() => this.contacts().length);

  newThisWeek = computed(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return this.tasks().filter((t) => new Date(t.createdAt) > oneWeekAgo).length;
  });
}
