import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'SubSink';

import { CouchDBService } from 'src/app//services/couchDB.service';
import { Observable } from 'rxjs';
import { Job } from '@app/models/job.model';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  isLoading = true;

  customers: Job[] = [];
  selectedUser: Job;
  jobCount = 0;
  jobs$: Observable<Job[]>;
  filteredEntries$: Observable<any>;

  constructor(private couchDBService: CouchDBService, private router: Router) {}

  ngOnInit() {
    this.subs.sink = this.couchDBService.setStateUpdate().subscribe(
      message => {
        if (message.text === 'job') {
          this.isLoading = false;
          this.getJobs();
        }
      },
      err => {
        console.error('Error');
      }
    );
    this.getJobs();
  }

  private getJobs() {
    this.isLoading = false;
    this.jobs$ = this.couchDBService.getJobs();
  }

  public onRowSelect(event) {
    this.router.navigate(['../job/' + event.data._id + '/edit']);
  }

  public onFilter(event: any): void {
    this.jobCount = event.filteredValue.length;
  }

  public showDetail(id: string) {
    this.router.navigate(['../job/' + id + '/edit']);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
