import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItemEditComponent } from './task-item-edit.component';

describe('TaskItemEditComponent', () => {
  let component: TaskItemEditComponent;
  let fixture: ComponentFixture<TaskItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskItemEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
