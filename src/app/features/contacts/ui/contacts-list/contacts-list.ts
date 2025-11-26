import { Component, inject, signal } from '@angular/core';
import { Contacts } from '../../data/contacts';
import { ContactCreate } from '../contact-create/contact-create';

@Component({
  selector: 'app-contacts-list',
  imports: [ContactCreate],
  templateUrl: './contacts-list.html',
  styleUrl: './contacts-list.scss',
})
export class ContactsList {
  contactsService = inject(Contacts);

  contacts = this.contactsService.contacts;
  isLoading = this.contactsService.isLoading;

  showCreateModal = signal(false);

  openCreate() {
    this.showCreateModal.set(true);
  }

  closeCreate() {
    this.showCreateModal.set(false);
  }

  deleteContact(id: number) {
    if (confirm('Kontakt wirklich löschen?')) {
      this.contactsService.delete(id).subscribe(() => {
        this.contactsService.refresh();
      });
    }
  }
}
