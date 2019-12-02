import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { CouchDBService } from 'src/app//services/couchDB.service';
import { Customer } from '../../../models/customer.model';
import { takeWhile, tap, catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy {
  alive = true;
  isLoading = true;

  customers: Customer[] = [];
  selectedUser: Customer;
  customerCount = 0;
  customers$: Observable<Customer[]>;
  filteredEntries$: Observable<any>;

  constructor(private couchDBService: CouchDBService, private router: Router) {}

  ngOnInit() {
    this.couchDBService
      .setStateUpdate()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        message => {
          if (message.text === 'customer') {
            this.getCustomers();
          }
        },
        err => console.log('Error', err),
        () => console.log('completed.')
      );
    this.getCustomers();
  }

  private getCustomers() {
    this.isLoading = false;
    this.customers$ = this.couchDBService.getCustomers();
  }

  public onRowSelect(event) {
    this.router.navigate(['../customer/' + event.data[0]._id + '/edit']);
  }

  public onFilter(event: any): void {
    this.customerCount = event.filteredValue.length;
  }

  public showDetail(id: string) {
    this.router.navigate(['../customer/' + id + '/edit']);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
