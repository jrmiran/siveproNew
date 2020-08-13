import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOrderReportV2Component } from './service-order-report-v2.component';

describe('ServiceOrderReportV2Component', () => {
  let component: ServiceOrderReportV2Component;
  let fixture: ComponentFixture<ServiceOrderReportV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceOrderReportV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceOrderReportV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
