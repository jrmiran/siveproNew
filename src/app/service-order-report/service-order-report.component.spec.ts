import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOrderReportComponent } from './service-order-report.component';

describe('ServiceOrderReportComponent', () => {
  let component: ServiceOrderReportComponent;
  let fixture: ComponentFixture<ServiceOrderReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceOrderReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
