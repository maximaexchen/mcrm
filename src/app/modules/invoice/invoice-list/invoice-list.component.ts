import { Component, OnInit, OnDestroy } from '@angular/core';
import { Invoice } from '@app/models/invoice.model';
import { CouchDBService } from '@app/services/couchDB.service';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit, OnDestroy {
  alive = true;

  invoices: Invoice[] = [];
  selectedInvoice: Invoice;
  invoiceCount = 0;

  constructor(private couchDBService: CouchDBService, private router: Router) {}

  ngOnInit() {
    this.couchDBService
      .setStateUpdate()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        message => {
          if (message.text === 'invoice') {
            this.getInvoices();
          }
        },
        err => console.log('Error', err),
        () => console.log('completed.')
      );

    this.getInvoices();
  }

  private getInvoices() {
    this.couchDBService
      .getInvoices()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        res => {
          this.invoices = res;
          this.invoiceCount = this.invoices.length;
        },
        err => {
          console.log('Error on loading invoices');
        }
      );
  }

  public onRowSelect(event) {
    console.log(event.data);
    this.router.navigate(['../invoice/' + event.data._id + '/edit']);
  }

  public onFilter(event: any): void {
    this.invoiceCount = event.filteredValue.length;
  }

  public showDetail(id: string) {
    this.router.navigate(['../invoice/' + id + '/edit']);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
