import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderServiceTestComponent } from './order-service-test.component';

describe('OrderServiceTestComponent', () => {
  let component: OrderServiceTestComponent;
  let fixture: ComponentFixture<OrderServiceTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderServiceTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderServiceTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
