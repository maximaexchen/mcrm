import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { SubSink } from 'SubSink';
import uuidv4 from '@bundled-es-modules/uuid/v4.js';

import { CouchDBService } from '@services/couchDB.service';
import { NotificationsService } from '@services/notifications.service';
import { Job } from '@app/models/job.model';
import { Invoice } from '@app/models/invoice.model';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.scss']
})
export class JobEditComponent implements OnInit, OnDestroy {
  @ViewChild('offerForm', { static: false }) offerForm: NgForm;

  private subs = new SubSink();
  editable = false;

  formTitle: string;
  isNew = true; // 1 = new - 2 = update

  job: Job;

  jobs: Job[] = [];
  offers: Job[] = [];
  invoices: Invoice[] = [];

  constructor(
    private couchDBService: CouchDBService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService
  ) {}

  public ngOnInit() {
    this.setup();
  }

  private setup() {
    this.subs.sink = this.route.params.subscribe(results => {
      // check if we are updating
      if (results['id']) {
        console.log('Edit mode');
        this.editJob(results['id']);
      } else {
        console.log('New mode');
        this.newJob();
      }
    });
  }

  private editJob(id: string) {
    this.isNew = false;
    this.formTitle = 'Job bearbeiten';

    this.subs.sink = this.couchDBService.fetchEntry('/' + id).subscribe(
      job => {
        this.job = job;
      },
      error => {
        console.error(error);
      }
    );
  }

  private newJob() {
    this.formTitle = 'Neuen Kunden anlegen';
    this.isNew = true;
    this.editable = true;

    this.job = {
      _id: uuidv4(),
      type: 'job'
    };
  }

  public onSubmit(): void {
    if (this.isNew) {
      console.log('Create a user');
      this.saveJob();
    } else {
      console.log('Update a user');
      this.updateJob();
    }
  }

  private updateJob(): void {
    this.subs.sink = this.couchDBService
      .updateEntry(this.job, this.job._id)
      .subscribe(
        result => {
          // Inform about Database change.
          this.sendStateUpdate();
        },
        err => {
          console.error(err);
          this.showConfirm('error', err.message);
        }
      );
  }

  private saveJob(): void {
    console.log(this.job);
    this.subs.sink = this.couchDBService.writeEntry(this.job).subscribe(
      result => {
        this.sendStateUpdate();
      },
      error => {
        console.error(error);
        this.showConfirm('error', error.message);
      }
    );
  }

  public deleteJob(): void {
    console.log('DDDD');
    this.confirmationService.confirm({
      message: 'Sie wollen den Datensatz ' + this.job.name + '?',
      accept: () => {
        console.log('FFFFFF');
        this.subs.sink = this.couchDBService
          .deleteEntry(this.job._id, this.job._rev)
          .subscribe(
            res => {
              this.sendStateUpdate();
              this.router.navigate(['../job']);
            },
            err => {
              this.showConfirm('error', err.message);
            }
          );
      },
      reject: () => {}
    });
  }

  private showConfirm(type: string, result: string) {
    this.notificationsService.addSingle(
      type,
      result,
      type === 'success' ? 'ok' : 'error'
    );
  }

  private sendStateUpdate(): void {
    this.couchDBService.sendStateUpdate('job');
  }

  public onEdit() {
    this.editable = true;
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
