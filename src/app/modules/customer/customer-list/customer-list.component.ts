import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'SubSink';

import { CouchDBService } from 'src/app//services/couchDB.service';
import { Customer } from '../../../models/customer.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  isLoading = true;

  customers: Customer[] = [];
  selectedUser: Customer;
  customerCount = 0;
  customers$: Observable<Customer[]>;
  filteredEntries$: Observable<any>;

  constructor(private couchDBService: CouchDBService, private router: Router) {}

  ngOnInit() {
    this.subs.sink = this.couchDBService.setStateUpdate().subscribe(
      message => {
        if (message.text === 'customer') {
          this.isLoading = false;
          this.getCustomers();
        }
      },
      err => {
        console.error('Error');
      }
    );
    this.getCustomers();
  }

  private getCustomers() {
    this.isLoading = false;
    this.customers$ = this.couchDBService.getCustomers();
  }

  public onRowSelect(event) {
    console.log(JSON.stringify(event));
    this.router.navigate(['../customer/' + event.data._id + '/edit']);
  }

  public onFilter(event: any): void {
    this.customerCount = event.filteredValue.length;
  }

  public showDetail(id: string) {
    this.router.navigate(['../customer/' + id + '/edit']);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
