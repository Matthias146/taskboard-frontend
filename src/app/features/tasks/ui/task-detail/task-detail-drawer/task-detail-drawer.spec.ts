import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailDrawer } from './task-detail-drawer';

describe('TaskDetailDrawer', () => {
  let component: TaskDetailDrawer;
  let fixture: ComponentFixture<TaskDetailDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailDrawer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailDrawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
