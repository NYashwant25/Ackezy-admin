import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDepartmentComponent } from './company-department.component';

describe('CompanyDepartmentComponent', () => {
  let component: CompanyDepartmentComponent;
  let fixture: ComponentFixture<CompanyDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
