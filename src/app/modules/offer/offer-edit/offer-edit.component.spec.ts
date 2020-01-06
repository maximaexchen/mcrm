import { OfferEditComponent } from './offer-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GeneralModule } from '@app/modules/general.module';
import { CouchDBService } from '@app/services/couchDB.service';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { of, Subject, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Offer } from '@app/models';
import { MessageService, ConfirmationService, Confirmation } from 'primeng/api';
import { NotificationsService } from '@app/services/notifications.service';

export class ConfirmationServiceMock {
  public key = 'mock1';
  public header = 'Delete Confirmation';
  public icon = '';
  public message = '';
  //  Call Accept to emulate a user accepting
  public accept: () => void;
  //  Call Reject to emulate a user rejecting
  public reject: () => void;
  private requireConfirmationSource = new Subject<any>();
  requireConfirmation$ = this.requireConfirmationSource.asObservable();
  //
  public confirm(config: any) {
    console.log('In confirm service mock...');
    this.message = config.message;
    this.accept = config.accept;
    this.reject = config.reject;
    console.log(this.message);
    return this;
  }
}

describe('OfferEditComponent', () => {
  let componentUnderTest: OfferEditComponent;
  let couchDBServiceSpy: Spy<CouchDBService>;
  let fakeOffer: Offer;
  let router = {
    navigate: jasmine.createSpy('navigate') // to spy on the url that has been routed
  };
  let activatedRoute: any;
  let id: string;
  let confirmation: Confirmation;

  let confirmService: ConfirmationServiceMock;

  const activatedRouteStub = {
    params: {
      subscribe() {
        return of({ id: 1 });
      }
    }
  };

  Given(() => {
    TestBed.configureTestingModule({
      imports: [GeneralModule, RouterTestingModule],
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
          provide: NotificationsService,
          useValue: createSpyFromClass(NotificationsService)
        },
        { provide: ConfirmationService, useValue: confirmService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    componentUnderTest = TestBed.get(OfferEditComponent);
    couchDBServiceSpy = TestBed.get(CouchDBService);
    activatedRoute = TestBed.get(ActivatedRoute);
    confirmService = new ConfirmationServiceMock();

    fakeOffer = undefined;
  });

  describe('INIT', () => {
    Given(() => {
      fakeOffer = {
        _id: '1',
        type: 'offer',
        name: 'AAA'
      };
    });

    When(
      fakeAsync(() => {
        // @ts-ignore
        componentUnderTest.ngOnInit();
        tick();
      })
    );

    describe('METHOD ngOnInit', () => {
      Given(() => {
        // @ts-ignores
        spyOn(componentUnderTest, 'ngOnInit').and.callThrough();
      });

      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.ngOnInit).toHaveBeenCalled();
      });
    });

    describe('GIVEN activatedRoute params THEN call editOffer', () => {
      Given(() => {
        activatedRoute.params = of({ id: 2 });
        // @ts-ignore
        spyOn(componentUnderTest, 'editOffer');
      });
      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.editOffer).toHaveBeenCalled();
      });
    });

    describe('GIVEN empty activatedRoute params THEN call newOffer', () => {
      Given(() => {
        activatedRoute.params = of({});
        // @ts-ignore
        spyOn(componentUnderTest, 'newOffer');
      });
      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.newOffer).toHaveBeenCalled();
      });
    });
  });

  describe('METHOD editOffer', () => {
    Given(() => {
      id = '1';
      fakeOffer = {
        _id: '2',
        _rev: '1',
        type: 'offer',
        name: 'AAA'
      };
      couchDBServiceSpy.fetchEntry.and.nextOneTimeWith(fakeOffer);
      // @ts-ignore
      spyOn(componentUnderTest, 'editOffer').and.callThrough();
    });

    When(
      fakeAsync(() => {
        // @ts-ignore
        componentUnderTest.editOffer(id);
        tick();
      })
    );

    describe('GIVEN 404 on service observable THEN error callback', () => {
      Given(() => {
        const testError = {
          status: 404,
          error: {
            message: 'Test 404 error'
          }
        };
        couchDBServiceSpy.fetchEntry.and.returnValue(throwError(testError));
        spyOn(console, 'error');
      });

      Then(() => {
        // @ts-ignore
        couchDBServiceSpy.fetchEntry().subscribe(
          res => res,
          err => {
            expect(console.error).toHaveBeenCalled();
            expect(err).toEqual({
              status: 404,
              error: { message: 'Test 404 error' }
            });
          }
        );
      });
    });

    describe('GIVEN existing id THEN get custumer', () => {
      Given(() => {
        // @ts-ignore
        couchDBServiceSpy.fetchEntry
          .mustBeCalledWith('/' + id)
          .nextOneTimeWith(fakeOffer);
      });

      Then(() => {
        expect(componentUnderTest.offer).toEqual(fakeOffer);
      });
    });
  });

  describe('METHOD newOffer', () => {
    Given(() => {
      componentUnderTest.formTitle = 'dd';
      componentUnderTest.isNew = false;
      componentUnderTest.editable = false;

      // @ts-ignore
      spyOn(componentUnderTest, 'newOffer').and.callThrough();
    });

    When(() => {
      // @ts-ignore
      componentUnderTest.newOffer();
    });

    Then(() => {
      expect(componentUnderTest.formTitle).toEqual('Neuen Kunden anlegen');
      expect(componentUnderTest.isNew).toBe(true);
      expect(componentUnderTest.editable).toBe(true);
      expect(componentUnderTest.offer.type).toEqual('offer');
    });
  });

  describe('METHOD onSubmit', () => {
    Given(() => {
      // @ts-ignore
      spyOn(componentUnderTest, 'onSubmit').and.callThrough();
    });

    When(() => {
      // @ts-ignore
      componentUnderTest.onSubmit();
    });

    describe('GIVEN isNEw is true', () => {
      Given(() => {
        componentUnderTest.isNew = true;
        // @ts-ignore
        spyOn(componentUnderTest, 'saveOffer');
      });

      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.saveOffer).toHaveBeenCalled();
      });
    });

    describe('GIVEN isNEw is false', () => {
      Given(() => {
        componentUnderTest.isNew = false;
        // @ts-ignore
        spyOn(componentUnderTest, 'updateOffer');
      });

      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.updateOffer).toHaveBeenCalled();
      });
    });
  });

  describe('METHOD updateOffer', () => {
    Given(() => {
      fakeOffer = {
        _id: '1',
        type: 'offer',
        name: 'AAA'
      };
      componentUnderTest.offer = fakeOffer;
      componentUnderTest.offer._id = '1';
      // @ts-ignore
      spyOn(componentUnderTest, 'sendStateUpdate');
    });

    describe('Given offer THEN success', () => {
      Given(() => {
        // @ts-ignore
        couchDBServiceSpy.updateEntry.and.returnValue(of(fakeOffer));
      });

      When(
        fakeAsync(() => {
          // @ts-ignore
          componentUnderTest.updateOffer();
          tick();
        })
      );

      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.sendStateUpdate).toHaveBeenCalled();
      });
    });

    describe('Given offer THEN error', () => {
      Given(() => {
        const testError = {
          message: 'Test 404 error'
        };
        couchDBServiceSpy.updateEntry.and.returnValue(throwError(testError));
        spyOn(console, 'error');
        // @ts-ignore
        spyOn(componentUnderTest, 'showConfirm');
      });

      When(
        fakeAsync(() => {
          // @ts-ignore
          componentUnderTest.updateOffer();
          tick();
        })
      );

      Then(() => {
        // @ts-ignore
        couchDBServiceSpy.updateEntry().subscribe(
          res => res,
          err => {
            expect(console.error).toHaveBeenCalled();
            expect(err).toEqual({
              message: 'Test 404 error'
            });
          }
        );

        const testError = {
          message: 'Test 404 error'
        };
        // @ts-ignore
        expect(componentUnderTest.showConfirm).toHaveBeenCalledWith(
          'error',
          testError.message
        );
      });
    });
  });

  describe('METHOD saveOffer', () => {
    Given(() => {
      // @ts-ignore
      spyOn(componentUnderTest, 'saveOffer').and.callThrough();
      // @ts-ignore
      spyOn(componentUnderTest, 'sendStateUpdate');
      // @ts-ignore
      spyOn(componentUnderTest, 'showConfirm');
    });

    When(
      fakeAsync(() => {
        // @ts-ignore
        componentUnderTest.saveOffer();
        tick();
      })
    );

    describe('GIVEN offer THEN save success', () => {
      Given(() => {
        // @ts-ignore
        couchDBServiceSpy.writeEntry.and.nextOneTimeWith(fakeOffer);
      });

      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.sendStateUpdate).toHaveBeenCalled();
      });
    });

    describe('GIVEN error THEN save failed', () => {
      Given(() => {
        const testError = {
          message: 'Test 404 error'
        };
        couchDBServiceSpy.writeEntry.and.returnValue(throwError(testError));
      });

      Then(() => {
        const testError = {
          message: 'Test 404 error'
        };
        // @ts-ignore
        expect(componentUnderTest.showConfirm).toHaveBeenCalledWith(
          'error',
          testError.message
        );
      });
    });
  });

  describe('METHOD deleteOffer', () => {
    Given(() => {
      fakeOffer = {
        _id: '1',
        _rev: '1',
        type: 'offer',
        name: 'AAA'
      };

      // @ts-ignore
      spyOn(componentUnderTest, 'sendStateUpdate');
    });

    When(() => {
      // @ts-ignore
      // componentUnderTest.deleteOffer();
      console.log(confirmService.accept());
      confirmService.accept();
    });

    describe('GIVEN offer THEN delete offer', () => {
      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.sendStateUpdate).toHaveBeenCalled();
      });
      /* Then(
        fakeAsync(() => {
          couchDBServiceSpy
            .deleteEntry(fakeOffer._id, fakeOffer._rev)
            .subscribe(del => {
              console.log('del: ' + del);
            });
          tick();
        })
      ); */
    });
  });

  describe('METHOD: showConfirm', () => {
    Given(() => {
      // @ts-ignore
      spyOn(componentUnderTest, 'showConfirm').and.callThrough();
    });

    describe('GIVEN ok THEN type = ok', () => {
      When(() => {
        // @ts-ignore
        componentUnderTest.showConfirm('success', 'ok');
      });

      Then(() => {
        expect(
          (componentUnderTest as any).notificationsService.addSingle
        ).toHaveBeenCalledWith('success', 'ok', 'ok');
      });
    });

    describe('GIVEN error THEN type = error', () => {
      When(() => {
        // @ts-ignore
        componentUnderTest.showConfirm('error', 'error');
      });

      Then(() => {
        expect(
          (componentUnderTest as any).notificationsService.addSingle
        ).toHaveBeenCalledWith('error', 'error', 'error');
      });
    });
  });

  describe('METHOD: onEdit', () => {
    Given(() => {
      // @ts-ignore
      componentUnderTest.editable = false;
      // @ts-ignore
      spyOn(componentUnderTest, 'onEdit').and.callThrough();
    });

    When(() => {
      // @ts-ignore
      componentUnderTest.onEdit();
    });

    Then(() => {
      // @ts-ignore
      expect(componentUnderTest.editable).toBe(true);
    });
  });

  describe('METHOD: sendStateUpdate', () => {
    When(() => {
      // @ts-ignore
      componentUnderTest.sendStateUpdate();
    });

    Then(() => {
      // @ts-ignore
      expect(couchDBServiceSpy.sendStateUpdate).toHaveBeenCalledWith('offer');
    });
  });

  describe('METHOD: ngOnDestroy', () => {
    Given(() => {
      spyOn(componentUnderTest, 'ngOnDestroy').and.callThrough();
      // @ts-ignore
      spyOn(componentUnderTest.subs, 'unsubscribe');
    });

    When(() => {
      componentUnderTest.ngOnDestroy();
    });

    Then(() => {
      // @ts-ignore
      expect(componentUnderTest.subs.unsubscribe).toHaveBeenCalled();
    });
  });
});
