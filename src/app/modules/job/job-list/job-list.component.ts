import { Job } from './../../../models/job.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '@app/models';
import { CouchDBService } from '@app/services/couchDB.service';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit, OnDestroy {
  alive = true;

  jobs: Job[] = [];
  selectedJob: Job;
  jobCount = 0;

  constructor(private couchDBService: CouchDBService, private router: Router) {}

  ngOnInit() {
    this.couchDBService
      .setStateUpdate()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        message => {
          if (message.text === 'user') {
            this.getJobs();
          }
        },
        err => console.log('Error', err),
        () => console.log('completed.')
      );

    this.getJobs();
  }

  private getJobs() {
    this.couchDBService
      .getJobs()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        res => {
          this.jobs = res;
          this.jobCount = this.jobs.length;
        },
        err => {
          console.log('Error on loading jobs');
        }
      );
  }

  public onRowSelect(event) {
    console.log('onRowSelect');
    console.log(event);
    this.gotoEdit(event.data._id);
  }

  public onFilter(event: any): void {
    this.jobCount = event.filteredValue.length;
  }

  public showDetail(id: string) {
    this.gotoEdit(id);
  }

  private gotoEdit(id: string) {
    console.log('gotoEdit');
    console.log('id');
    this.router.navigate(['../job/' + id + '/edit']);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
