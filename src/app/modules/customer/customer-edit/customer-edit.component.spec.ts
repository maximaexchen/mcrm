import { TestBed } from '@angular/core/testing';

import { CustomerEditComponent } from './customer-edit.component';
import { GeneralModule } from '@app/modules/general.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchModule } from '@app/modules/search/search.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NotificationsService } from '@app/services/notifications.service';
import { CouchDBService } from '@app/services/couchDB.service';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';

describe('CustomerEditComponent', () => {
  let componentUnderTest: CustomerEditComponent;
  let couchDBServiceSpy: Spy<CouchDBService>;

  Given(() => {
    TestBed.configureTestingModule({
      imports: [GeneralModule, RouterTestingModule, SearchModule],
      declarations: [],
      providers: [
        CustomerEditComponent,
        {
          provide: CouchDBService,
          useValue: createSpyFromClass(CouchDBService)
        },
        {
          provide: MessageService,
          useValue: createSpyFromClass(MessageService)
        },
        {
          provide: ConfirmationService,
          useValue: createSpyFromClass(ConfirmationService)
        },
        {
          provide: NotificationsService,
          useValue: createSpyFromClass(NotificationsService)
        }
      ]
    }).compileComponents();

    componentUnderTest = TestBed.get(CustomerEditComponent);
    couchDBServiceSpy = TestBed.get(CouchDBService);

    describe('METHOD', () => {
      Given(() => {});

      When(() => {});

      Then(() => {});
    });
  });
});
