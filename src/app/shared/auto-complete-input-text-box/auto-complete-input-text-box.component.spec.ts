import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteInputTextBoxComponent } from './auto-complete-input-text-box.component';

describe('AutoCompleteInputTextBoxComponent', () => {
  let component: AutoCompleteInputTextBoxComponent;
  let fixture: ComponentFixture<AutoCompleteInputTextBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoCompleteInputTextBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteInputTextBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
