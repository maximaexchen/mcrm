import { RouterTestingModule } from '@angular/router/testing';
import {
  TestBed,
  fakeAsync,
  tick,
  flushMicrotasks
} from '@angular/core/testing';

import { CustomerListComponent } from './customer-list.component';
import { GeneralModule } from '@app/modules/general.module';
import { CouchDBService } from '@app/services/couchDB.service';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { of, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Customer } from '@app/models';

describe('CustomerListComponent', () => {
  let componentUnderTest: CustomerListComponent;
  let couchDBServiceSpy: Spy<CouchDBService>;
  let fakeCustomers: Customer[];
  let router = {
    navigate: jasmine.createSpy('navigate') // to spy on the url that has been routed
  };

  Given(() => {
    TestBed.configureTestingModule({
      imports: [GeneralModule, RouterTestingModule],
      declarations: [],
      providers: [
        CustomerListComponent,
        {
          provide: CouchDBService,
          useValue: createSpyFromClass(CouchDBService)
        },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    componentUnderTest = TestBed.get(CustomerListComponent);
    couchDBServiceSpy = TestBed.get(CouchDBService);

    fakeCustomers = undefined;
  });

  describe('INIT', () => {
    Given(() => {
      couchDBServiceSpy.setStateUpdate.and.returnValue(of(new Subject<any>()));
      // @ts-ignores
      spyOn(componentUnderTest, 'ngOnInit').and.callThrough();
      // @ts-ignore
      spyOn(componentUnderTest, 'getCustomers');
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
        expect(componentUnderTest.getCustomers).toHaveBeenCalled();
      });
    });

    describe('GIVEN Obeservable sucess THEN call getCustomers', () => {
      Given(() => {
        const message = {
          text: 'customer'
        };

        // @ts-ignores
        couchDBServiceSpy.setStateUpdate.and.returnValue(of(message));
        spyOn(console, 'error');
      });
      Then(() => {
        couchDBServiceSpy.setStateUpdate().subscribe(res => {
          if (res.text === 'customer') {
            expect(componentUnderTest.isLoading).toBe(false);
            // @ts-ignores
            expect(componentUnderTest.getCustomers).toHaveBeenCalled();
          }
          expect(res).toEqual({ text: 'customer' });
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

  describe('METHOD: getCustomers() customers to be greater than 0', () => {
    Given(() => {
      fakeCustomers = [
        {
          _id: '1',
          _rev: '1',
          type: 'customer',
          name: 'Customer name'
        }
      ];
      couchDBServiceSpy.getCustomers.and.nextOneTimeWith(fakeCustomers);
      // @ts-ignore
      spyOn(componentUnderTest, 'getCustomers').and.callThrough();
    });

    When(
      fakeAsync(() => {
        // @ts-ignore
        componentUnderTest.getCustomers();
        tick();
      })
    );

    Then(() => {
      componentUnderTest.customers$.subscribe(res => {
        expect(res).toEqual(fakeCustomers);
      });
    });
  });

  describe('METHOD: showDetail(id)', () => {
    const id = '1';

    Given(() => {
      router = TestBed.get(Router);
    });

    When(() => {
      componentUnderTest.showDetail(id);
    });

    Then(() => {
      expect(router.navigate).toHaveBeenCalledWith([
        '../customer/' + id + '/edit'
      ]);
    });
  });

  describe('METHOD: onRowSelect(event)', () => {
    const id = '1';

    Given(() => {
      spyOn(componentUnderTest, 'onRowSelect').and.callThrough();
    });

    When(
      fakeAsync(() => {
        const event = {
          data: {
            _id: '1'
          }
        };
        componentUnderTest.onRowSelect(event);
        tick();
      })
    );

    Then(() => {
      expect(router.navigate).toHaveBeenCalledWith(['../customer/1/edit']);
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
            type: 'customer',
            name: 'NeuLand Werbeagentur'
          }
        ]
      };
      componentUnderTest.onFilter(event);
    });

    Then(() => {
      expect(componentUnderTest.customerCount).toBe(1);
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
