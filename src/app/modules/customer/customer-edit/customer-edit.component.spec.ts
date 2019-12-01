import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEditComponent } from './customer-edit.component';
import { GeneralModule } from '@app/modules/general.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchModule } from '@app/modules/search/search.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NotificationsService } from '@app/services/notifications.service';
import { CouchDBService } from '@app/services/couchDB.service';

describe('CustomerEditComponent', () => {
  let component: CustomerEditComponent;
  let fixture: ComponentFixture<CustomerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GeneralModule, RouterTestingModule, SearchModule],
      declarations: [CustomerEditComponent],
      providers: [
        MessageService,
        ConfirmationService,
        NotificationsService,
        CouchDBService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
