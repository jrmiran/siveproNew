import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerSearchComponent } from './seller-search.component';

describe('SellerSearchComponent', () => {
  let component: SellerSearchComponent;
  let fixture: ComponentFixture<SellerSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
