import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailEdit } from './task-detail-edit';

describe('TaskDetailEdit', () => {
  let component: TaskDetailEdit;
  let fixture: ComponentFixture<TaskDetailEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
