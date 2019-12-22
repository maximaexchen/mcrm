import { Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Invoice } from '@app/models/invoice.model';
import { CouchDBService } from '@app/services/couchDB.service';
import { Router } from '@angular/router';
import { SubSink } from 'SubSink';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  invoices: Invoice[] = [];
  selectedInvoice: Invoice;
  invoices$: Observable<Invoice[]>;
  invoiceCount = 0;
  isLoading = true;

  constructor(private couchDBService: CouchDBService, private router: Router) {}

  ngOnInit() {
    this.subs.sink = this.couchDBService.setStateUpdate().subscribe(
      message => {
        if (message.text === 'invoice') {
          this.getInvoices();
        }
      },
      err => {
        console.error('Error');
      }
    );

    this.getInvoices();
  }

  private getInvoices() {
    this.invoices$ = this.couchDBService.getInvoices();
  }

  public onRowSelect(event) {
    this.router.navigate(['../invoice/' + event.data[0]._id + '/edit']);
  }

  public onFilter(event: any): void {
    this.invoiceCount = event.filteredValue.length;
  }

  public showDetail(id: string) {
    this.router.navigate(['../invoice/' + id + '/edit']);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
