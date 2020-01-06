import { CouchDBService } from 'src/app/services/couchDB.service';
import { GeneralModule } from './../../general.module';
import { OfferListComponent } from './offer-list.component';
import { Offer } from './../../../models/offer.model';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { of, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('OfferListComponent', () => {
  let componentUnderTest: OfferListComponent;
  let couchDBServiceSpy: Spy<CouchDBService>;
  let fakeOffers: Offer[];
  let router = {
    navigate: jasmine.createSpy('navigate') // to spy on the url that has been routed
  };

  Given(() => {
    TestBed.configureTestingModule({
      imports: [GeneralModule, RouterTestingModule],
      declarations: [],
      providers: [
        OfferListComponent,
        {
          provide: CouchDBService,
          useValue: createSpyFromClass(CouchDBService)
        },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    componentUnderTest = TestBed.get(OfferListComponent);
    couchDBServiceSpy = TestBed.get(CouchDBService);

    fakeOffers = undefined;
  });

  describe('INIT', () => {
    Given(() => {
      couchDBServiceSpy.setStateUpdate.and.returnValue(of(new Subject<any>()));
      // @ts-ignores
      spyOn(componentUnderTest, 'ngOnInit').and.callThrough();
      // @ts-ignore
      spyOn(componentUnderTest, 'getOffers');
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
        expect(componentUnderTest.getOffers).toHaveBeenCalled();
      });
    });

    describe('GIVEN Obeservable sucess THEN call getOffers', () => {
      Given(() => {
        const message = {
          text: 'offer'
        };

        // @ts-ignores
        couchDBServiceSpy.setStateUpdate.and.returnValue(of(message));
        spyOn(console, 'error');
      });
      Then(() => {
        couchDBServiceSpy.setStateUpdate().subscribe(res => {
          if (res.text === 'offer') {
            expect(componentUnderTest.isLoading).toBe(false);
            // @ts-ignores
            expect(componentUnderTest.getOffers).toHaveBeenCalled();
          }
          expect(res).toEqual({ text: 'offer' });
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

  describe('METHOD: getOffers() offers to be greater than 0', () => {
    Given(() => {
      fakeOffers = [
        {
          _id: '1',
          _rev: '1',
          type: 'offer',
          name: 'Customer name'
        }
      ];
      couchDBServiceSpy.getOffers.and.nextOneTimeWith(fakeOffers);
      // @ts-ignore
      spyOn(componentUnderTest, 'getOffers').and.callThrough();
    });

    When(
      fakeAsync(() => {
        // @ts-ignore
        componentUnderTest.getOffers();
        tick();
      })
    );

    Then(() => {
      componentUnderTest.offers$.subscribe(res => {
        expect(res).toEqual(fakeOffers);
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
        '../offer/' + id + '/edit'
      ]);
    });
  });

  describe('METHOD: onRowSelect(event)', () => {
    const id = '1';

    Given(() => {
      spyOn(componentUnderTest, 'onRowSelect').and.callThrough();
    });

    When(() => {
      const event = {
        data: {
          _id: '1'
        }
      };
      componentUnderTest.onRowSelect(event);
    });

    Then(() => {
      expect(router.navigate).toHaveBeenCalledWith(['../offer/1/edit']);
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
            type: 'offer',
            name: 'NeuLand Werbeagentur'
          }
        ]
      };
      componentUnderTest.onFilter(event);
    });

    Then(() => {
      expect(componentUnderTest.offerCount).toBe(1);
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
