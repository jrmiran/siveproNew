import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOrderTableV2Component } from './service-order-table-v2.component';

describe('ServiceOrderTableV2Component', () => {
  let component: ServiceOrderTableV2Component;
  let fixture: ComponentFixture<ServiceOrderTableV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceOrderTableV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceOrderTableV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
