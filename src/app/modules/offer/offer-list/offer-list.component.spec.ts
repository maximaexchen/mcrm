import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferListComponent } from './offer-list.component';
import { GeneralModule } from '@app/modules/general.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('OfferListComponent', () => {
  let component: OfferListComponent;
  let fixture: ComponentFixture<OfferListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GeneralModule, RouterTestingModule],
      declarations: [OfferListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
