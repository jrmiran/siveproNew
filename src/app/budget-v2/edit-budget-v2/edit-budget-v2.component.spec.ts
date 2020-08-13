import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBudgetV2Component } from './edit-budget-v2.component';

describe('EditBudgetV2Component', () => {
  let component: EditBudgetV2Component;
  let fixture: ComponentFixture<EditBudgetV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBudgetV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBudgetV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
