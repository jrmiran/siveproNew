import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBudgetV2Component } from './new-budget-v2.component';

describe('NewBudgetV2Component', () => {
  let component: NewBudgetV2Component;
  let fixture: ComponentFixture<NewBudgetV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBudgetV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBudgetV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
