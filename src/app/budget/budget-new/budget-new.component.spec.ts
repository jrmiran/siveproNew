import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetNewComponent } from './budget-new.component';

describe('BudgetNewComponent', () => {
  let component: BudgetNewComponent;
  let fixture: ComponentFixture<BudgetNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});