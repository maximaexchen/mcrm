import { InvoiceListComponent } from './invoice-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';

import { GeneralModule } from '@app/modules/general.module';
import { CouchDBService } from '@app/services/couchDB.service';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { of, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Invoice } from '@app/models/invoice.model';

describe('InvoiceListComponent', () => {
  let componentUnderTest: InvoiceListComponent;
  let couchDBServiceSpy: Spy<CouchDBService>;
  let fakeInvoices: Invoice[];
  let router = {
    navigate: jasmine.createSpy('navigate') // to spy on the url that has been routed
  };

  Given(() => {
    TestBed.configureTestingModule({
      imports: [GeneralModule, RouterTestingModule],
      declarations: [],
      providers: [
        InvoiceListComponent,
        {
          provide: CouchDBService,
          useValue: createSpyFromClass(CouchDBService)
        },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    componentUnderTest = TestBed.get(InvoiceListComponent);
    couchDBServiceSpy = TestBed.get(CouchDBService);

    fakeInvoices = undefined;
  });

  describe('INIT', () => {
    Given(() => {
      couchDBServiceSpy.setStateUpdate.and.returnValue(of(new Subject<any>()));
      // @ts-ignores
      spyOn(componentUnderTest, 'ngOnInit').and.callThrough();
      // @ts-ignore
      spyOn(componentUnderTest, 'getInvoices');
    });

    When(
      fakeAsync(() => {
        // @ts-ignore
        componentUnderTest.ngOnInit();
        tick();
      })
    );

    describe('GIVEN startup THEN getTags to be called', () => {
      Given(() => {
        couchDBServiceSpy.setStateUpdate.and.returnValue(
          of(new Subject<any>())
        );
      });
      Then(() => {
        expect(componentUnderTest).toBeTruthy();
        // @ts-ignore
        expect(componentUnderTest.getInvoices).toHaveBeenCalled();
      });
    });

    describe('GIVEN Obeservable sucess THEN call getInvoices', () => {
      Given(() => {
        const message = {
          text: 'invoice'
        };

        // @ts-ignores
        couchDBServiceSpy.setStateUpdate.and.returnValue(of(message));
        spyOn(console, 'error');
      });

      Then(() => {
        couchDBServiceSpy.setStateUpdate().subscribe(res => {
          if (res.text === 'invoice') {
            // @ts-ignores
            expect(componentUnderTest.getInvoices).toHaveBeenCalled();
          }
          expect(res).toEqual({ text: 'invoice' });
        });
      });
    });

    describe('GIVEN Obeservable error THEN call error callback', () => {
      Given(() => {
        const testError = {
          status: 406,
          error: {
            message: 'Test 406 error'
          }
        };
        // @ts-ignores
        couchDBServiceSpy.setStateUpdate.and.returnValue(throwError(testError));
        spyOn(console, 'error');
      });
      Then(() => {
        couchDBServiceSpy.setStateUpdate().subscribe(
          res => res,
          err => {
            expect(console.error).toHaveBeenCalled();
            expect(err).toEqual({
              status: 406,
              error: { message: 'Test 406 error' }
            });
          }
        );
      });
    });
  });

  describe('METHOD: getInvoices() invoices to be greater than 0', () => {
    Given(() => {
      fakeInvoices = [
        {
          _id: '1',
          _rev: '1',
          type: 'invoice',
          name: 'Customer name'
        }
      ];
      couchDBServiceSpy.getInvoices.and.nextOneTimeWith(fakeInvoices);
      // @ts-ignore
      spyOn(componentUnderTest, 'getInvoices').and.callThrough();
    });

    When(
      fakeAsync(() => {
        // @ts-ignore
        componentUnderTest.getInvoices();
        tick();
      })
    );

    Then(() => {
      componentUnderTest.invoices$.subscribe(res => {
        expect(res).toEqual(fakeInvoices);
      });
    });
  });

  describe('METHOD: showDetail(id)', () => {
    const id = '1';

    Given(() => {
      router = TestBed.get(Router);
    });

    When(
      fakeAsync(() => {
        componentUnderTest.showDetail(id);
        tick();
      })
    );

    Then(
      fakeAsync(() => {
        expect(router.navigate).toHaveBeenCalledWith([
          '../invoice/' + id + '/edit'
        ]);
      })
    );
  });

  describe('METHOD: onRowSelect(event)', () => {
    const id = '1';

    Given(() => {
      spyOn(componentUnderTest, 'onRowSelect').and.callThrough();
    });

    When(
      fakeAsync(() => {
        const event = {
          data: [
            {
              _id: '1'
            }
          ]
        };
        componentUnderTest.onRowSelect(event);
        tick();
      })
    );

    Then(() => {
      expect(router.navigate).toHaveBeenCalledWith(['../invoice/1/edit']);
    });
  });

  describe('METHOD: onFilter', () => {
    Given(() => {
      spyOn(componentUnderTest, 'onFilter').and.callThrough();
    });

    When(() => {
      const event = {
        filteredValue: [
          {
            _id: '9d5e29d54d7766924e3ab4251f000938',
            _rev: '13-4214279f8cf44978569a629246ab2c53',
            type: 'invoice',
            name: 'NeuLand Werbeagentur'
          }
        ]
      };
      componentUnderTest.onFilter(event);
    });

    Then(() => {
      expect(componentUnderTest.invoiceCount).toBe(1);
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
