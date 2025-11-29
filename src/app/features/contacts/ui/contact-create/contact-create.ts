import { Component, inject, output, signal } from '@angular/core';
import { Field, form, required } from '@angular/forms/signals';
import { Contacts } from '../../data/contacts';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact-create',
  imports: [Field],
  templateUrl: './contact-create.html',
  styleUrl: './contact-create.scss',
})
export class ContactCreate {
  contactsService = inject(Contacts);
  closeModal = output<void>();
  isSubmitting = signal(false);
  triedSubmit = signal(false);

  model = signal({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  close() {
    this.closeModal.emit();
  }

  form = form(this.model, (f) => {
    required(f.name);
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

    if (this.isInvalid(this.form.name)) {
      return;
    }

    this.isSubmitting.set(true);
    try {
      await firstValueFrom(this.contactsService.create(this.model()));
      this.contactsService.refresh();
      this.closeModal.emit();
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
