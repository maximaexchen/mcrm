import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { SubSink } from 'SubSink';
import uuidv4 from '@bundled-es-modules/uuid/v4.js';

import { CouchDBService } from '@services/couchDB.service';
import { NotificationsService } from '@services/notifications.service';
import { Invoice } from '@app/models/invoice.model';
import { Job } from '@app/models/job.model';
import { Offer } from '@app/models/offer.model';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.scss']
})
export class InvoiceEditComponent implements OnInit, OnDestroy {
  @ViewChild('customerForm', { static: false }) customerForm: NgForm;

  private subs = new SubSink();
  editable = false;

  formTitle: string;
  isNew = true; // 1 = new - 2 = update

  invoice: Invoice;

  jobs: Job[] = [];
  offers: Offer[] = [];
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
        this.editInvoice(results['id']);
      } else {
        console.log('New mode');
        this.newInvoice();
      }
    });
  }

  private editInvoice(id: string) {
    this.isNew = false;
    this.formTitle = 'Invoice bearbeiten';

    this.subs.sink = this.couchDBService.fetchEntry('/' + id).subscribe(
      invoice => {
        this.invoice = invoice;
      },
      error => {
        console.error(error);
      }
    );
  }

  private newInvoice() {
    this.formTitle = 'Neuen Kunden anlegen';
    this.isNew = true;
    this.editable = true;

    this.invoice = {
      _id: uuidv4(),
      type: 'invoice'
    };
  }

  public onSubmit(): void {
    if (this.isNew) {
      console.log('Create a user');
      this.saveInvoice();
    } else {
      console.log('Update a user');
      this.updateInvoice();
    }
  }

  private updateInvoice(): void {
    this.subs.sink = this.couchDBService
      .updateEntry(this.invoice, this.invoice._id)
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

  private saveInvoice(): void {
    console.log(this.invoice);
    this.subs.sink = this.couchDBService.writeEntry(this.invoice).subscribe(
      result => {
        this.sendStateUpdate();
      },
      error => {
        console.error(error);
        this.showConfirm('error', error.message);
      }
    );
  }

  public deleteInvoice(): void {
    this.confirmationService.confirm({
      message: 'Sie wollen den Datensatz ' + this.invoice.name + '?',
      accept: () => {
        this.subs.sink = this.couchDBService
          .deleteEntry(this.invoice._id, this.invoice._rev)
          .subscribe(
            res => {
              this.sendStateUpdate();
              this.router.navigate(['../invoice']);
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
    this.couchDBService.sendStateUpdate('invoice');
  }

  public onEdit() {
    this.editable = true;
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
