import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOrderV2Component } from './service-order-v2.component';

describe('ServiceOrderV2Component', () => {
  let component: ServiceOrderV2Component;
  let fixture: ComponentFixture<ServiceOrderV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceOrderV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceOrderV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
