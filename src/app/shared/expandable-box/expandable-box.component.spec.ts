import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableBoxComponent } from './expandable-box.component';

describe('ExpandableBoxComponent', () => {
  let component: ExpandableBoxComponent;
  let fixture: ComponentFixture<ExpandableBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandableBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandableBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
