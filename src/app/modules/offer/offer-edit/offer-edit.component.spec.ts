import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferEditComponent } from './offer-edit.component';
import { GeneralModule } from '@app/modules/general.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@app/core.module';

describe('OfferEditComponent', () => {
  let component: OfferEditComponent;
  let fixture: ComponentFixture<OfferEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        GeneralModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [OfferEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
