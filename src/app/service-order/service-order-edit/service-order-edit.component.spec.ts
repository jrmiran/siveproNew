import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOrderEditComponent } from './service-order-edit.component';

describe('ServiceOrderEditComponent', () => {
  let component: ServiceOrderEditComponent;
  let fixture: ComponentFixture<ServiceOrderEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceOrderEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceOrderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
