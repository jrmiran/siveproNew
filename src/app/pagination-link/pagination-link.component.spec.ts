import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationLinkComponent } from './pagination-link.component';

describe('PaginationLinkComponent', () => {
  let component: PaginationLinkComponent;
  let fixture: ComponentFixture<PaginationLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
