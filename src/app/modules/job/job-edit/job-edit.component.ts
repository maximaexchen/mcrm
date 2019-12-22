import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Job } from '@app/models/job.model';
import { CouchDBService } from '@app/services/couchDB.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '@app/services/notifications.service';
import { ConfirmationService } from 'primeng/api';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.scss']
})
export class JobEditComponent implements OnInit, OnDestroy {
  @ViewChild('jobForm', { static: false }) jobForm: NgForm;

  alive = true;
  editable = false;

  formTitle: string;
  isNew = true; // 1 = new - 2 = update

  writeItem: Job;
  jobs: Job[] = [];

  id: string;
  rev: string;
  type: string;
  name: string;
  date: Date;
  deadline: Date;
  active = 0;

  constructor(
    private couchDBService: CouchDBService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService
  ) {}

  public ngOnInit() {
    console.log('JobEditComponent');
    this.getJob();
  }

  private getJob() {
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe(results => {
      // check if we are updating
      if (results['id']) {
        console.log('Edit mode');
        this.isNew = false;
        this.formTitle = 'Job bearbeiten';

        this.couchDBService
          .fetchEntry('/' + results['id'])
          .pipe(takeWhile(() => this.alive))
          .subscribe(entry => {
            this.id = entry['_id'];
            this.rev = entry['_rev'];
            this.type = 'job';
            this.name = entry['name'];
            this.date = entry['date'];
            this.deadline = entry['deadline'];
          });
      } else {
        console.log('New mode');
        this.formTitle = 'Neuen Job anlegen';
        this.jobs = [];
      }
    });
  }

  public onSubmit(): void {
    if (this.jobForm.value.isNew) {
      console.log('Create a job');
      this.onCreateJob();
    } else {
      console.log('Update a job');
      this.onUpdateJob();
    }
  }

  private onUpdateJob(): void {
    this.createWriteItem();

    this.couchDBService
      .updateEntry(this.writeItem, this.jobForm.value._id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        result => {
          // Inform about Database change.
          this.getJob();
          this.sendStateUpdate();
        },
        err => {
          console.log(err);
          this.showConfirm('error', err.message);
        }
      );
  }

  private onCreateJob(): void {
    this.createWriteItem();

    this.couchDBService
      .writeEntry(this.writeItem)
      .pipe(takeWhile(() => this.alive))
      .subscribe(result => {
        this.sendStateUpdate();
      });
  }

  public onDelete(): void {
    this.confirmationService.confirm({
      message: 'Sie wollen den Datensatz ' + this.name + '?',
      accept: () => {
        this.couchDBService
          .deleteEntry(this.id, this.rev)
          .pipe(takeWhile(() => this.alive))
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

  private createWriteItem() {
    this.writeItem = {};
    this.writeItem['type'] = 'job';
    this.writeItem['name'] = this.jobForm.value.name || '';
    this.writeItem['date'] = this.jobForm.value.date || '';
    this.writeItem['deadline'] = this.jobForm.value.deadline || '';
    this.writeItem['active'] = this.jobForm.value.active || false;

    if (this.jobForm.value._id) {
      this.writeItem['_id'] = this.jobForm.value._id;
    }

    if (this.jobForm.value._id) {
      this.writeItem['_rev'] = this.jobForm.value._rev;
    }

    return this.writeItem;
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

  public ngOnDestroy(): void {
    this.alive = false;
  }

  public onEdit() {
    this.editable = true;
  }
}
