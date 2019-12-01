import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { CouchDBService } from 'src/app//services/couchDB.service';
import { Customer } from '../../../models/customer.model';
import { takeWhile } from 'rxjs/operators';

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
    this.couchDBService
      .getCustomers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        res => {
          this.customers = res;
          this.customerCount = this.customers.length;
        },
        err => {
          console.log('Error on loading customers');
        }
      );
  }

  public onRowSelect(event) {
    console.log('onRowSelect');
    console.log(event);
    console.log(event.data);
    this.router.navigate(['../customer/' + event.data._id + '/edit']);
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
