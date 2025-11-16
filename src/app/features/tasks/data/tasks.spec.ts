import { TasksService } from './../../../../../../../backend/task-api/src/tasks/tasks.service';
import { TestBed } from '@angular/core/testing';

describe('Data', () => {
  let service: TasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
