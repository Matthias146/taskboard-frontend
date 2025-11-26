import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Contact } from './contacts.model';

@Injectable({
  providedIn: 'root',
})
export class Contacts {
  private http = inject(HttpClient);

  private readonly contactsResource = httpResource<Contact[]>(() => ({
    url: `${environment.apiUrl}/contacts`,
    method: 'GET',
  }));

  contacts = signal<Contact[]>([]);
  isLoading = this.contactsResource.isLoading;
  error = this.contactsResource.error;

  constructor() {
    effect(() => {
      const value = this.contactsResource.value();
      if (value) {
        this.contacts.set(value);
      }
    });
  }

  refresh() {
    this.contactsResource.reload();
  }

  create(data: Partial<Contact>) {
    return this.http.post<Contact>(`${environment.apiUrl}/contacts`, data);
  }

  update(id: number, data: Partial<Contact>) {
    return this.http.patch<Contact>(`${environment.apiUrl}/contacts/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/contacts/${id}`);
  }
}
