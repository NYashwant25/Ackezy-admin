import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComDepartmentComponent } from './com-department.component';

describe('ComDepartmentComponent', () => {
  let component: ComDepartmentComponent;
  let fixture: ComponentFixture<ComDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
