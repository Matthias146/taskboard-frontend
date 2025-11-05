import { httpResource } from '@angular/common/http';

export function createResource<T>(url: string) {
  const resource = httpResource<T>(() => url);
  return resource;
}
