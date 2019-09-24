import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePdfProjectComponent } from './create-pdf-project.component';

describe('CreatePdfProjectComponent', () => {
  let component: CreatePdfProjectComponent;
  let fixture: ComponentFixture<CreatePdfProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePdfProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePdfProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
