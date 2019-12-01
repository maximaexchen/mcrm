import { TestBed } from '@angular/core/testing';
import { Customer } from '@app/models/customer.model';
import { CouchDBService } from 'src/app/services/couchDB.service';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { HttpClient } from '@angular/common/http';

describe('CouchDBService test', () => {
  let serviceUnderTest: CouchDBService;
  // Spy comes from Hirez.io auto-spies!
  // Not necessry to use the HttpClientTestingModule
  let httpSpy: Spy<HttpClient>;
  let fakeCustomersInput: {};
  let fakeCustomersOutput: Customer[];
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

    fakeCustomersOutput = undefined;
    fakeCustomersInput = undefined;
    actualResult = undefined;
  });

  describe('METHOD: getCustomers()', () => {
    When(() => {
      serviceUnderTest
        .getCustomers()
        .subscribe(value => (actualResult = value));
    });

    describe('GIVEN successfull request THEN return the customers', () => {
      Given(() => {
        fakeCustomersInput = {
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
        httpSpy.get.and.nextWith(fakeCustomersInput);
      });

      Then(() => {
        console.log('Then');
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
});
