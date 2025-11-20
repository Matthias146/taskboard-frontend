import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailView } from './task-detail-view';

describe('TaskDetailView', () => {
  let component: TaskDetailView;
  let fixture: ComponentFixture<TaskDetailView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
