import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { takeWhile } from 'rxjs/operators';

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

  alive = true;
  editable = false;

  formTitle: string;
  isNew = true; // 1 = new - 2 = update

  customer: Customer;
  id: string;
  rev: string;
  type: string;

  jobs: Job[] = [];
  offers: Offer[] = [];
  invoices: Invoice[] = [];

  name: string;
  street: string;
  streetNumber: string;
  zip: string;
  city: string;
  telephone: string;
  email: string;
  web: string;
  active = 0;

  constructor(
    private couchDBService: CouchDBService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService
  ) {}

  public ngOnInit() {
    console.log('CustomerEditComponent');
    this.getCustomer();
    this.getJobs();
  }

  private getCustomer() {
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe(results => {
      // check if we are updating
      if (results['id']) {
        console.log('Edit mode');
        this.isNew = false;
        this.formTitle = 'Customer bearbeiten';

        this.couchDBService
          .fetchEntry('/' + results['id'])
          .pipe(takeWhile(() => this.alive))
          .subscribe(entry => {
            this.id = entry['_id'];
            this.rev = entry['_rev'];
            this.type = 'customer';
            this.name = entry['name'];
            this.street = entry['street'];
            this.streetNumber = entry['streetNumber'];
            this.zip = entry['zip'];
            this.city = entry['city'];
            this.telephone = entry['telephone'];
            this.email = entry['email'];
            this.web = entry['web'];
            this.active = entry['active'];
            this.jobs = entry['jobs'];
            this.offers = entry['offers'];
            this.invoices = entry['invoices '];

            console.log();
          });
      } else {
        console.log('New mode');
        this.formTitle = 'Neuen Kunden anlegen';
        this.jobs = [];
        this.invoices = [];
        this.offers = [];
      }
    });
  }

  public onSubmit(): void {
    if (this.customerForm.value.isNew) {
      console.log('Create a user');
      this.onCreateCustomer();
    } else {
      console.log('Update a user');
      this.onUpdateCustomer();
    }
  }

  private onUpdateCustomer(): void {
    this.createWriteItem();

    this.couchDBService
      .updateEntry(this.customer, this.customerForm.value._id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        result => {
          // Inform about Database change.
          this.getCustomer();
          this.sendStateUpdate();
        },
        err => {
          console.log(err);
          this.showConfirm('error', err.message);
        }
      );
  }

  private onCreateCustomer(): void {
    this.createWriteItem();

    this.couchDBService
      .writeEntry(this.customer)
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
              this.router.navigate(['../user']);
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
    this.customer.type = 'user';
    this.customer.name = this.customerForm.value.name || '';
    this.customer.street = this.customerForm.value.street || '';
    this.customer.streetNumber = this.customerForm.value.streetNumber || '';
    this.customer.zip = this.customerForm.value.zip || '';
    this.customer.city = this.customerForm.value.city || '';
    this.customer.telephone = this.customerForm.value.telephone || '';
    this.customer.email = this.customerForm.value.email || '';
    this.customer.web = this.customerForm.value.web || '';
    this.customer.active = this.customerForm.value.active || false;

    if (this.customerForm.value._id) {
      this.customer['_id'] = this.customerForm.value._id;
    }

    if (this.customerForm.value._id) {
      this.customer['_rev'] = this.customerForm.value._rev;
    }

    return this.customer;
  }

  private getJobs() {}

  private showConfirm(type: string, result: string) {
    this.notificationsService.addSingle(
      type,
      result,
      type === 'success' ? 'ok' : 'error'
    );
  }

  private sendStateUpdate(): void {
    this.couchDBService.sendStateUpdate('user');
  }

  public ngOnDestroy(): void {
    this.alive = false;
  }

  public onEdit() {
    this.editable = true;
  }
}
