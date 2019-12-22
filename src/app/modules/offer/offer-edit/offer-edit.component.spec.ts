import { OfferEditComponent } from './offer-edit.component';
import { async, TestBed } from '@angular/core/testing';

import { GeneralModule } from '@app/modules/general.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchModule } from '@app/modules/search/search.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NotificationsService } from '@app/services/notifications.service';
import { CouchDBService } from '@app/services/couchDB.service';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';

describe('CustomerEditComponent', () => {
  let componentUnderTest: OfferEditComponent;
  let couchDBServiceSpy: Spy<CouchDBService>;

  Given(() => {
    TestBed.configureTestingModule({
      imports: [GeneralModule, RouterTestingModule, SearchModule],
      declarations: [],
      providers: [
        OfferEditComponent,
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

    componentUnderTest = TestBed.get(OfferEditComponent);
    couchDBServiceSpy = TestBed.get(CouchDBService);

    describe('METHOD', () => {
      Given(() => {});

      When(() => {
        componentUnderTest.ngOnInit();
      });

      Then(() => {
        expect(componentUnderTest).toBeTruthy();
      });
    });
  });
});
