import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOrderTableComponent } from './service-order-table.component';

describe('ServiceOrderTableComponent', () => {
  let component: ServiceOrderTableComponent;
  let fixture: ComponentFixture<ServiceOrderTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceOrderTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceOrderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
