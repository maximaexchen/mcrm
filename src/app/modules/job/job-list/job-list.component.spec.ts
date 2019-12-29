import { CouchDBService } from 'src/app/services/couchDB.service';
import { GeneralModule } from './../../general.module';
import { JobListComponent } from './job-list.component';
import { Job } from './../../../models/job.model';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { of, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('JobListComponent', () => {
  let componentUnderTest: JobListComponent;
  let couchDBServiceSpy: Spy<CouchDBService>;
  let fakeJobs: Job[];
  let router = {
    navigate: jasmine.createSpy('navigate') // to spy on the url that has been routed
  };

  Given(() => {
    TestBed.configureTestingModule({
      imports: [GeneralModule, RouterTestingModule],
      declarations: [],
      providers: [
        JobListComponent,
        {
          provide: CouchDBService,
          useValue: createSpyFromClass(CouchDBService)
        },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    componentUnderTest = TestBed.get(JobListComponent);
    couchDBServiceSpy = TestBed.get(CouchDBService);

    fakeJobs = undefined;
  });

  describe('INIT', () => {
    Given(() => {
      couchDBServiceSpy.setStateUpdate.and.returnValue(of(new Subject<any>()));
      // @ts-ignores
      spyOn(componentUnderTest, 'ngOnInit').and.callThrough();
      // @ts-ignore
      spyOn(componentUnderTest, 'getJobs');
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
        expect(componentUnderTest.getJobs).toHaveBeenCalled();
      });
    });

    describe('GIVEN Obeservable sucess THEN call getJobs', () => {
      Given(() => {
        const message = {
          text: 'job'
        };

        // @ts-ignores
        couchDBServiceSpy.setStateUpdate.and.returnValue(of(message));
        spyOn(console, 'error');
      });
      Then(() => {
        couchDBServiceSpy.setStateUpdate().subscribe(res => {
          if (res.text === 'job') {
            expect(componentUnderTest.isLoading).toBe(false);
            // @ts-ignores
            expect(componentUnderTest.getJobs).toHaveBeenCalled();
          }
          expect(res).toEqual({ text: 'job' });
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

  describe('METHOD: getJobs() jobs to be greater than 0', () => {
    Given(() => {
      fakeJobs = [
        {
          _id: '1',
          _rev: '1',
          type: 'job',
          name: 'Customer name'
        }
      ];
      couchDBServiceSpy.getJobs.and.nextOneTimeWith(fakeJobs);
      // @ts-ignore
      spyOn(componentUnderTest, 'getJobs').and.callThrough();
    });

    When(
      fakeAsync(() => {
        // @ts-ignore
        componentUnderTest.getJobs();
        tick();
      })
    );

    Then(() => {
      componentUnderTest.jobs$.subscribe(res => {
        expect(res).toEqual(fakeJobs);
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
      expect(router.navigate).toHaveBeenCalledWith(['../job/' + id + '/edit']);
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
      expect(router.navigate).toHaveBeenCalledWith(['../job/1/edit']);
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
            type: 'job',
            name: 'NeuLand Werbeagentur'
          }
        ]
      };
      componentUnderTest.onFilter(event);
    });

    Then(() => {
      expect(componentUnderTest.jobCount).toBe(1);
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
