import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStartComponent } from './customer-start.component';

describe('CustomerStartComponent', () => {
  let component: CustomerStartComponent;
  let fixture: ComponentFixture<CustomerStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
