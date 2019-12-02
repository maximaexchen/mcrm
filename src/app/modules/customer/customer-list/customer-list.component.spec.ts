import { Customer } from '@app/models/customer.model';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerListComponent } from './customer-list.component';
import { GeneralModule } from '@app/modules/general.module';
import { CouchDBService } from '@app/services/couchDB.service';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('CustomerListComponent', () => {
  let componentUnderTest: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;
  let couchDBServiceSpy: Spy<CouchDBService>;
  let couchDBService: CouchDBService;
  let fakeCustomers: Customer[];
  let fakeCustomersInput: Customer[];
  let router = {
    navigate: jasmine.createSpy('navigate') // to spy on the url that has been routed
  };

  Given(() => {
    TestBed.configureTestingModule({
      imports: [GeneralModule, RouterTestingModule],
      declarations: [CustomerListComponent],
      providers: [{ provide: Router, useValue: router }]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerListComponent);
    componentUnderTest = fixture.componentInstance;
    couchDBServiceSpy = createSpyFromClass(CouchDBService);
    couchDBService = TestBed.get(CouchDBService);

    fakeCustomers = undefined;
    fakeCustomersInput = undefined;
  });

  describe('INIT', () => {
    Given(() => {
      // @ts-ignores
      spyOn(componentUnderTest, 'getCustomers').and.callThrough();
    });

    When(() => {
      // @ts-ignore
      componentUnderTest.ngOnInit();
      fixture.detectChanges();
    });

    Then(() => {
      fixture.detectChanges();
      expect(componentUnderTest).toBeTruthy();
      // @ts-ignore
      expect(componentUnderTest.getCustomers).toHaveBeenCalled();
      expect(componentUnderTest.isLoading).toBe(false);
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
    });

    When(
      async(() => {
        // @ts-ignore
        componentUnderTest.getCustomers();
        fixture.detectChanges();
      })
    );

    Then(() => {
      // expect(componentUnderTest.customers).toEqual(fakeCustomers);
      // @ts-ignore
      expect(componentUnderTest.customers.length).toBeGreaterThan(0);
      expect(componentUnderTest.customerCount).toBeGreaterThan(0);
    });
  });

  describe('GIVEN successfull request THEN return mocked customers', () => {
    Given(() => {
      fakeCustomersInput = [
        {
          _id: '1',
          _rev: '1',
          type: 'customer',
          name: 'Customer name'
        }
      ];

      spyOn(couchDBService, 'getCustomers').and.returnValue(
        of(fakeCustomersInput)
      );
    });

    When(() => {
      componentUnderTest.ngOnInit();
      fixture.detectChanges();
    });

    describe('EXPECT mocked customers to be one', () => {
      Then(() => {
        expect(fixture.componentInstance.customers.length).toBe(1);
      });
    });

    describe('EXPECT mocked customers to be correct customer object', () => {
      Then(() => {
        expect(componentUnderTest.customers).toEqual([
          {
            _id: '1',
            _rev: '1',
            type: 'customer',
            name: 'Customer name'
          }
        ]);
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
      fixture.detectChanges();
    });

    Then(
      async(() => {
        expect(router.navigate).toHaveBeenCalledWith([
          '../customer/' + id + '/edit'
        ]);
      })
    );
  });
});
