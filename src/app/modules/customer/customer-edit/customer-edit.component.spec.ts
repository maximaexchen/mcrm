import { CustomerEditComponent } from './customer-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GeneralModule } from '@app/modules/general.module';
import { CouchDBService } from '@app/services/couchDB.service';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { of, Subject, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '@app/models';
import { MessageService, ConfirmationService, Confirmation } from 'primeng/api';
import { NotificationsService } from '@app/services/notifications.service';

describe('CustomerEditComponent', () => {
  let componentUnderTest: CustomerEditComponent;
  let couchDBServiceSpy: Spy<CouchDBService>;
  let confirmationServiceSpy: Spy<ConfirmationService>;
  let confirmationService: ConfirmationService;
  let fakeCustomer: Customer;
  let router = {
    navigate: jasmine.createSpy('navigate') // to spy on the url that has been routed
  };
  let activatedRoute: any;
  let id: string;
  let confirmation: Confirmation;

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
          provide: NotificationsService,
          useValue: createSpyFromClass(NotificationsService)
        },
        ConfirmationService,
        /* {
          provide: ConfirmationService,
          useValue: createSpyFromClass(ConfirmationService)
        }, */
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    componentUnderTest = TestBed.get(CustomerEditComponent);
    couchDBServiceSpy = TestBed.get(CouchDBService);
    activatedRoute = TestBed.get(ActivatedRoute);
    confirmationServiceSpy = TestBed.get(ConfirmationService);
    confirmationService = new ConfirmationService();

    fakeCustomer = undefined;
  });

  describe('INIT', () => {
    Given(() => {
      fakeCustomer = {
        _id: '1',
        type: 'customer',
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

    describe('GIVEN activatedRoute params THEN call editCustomer', () => {
      Given(() => {
        activatedRoute.params = of({ id: 2 });
        // @ts-ignore
        spyOn(componentUnderTest, 'editCustomer');
      });
      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.editCustomer).toHaveBeenCalled();
      });
    });

    describe('GIVEN empty activatedRoute params THEN call newCustomer', () => {
      Given(() => {
        activatedRoute.params = of({});
        // @ts-ignore
        spyOn(componentUnderTest, 'newCustomer');
      });
      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.newCustomer).toHaveBeenCalled();
      });
    });
  });

  describe('METHOD editCustomer', () => {
    Given(() => {
      id = '1';
      fakeCustomer = {
        _id: '2',
        _rev: '1',
        type: 'customer',
        name: 'AAA'
      };
      couchDBServiceSpy.fetchEntry.and.nextOneTimeWith(fakeCustomer);
      // @ts-ignore
      spyOn(componentUnderTest, 'editCustomer').and.callThrough();
    });

    When(
      fakeAsync(() => {
        // @ts-ignore
        componentUnderTest.editCustomer(id);
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
          .nextOneTimeWith(fakeCustomer);
      });

      Then(() => {
        expect(componentUnderTest.customer).toEqual(fakeCustomer);
      });
    });
  });

  describe('METHOD newCustomer', () => {
    Given(() => {
      componentUnderTest.formTitle = 'dd';
      componentUnderTest.isNew = false;
      componentUnderTest.editable = false;

      // @ts-ignore
      spyOn(componentUnderTest, 'newCustomer').and.callThrough();
    });

    When(() => {
      // @ts-ignore
      componentUnderTest.newCustomer();
    });

    Then(() => {
      expect(componentUnderTest.formTitle).toEqual('Neuen Kunden anlegen');
      expect(componentUnderTest.isNew).toBe(true);
      expect(componentUnderTest.editable).toBe(true);
      expect(componentUnderTest.customer.type).toEqual('customer');
      expect(componentUnderTest.customer.active).toBe(true);
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
        spyOn(componentUnderTest, 'saveCustomer');
      });

      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.saveCustomer).toHaveBeenCalled();
      });
    });

    describe('GIVEN isNEw is false', () => {
      Given(() => {
        componentUnderTest.isNew = false;
        // @ts-ignore
        spyOn(componentUnderTest, 'updateCustomer');
      });

      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.updateCustomer).toHaveBeenCalled();
      });
    });
  });

  describe('METHOD updateCustomer', () => {
    Given(() => {
      fakeCustomer = {
        _id: '1',
        type: 'customer',
        name: 'AAA'
      };
      componentUnderTest.customer = fakeCustomer;
      componentUnderTest.customer._id = '1';
      // @ts-ignore
      spyOn(componentUnderTest, 'sendStateUpdate');
    });

    describe('Given customer THEN success', () => {
      Given(() => {
        // @ts-ignore
        couchDBServiceSpy.updateEntry.and.returnValue(of(fakeCustomer));
      });

      When(
        fakeAsync(() => {
          // @ts-ignore
          componentUnderTest.updateCustomer();
          tick();
        })
      );

      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.sendStateUpdate).toHaveBeenCalled();
      });
    });

    describe('Given customer THEN error', () => {
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
          componentUnderTest.updateCustomer();
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

  describe('METHOD saveCustomer', () => {
    Given(() => {
      // @ts-ignore
      spyOn(componentUnderTest, 'saveCustomer').and.callThrough();
      // @ts-ignore
      spyOn(componentUnderTest, 'sendStateUpdate');
      // @ts-ignore
      spyOn(componentUnderTest, 'showConfirm');
    });

    When(
      fakeAsync(() => {
        // @ts-ignore
        componentUnderTest.saveCustomer();
        tick();
      })
    );

    describe('GIVEN customer THEN save success', () => {
      Given(() => {
        // @ts-ignore
        couchDBServiceSpy.writeEntry.and.nextOneTimeWith(fakeCustomer);
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

  describe('METHOD deleteCustomer', () => {
    Given(() => {
      fakeCustomer = {
        _id: '1',
        _rev: '1',
        type: 'customer',
        name: 'AAA'
      };

      confirmation = {
        message: 'Sie wollen den Datensatz ' + fakeCustomer.name + '?',
        accept: () => console.log('accept in conf')
      };

      confirmationService = new ConfirmationService();

      componentUnderTest.customer = fakeCustomer;

      // @ts-ignore
      spyOn(componentUnderTest, 'deleteCustomer').and.callThrough();
      spyOn(confirmationService, 'confirm');
      /* spyOn(confirmationService, 'confirm').and.callFake(
        (confirmation: Confirmation) => {
          console.log(`fake calling accept`);
          confirmation.accept();
          return confirmationService;
        }
      ); */
      /* spyOn(confirmationService, 'confirm').and.callFake(confirmation => {
        console.log('ÜÜÜ ' + JSON.stringify(confirmation));
        return confirmation.accept();
      }); */
      // @ts-ignore
      spyOn(componentUnderTest, 'sendStateUpdate');
    });

    When(
      fakeAsync(() => {
        // @ts-ignore
        componentUnderTest.deleteCustomer();
        tick();
      })
    );

    describe('GIVEN customer THEN delete customer', () => {
      Given(
        fakeAsync(() => {
          // @ts-ignore
          /* confirmationServiceSpy.confirm.calledWith((conf: Confirmation) => {
          return conf.accept();
        }); */
          confirmationService.accept.subscribe(r => {
            console.log('r: ' + r);
          });
          confirmationService.confirm({});
          tick();

          couchDBServiceSpy.deleteEntry
            .calledWith(fakeCustomer, fakeCustomer._id)
            .nextOneTimeWith(fakeCustomer);
        })
      );

      Then(() => {
        //console.log('acc ' + JSON.stringify(confirmationService.accept));
        /* confirmationService.accept.subscribe(
            res => {
              console.log('res ' + res);
            },
            err => console.log('err ' + err),
            () => console.log('complete ')
          ); */
        // @ts-ignore
        /*  couchDBServiceSpy
          .deleteEntry(fakeCustomer, fakeCustomer._id)
          .subscribe(res => {
            // @ts-ignore
            expect(componentUnderTest.sendStateUpdate).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(['../customer']);
          }); */
      });
    });

    /* describe('GIVEN error THEN save failed', () => {
      Given(() => {
        const testError = {
          message: 'Test 404 error'
        };
        couchDBServiceSpy.writeEntry.and.returnValue(throwError(testError));
      });

      Then(() => {
        // @ts-ignore
        couchDBServiceSpy.deleteEntry().subscribe(
          res => res,
          err => {
            expect(console.error).toHaveBeenCalled();
            expect(err).toEqual({
              status: 404,
              error: { message: 'Test 404 error' }
            });
          }
        );s
      });
    }); */
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
      expect(couchDBServiceSpy.sendStateUpdate).toHaveBeenCalledWith(
        'customer'
      );
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
