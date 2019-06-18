import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryBoxComponent } from './primary-box.component';

describe('PrimaryBoxComponent', () => {
  let component: PrimaryBoxComponent;
  let fixture: ComponentFixture<PrimaryBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimaryBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
