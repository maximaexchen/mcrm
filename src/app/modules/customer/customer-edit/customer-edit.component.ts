import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { SubSink } from 'SubSink';
import uuidv4 from '@bundled-es-modules/uuid/v4.js';

import { CouchDBService } from '@services/couchDB.service';
import { NotificationsService } from '@services/notifications.service';
import { Customer } from '@app/models/customer.model';
import { Job } from '@app/models/job.model';
import { Offer } from '@app/models/offer.model';
import { Invoice } from '@app/models/invoice.model';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnInit, OnDestroy {
  @ViewChild('customerForm', { static: false }) customerForm: NgForm;

  private subs = new SubSink();
  editable = false;

  formTitle: string;
  isNew = true; // 1 = new - 2 = update

  customer: Customer;

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
        this.editCustomer(results['id']);
      } else {
        console.log('New mode');
        this.newCustomer();
      }
    });
  }

  private editCustomer(id: string) {
    this.isNew = false;
    this.formTitle = 'Customer bearbeiten';

    this.subs.sink = this.couchDBService.fetchEntry('/' + id).subscribe(
      customer => {
        this.customer = customer;
      },
      error => {
        console.error(error);
      }
    );
  }

  private newCustomer() {
    this.formTitle = 'Neuen Kunden anlegen';
    this.isNew = true;
    this.editable = true;

    this.customer = {
      _id: uuidv4(),
      type: 'customer',
      active: true
    };
  }

  public onSubmit(): void {
    if (this.isNew) {
      console.log('Create a user');
      this.saveCustomer();
    } else {
      console.log('Update a user');
      this.updateCustomer();
    }
  }

  private updateCustomer(): void {
    this.subs.sink = this.couchDBService
      .updateEntry(this.customer, this.customer._id)
      .subscribe(
        result => {
          this.sendStateUpdate();
        },
        err => {
          console.error(err);
          this.showConfirm('error', err.message);
        }
      );
  }

  private saveCustomer(): void {
    console.log(this.customer);
    this.subs.sink = this.couchDBService.writeEntry(this.customer).subscribe(
      result => {
        this.sendStateUpdate();
      },
      error => {
        console.error(error);
        this.showConfirm('error', error.message);
      }
    );
  }

  public deleteCustomer(): void {
    this.confirmationService.confirm({
      message: 'Sie wollen den Datensatz ' + this.customer.name + '?',
      accept: () => {
        this.subs.sink = this.couchDBService
          .deleteEntry(this.customer._id, this.customer._rev)
          .subscribe(
            res => {
              this.sendStateUpdate();
              this.router.navigate(['../customer']);
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
    this.couchDBService.sendStateUpdate('customer');
  }

  public onEdit() {
    this.editable = true;
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
