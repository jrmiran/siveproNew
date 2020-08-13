import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetV2Component } from './budget-v2.component';

describe('BudgetV2Component', () => {
  let component: BudgetV2Component;
  let fixture: ComponentFixture<BudgetV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
