import { MessageService } from 'primeng/components/common/messageservice';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceEditComponent } from './invoice-edit.component';
import { GeneralModule } from '@app/modules/general.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchModule } from '@app/modules/search/search.module';
import { ConfirmationService } from 'primeng/api';

describe('InvoiceEditComponent', () => {
  let component: InvoiceEditComponent;
  let fixture: ComponentFixture<InvoiceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GeneralModule, RouterTestingModule, SearchModule],
      declarations: [InvoiceEditComponent],
      providers: [MessageService, ConfirmationService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
