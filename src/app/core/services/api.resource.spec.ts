import { TestBed } from '@angular/core/testing';

import { ApiResource } from './api.resource';

describe('ApiResource', () => {
  let service: ApiResource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiResource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
