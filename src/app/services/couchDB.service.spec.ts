import {
  TestBed,
  fakeAsync,
  tick,
  flushMicrotasks
} from '@angular/core/testing';
import { Customer } from '@app/models/customer.model';
import { CouchDBService } from 'src/app/services/couchDB.service';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { HttpClient } from '@angular/common/http';
import { of, Subject, Observable } from 'rxjs';
import { Job, Offer } from '@app/models';

describe('CouchDBService test', () => {
  let serviceUnderTest: CouchDBService;
  // Spy comes from Hirez.io auto-spies!
  // Not necessry to use the HttpClientTestingModule
  let httpSpy: Spy<HttpClient>;
  let fakeObject: any;
  let expectestFakeObject: any;
  let fakeCustomers: {};
  let fakeCustomersOutput: Customer[];
  let fakeJobs: {};
  let fakeJobsOutput: Job[];
  let fakeOffers: {};
  let fakeOffersOutput: Offer[];
  let fakeInvoices: {};
  let fakeInvoicesOutput: Offer[];
  let actualResult: any;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        CouchDBService,
        { provide: HttpClient, useValue: createSpyFromClass(HttpClient) }
      ]
    });

    serviceUnderTest = TestBed.get(CouchDBService);
    httpSpy = TestBed.get(HttpClient);

    fakeObject = undefined;
    expectestFakeObject = undefined;
  });

  describe('METHOD writeEntry', () => {
    When(() => {
      serviceUnderTest
        .writeEntry(fakeObject)
        .subscribe(value => (expectestFakeObject = value));
    });

    describe('GIVEN a successful request THEN return a object', () => {
      Given(() => {
        fakeObject = {
          ok: true,
          id: '1'
        };

        httpSpy.post.and.nextOneTimeWith(fakeObject);
      });

      Then(() => {
        expect(expectestFakeObject).toEqual(fakeObject);
      });
    });
  });

  describe('METHOD updateEntry', () => {
    When(() => {
      serviceUnderTest.updateEntry(fakeObject, '1').subscribe(value => {
        expectestFakeObject = value;
      });
    });

    describe('GIVEN a successful request THEN return a object', () => {
      Given(() => {
        fakeObject = {
          ok: true,
          id: '1',
          rev: '1'
        };

        httpSpy.put.and.nextOneTimeWith(fakeObject);
      });

      Then(() => {
        expect(expectestFakeObject).toEqual(fakeObject);
      });
    });
  });

  describe('METHOD fetchEntry', () => {
    When(() => {
      serviceUnderTest.fetchEntry('1').subscribe(value => {
        expectestFakeObject = value;
      });
    });

    describe('GIVEN a successful request THEN return a object', () => {
      Given(() => {
        fakeObject = {
          _ig: '1',
          _rev: '1',
          name: 'Customer name'
        };

        httpSpy.get.and.nextOneTimeWith(fakeObject);
      });

      Then(() => {
        expect(expectestFakeObject).toEqual(fakeObject);
      });
    });
  });

  describe('METHOD deleteEntry', () => {
    When(() => {
      serviceUnderTest.deleteEntry('1', '1').subscribe(value => {
        expectestFakeObject = value;
      });
    });

    describe('GIVEN a successful request THEN return a object', () => {
      Given(() => {
        fakeObject = {
          _id: '1',
          name: 'MyName'
        };

        httpSpy.delete.and.nextOneTimeWith(fakeObject);
      });

      Then(() => {
        expect(expectestFakeObject).toEqual(fakeObject);
      });
    });
  });

  describe('METHOD: getCustomers()', () => {
    When(() => {
      serviceUnderTest
        .getCustomers()
        .subscribe(value => (actualResult = value));
    });

    describe('GIVEN successfull request THEN return the customers', () => {
      Given(() => {
        fakeCustomers = {
          total_rows: 5,
          offset: 0,
          rows: [
            {
              id: '1',
              key: 'Customer name',
              value: '1',
              doc: {
                _id: '1',
                _rev: '1',
                type: 'customer',
                name: 'Customer name'
              }
            }
          ]
        };
        httpSpy.get.and.nextWith(fakeCustomers);
      });

      Then(() => {
        fakeCustomersOutput = [
          {
            _id: '1',
            _rev: '1',
            type: 'customer',
            name: 'Customer name'
          }
        ];
        expect(actualResult).toEqual(fakeCustomersOutput);
      });
    });
  });

  describe('METHOD: getJobs()', () => {
    When(() => {
      serviceUnderTest.getJobs().subscribe(value => (actualResult = value));
    });

    describe('GIVEN successfull request THEN return the jobs', () => {
      Given(() => {
        fakeJobs = {
          total_rows: 1,
          offset: 0,
          rows: [
            {
              id: '1',
              key: 'Job name',
              value: '1',
              doc: {
                _id: '1',
                _rev: '1',
                type: 'job',
                name: 'Job name'
              }
            }
          ]
        };
        httpSpy.get.and.nextWith(fakeJobs);
      });

      Then(() => {
        fakeJobsOutput = [
          {
            _id: '1',
            _rev: '1',
            type: 'job',
            name: 'Job name'
          }
        ];
        expect(actualResult).toEqual(fakeJobsOutput);
      });
    });
  });

  describe('METHOD: getOffers()', () => {
    When(() => {
      serviceUnderTest.getOffers().subscribe(value => (actualResult = value));
    });

    describe('GIVEN successfull request THEN return the offers', () => {
      Given(() => {
        fakeOffers = {
          total_rows: 1,
          offset: 0,
          rows: [
            {
              id: '1',
              key: 'Offer name',
              value: '1',
              doc: {
                _id: '1',
                _rev: '1',
                type: 'offer',
                name: 'Offer name'
              }
            }
          ]
        };
        httpSpy.get.and.nextWith(fakeOffers);
      });

      Then(() => {
        fakeOffersOutput = [
          {
            _id: '1',
            _rev: '1',
            type: 'offer',
            name: 'Offer name'
          }
        ];
        expect(actualResult).toEqual(fakeOffersOutput);
      });
    });
  });

  describe('METHOD: getInvoices()', () => {
    When(() => {
      serviceUnderTest.getInvoices().subscribe(value => (actualResult = value));
    });

    describe('GIVEN successfull request THEN return the invoices', () => {
      Given(() => {
        fakeInvoices = {
          total_rows: 1,
          offset: 0,
          rows: [
            {
              id: '1',
              key: 'Invoice name',
              value: '1',
              doc: {
                _id: '1',
                _rev: '1',
                type: 'invoice',
                name: 'Invoice name'
              }
            }
          ]
        };
        httpSpy.get.and.nextWith(fakeInvoices);
      });

      Then(() => {
        fakeInvoicesOutput = [
          {
            _id: '1',
            _rev: '1',
            type: 'invoice',
            name: 'Invoice name'
          }
        ];
        expect(actualResult).toEqual(fakeInvoicesOutput);
      });
    });
  });

  /* describe('METHOD: setStateUpdate', () => {
    Given(() => {
      // @ts-ignore
      serviceUnderTest.updateSubject.next('Hello');
      spyOn(serviceUnderTest, 'sendStateUpdate')
        .withArgs('Yep')
        .and.callThrough();
    });

    When(
      fakeAsync(() => {
        serviceUnderTest.setStateUpdate();
        tick();
      })
    );

    Then(() => {
      // @ts-ignore
      serviceUnderTest.updateSubject.subscribe(message => {
        console.log('message: ' + message);
        expect(message).toBe('test');
      });
    });
  }); */

  describe('METHOD: sendStateUpdate', () => {
    Given(() => {
      // @ts-ignore
      spyOn(serviceUnderTest, 'setStateUpdate').and.returnValue(of('test'));
    });

    When(() => {
      serviceUnderTest.sendStateUpdate('test');
    });

    Then(() => {
      serviceUnderTest.setStateUpdate().subscribe(message => {
        expect(message).toBe('test');
      });
    });
  });
});
