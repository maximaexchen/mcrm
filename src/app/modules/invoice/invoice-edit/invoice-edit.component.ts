import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Invoice } from '@app/models/invoice.model';
import { CouchDBService } from '@app/services/couchDB.service';
import { Router, ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { NotificationsService } from '@app/services/notifications.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.scss']
})
export class InvoiceEditComponent implements OnInit, OnDestroy {
  @ViewChild('invoiceForm', { static: false }) invoiceForm: NgForm;

  alive = true;
  editable = false;

  formTitle: string;
  isNew = true; // 1 = new - 2 = update

  writeItem: Invoice;
  invoices: Invoice[] = [];

  id: string;
  rev: string;
  type: string;
  name: string;
  date: Date;
  active = 0;

  constructor(
    private couchDBService: CouchDBService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService
  ) {}

  public ngOnInit() {
    console.log('InvoiceEditComponent');
    this.getInvoice();
  }

  private getInvoice() {
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe(results => {
      // check if we are updating
      if (results['id']) {
        console.log('Edit mode');
        this.isNew = false;
        this.formTitle = 'Invoice bearbeiten';

        this.couchDBService
          .fetchEntry('/' + results['id'])
          .pipe(takeWhile(() => this.alive))
          .subscribe(entry => {
            this.id = entry['_id'];
            this.rev = entry['_rev'];
            this.type = 'invoice';
            this.name = entry['name'];
            this.date = entry['date'];
          });
      } else {
        console.log('New mode');
        this.formTitle = 'Neuen Invoice anlegen';
        this.invoices = [];
      }
    });
  }

  public onSubmit(): void {
    if (this.invoiceForm.value.isNew) {
      console.log('Create a invoice');
      this.onCreateInvoice();
    } else {
      console.log('Update a invoice');
      this.onUpdateInvoice();
    }
  }

  private onUpdateInvoice(): void {
    this.createWriteItem();

    this.couchDBService
      .updateEntry(this.writeItem, this.invoiceForm.value._id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        result => {
          // Inform about Database change.
          this.getInvoice();
          this.sendStateUpdate();
        },
        err => {
          console.log(err);
          this.showConfirm('error', err.message);
        }
      );
  }

  private onCreateInvoice(): void {
    this.createWriteItem();

    this.couchDBService
      .writeEntry(this.writeItem)
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

  private createWriteItem() {
    this.writeItem = {};
    this.writeItem['type'] = 'invoice';
    this.writeItem['name'] = this.invoiceForm.value.name || '';
    this.writeItem['date'] = this.invoiceForm.value.date || '';
    this.writeItem['active'] = this.invoiceForm.value.active || false;

    if (this.invoiceForm.value._id) {
      this.writeItem['_id'] = this.invoiceForm.value._id;
    }

    if (this.invoiceForm.value._id) {
      this.writeItem['_rev'] = this.invoiceForm.value._rev;
    }

    return this.writeItem;
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

  public ngOnDestroy(): void {
    this.alive = false;
  }

  public onEdit() {
    this.editable = true;
  }
}
