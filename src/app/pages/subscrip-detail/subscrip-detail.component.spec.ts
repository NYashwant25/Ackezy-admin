import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscripDetailComponent } from './subscrip-detail.component';

describe('SubscripDetailComponent', () => {
  let component: SubscripDetailComponent;
  let fixture: ComponentFixture<SubscripDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscripDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscripDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
