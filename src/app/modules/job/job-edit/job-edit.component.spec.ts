import { JobEditComponent } from './job-edit.component';

import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GeneralModule } from '@app/modules/general.module';
import { CouchDBService } from '@app/services/couchDB.service';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { of, Subject, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Job } from '@app/models';
import { MessageService, ConfirmationService, Confirmation } from 'primeng/api';
import { NotificationsService } from '@app/services/notifications.service';

describe('JobEditComponent', () => {
  let componentUnderTest: JobEditComponent;
  let couchDBServiceSpy: Spy<CouchDBService>;
  let confirmationServiceSpy: Spy<ConfirmationService>;
  let confirmationService: ConfirmationService;
  let fakeJob: Job;
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
        JobEditComponent,
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

    componentUnderTest = TestBed.get(JobEditComponent);
    couchDBServiceSpy = TestBed.get(CouchDBService);
    activatedRoute = TestBed.get(ActivatedRoute);
    confirmationServiceSpy = TestBed.get(ConfirmationService);
    confirmationService = new ConfirmationService();

    fakeJob = undefined;
  });

  describe('INIT', () => {
    Given(() => {
      fakeJob = {
        _id: '1',
        type: 'job',
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

    describe('GIVEN activatedRoute params THEN call editJob', () => {
      Given(() => {
        activatedRoute.params = of({ id: 2 });
        // @ts-ignore
        spyOn(componentUnderTest, 'editJob');
      });
      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.editJob).toHaveBeenCalled();
      });
    });

    describe('GIVEN empty activatedRoute params THEN call newJob', () => {
      Given(() => {
        activatedRoute.params = of({});
        // @ts-ignore
        spyOn(componentUnderTest, 'newJob');
      });
      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.newJob).toHaveBeenCalled();
      });
    });
  });

  describe('METHOD editJob', () => {
    Given(() => {
      id = '1';
      fakeJob = {
        _id: '2',
        _rev: '1',
        type: 'job',
        name: 'AAA'
      };
      couchDBServiceSpy.fetchEntry.and.nextOneTimeWith(fakeJob);
      // @ts-ignore
      spyOn(componentUnderTest, 'editJob').and.callThrough();
    });

    When(
      fakeAsync(() => {
        // @ts-ignore
        componentUnderTest.editJob(id);
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
          .nextOneTimeWith(fakeJob);
      });

      Then(() => {
        expect(componentUnderTest.job).toEqual(fakeJob);
      });
    });
  });

  describe('METHOD newJob', () => {
    Given(() => {
      componentUnderTest.formTitle = 'dd';
      componentUnderTest.isNew = false;
      componentUnderTest.editable = false;

      // @ts-ignore
      spyOn(componentUnderTest, 'newJob').and.callThrough();
    });

    When(() => {
      // @ts-ignore
      componentUnderTest.newJob();
    });

    Then(() => {
      expect(componentUnderTest.formTitle).toEqual('Neuen Kunden anlegen');
      expect(componentUnderTest.isNew).toBe(true);
      expect(componentUnderTest.editable).toBe(true);
      expect(componentUnderTest.job.type).toEqual('job');
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
        spyOn(componentUnderTest, 'saveJob');
      });

      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.saveJob).toHaveBeenCalled();
      });
    });

    describe('GIVEN isNEw is false', () => {
      Given(() => {
        componentUnderTest.isNew = false;
        // @ts-ignore
        spyOn(componentUnderTest, 'updateJob');
      });

      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.updateJob).toHaveBeenCalled();
      });
    });
  });

  describe('METHOD updateJob', () => {
    Given(() => {
      fakeJob = {
        _id: '1',
        type: 'job',
        name: 'AAA'
      };
      componentUnderTest.job = fakeJob;
      componentUnderTest.job._id = '1';
      // @ts-ignore
      spyOn(componentUnderTest, 'sendStateUpdate');
    });

    describe('Given job THEN success', () => {
      Given(() => {
        // @ts-ignore
        couchDBServiceSpy.updateEntry.and.returnValue(of(fakeJob));
      });

      When(
        fakeAsync(() => {
          // @ts-ignore
          componentUnderTest.updateJob();
          tick();
        })
      );

      Then(() => {
        // @ts-ignore
        expect(componentUnderTest.sendStateUpdate).toHaveBeenCalled();
      });
    });

    describe('Given job THEN error', () => {
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
          componentUnderTest.updateJob();
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

  describe('METHOD saveJob', () => {
    Given(() => {
      // @ts-ignore
      spyOn(componentUnderTest, 'saveJob').and.callThrough();
      // @ts-ignore
      spyOn(componentUnderTest, 'sendStateUpdate');
      // @ts-ignore
      spyOn(componentUnderTest, 'showConfirm');
    });

    When(
      fakeAsync(() => {
        // @ts-ignore
        componentUnderTest.saveJob();
        tick();
      })
    );

    describe('GIVEN job THEN save success', () => {
      Given(() => {
        // @ts-ignore
        couchDBServiceSpy.writeEntry.and.nextOneTimeWith(fakeJob);
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

  describe('METHOD deleteJob', () => {
    Given(() => {
      fakeJob = {
        _id: '1',
        _rev: '1',
        type: 'job',
        name: 'AAA'
      };

      confirmation = {
        message: 'Sie wollen den Datensatz ' + fakeJob.name + '?',
        accept: () => console.log('accept in conf')
      };

      confirmationService = new ConfirmationService();

      componentUnderTest.job = fakeJob;

      // @ts-ignore
      spyOn(componentUnderTest, 'deleteJob').and.callThrough();
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
        componentUnderTest.deleteJob();
        tick();
      })
    );

    describe('GIVEN job THEN delete job', () => {
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
            .calledWith(fakeJob, fakeJob._id)
            .nextOneTimeWith(fakeJob);
        })
      );

      Then(() => {
        //  console.log('acc ' + JSON.stringify(confirmationService.accept));
        /* confirmationService.accept.subscribe(
            res => {
              console.log('res ' + res);
            },
            err => console.log('err ' + err),
            () => console.log('complete ')
          ); */
        // @ts-ignore
        /*  couchDBServiceSpy
          .deleteEntry(fakeJob, fakeJob._id)
          .subscribe(res => {
            // @ts-ignore
            expect(componentUnderTest.sendStateUpdate).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(['../job']);
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
      expect(couchDBServiceSpy.sendStateUpdate).toHaveBeenCalledWith('job');
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
