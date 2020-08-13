import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePdfSOComponent } from './create-pdf-so.component';

describe('CreatePdfSOComponent', () => {
  let component: CreatePdfSOComponent;
  let fixture: ComponentFixture<CreatePdfSOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePdfSOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePdfSOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
