import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Offer } from '@app/models/offer.model';
import { CouchDBService } from '@app/services/couchDB.service';
import { Router, ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { NotificationsService } from '@app/services/notifications.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-offer-edit',
  templateUrl: './offer-edit.component.html',
  styleUrls: ['./offer-edit.component.scss']
})
export class OfferEditComponent implements OnInit, OnDestroy {
  @ViewChild('offerForm', { static: false }) offerForm: NgForm;

  alive = true;
  editable = false;

  formTitle: string;
  isNew = true; // 1 = new - 2 = update

  writeItem: Offer;
  offers: Offer[] = [];

  id: string;
  rev: string;
  type: string;
  name: string;
  offerNumber: string;
  customer: string;
  customerID: string;
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
    console.log('OfferEditComponent');
    this.getOffer();
  }

  private getOffer() {
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe(results => {
      // check if we are updating
      if (results['id']) {
        console.log('Edit mode');
        this.isNew = false;
        this.formTitle = 'Offer bearbeiten';

        this.couchDBService
          .fetchEntry('/' + results['id'])
          .pipe(takeWhile(() => this.alive))
          .subscribe(entry => {
            this.id = entry['_id'];
            this.rev = entry['_rev'];
            this.type = 'offer';
            this.name = entry['name'];
            this.offerNumber = entry['offerNumber'];
            this.customer = entry['customer'];
            this.customerID = entry['customerID'];
            this.date = entry['date'];
          });
      } else {
        console.log('New mode');
        this.formTitle = 'Neuen Offer anlegen';
        this.offers = [];
      }
    });
  }

  public onSubmit(): void {
    if (this.offerForm.value.isNew) {
      console.log('Create a offer');
      this.onCreateOffer();
    } else {
      console.log('Update a offer');
      this.onUpdateOffer();
    }
  }

  private onUpdateOffer(): void {
    this.createWriteItem();

    this.couchDBService
      .updateEntry(this.writeItem, this.offerForm.value._id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        result => {
          // Inform about Database change.
          this.getOffer();
          this.sendStateUpdate();
        },
        err => {
          console.log(err);
          this.showConfirm('error', err.message);
        }
      );
  }

  private onCreateOffer(): void {
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
              this.router.navigate(['../offer']);
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
    this.writeItem['type'] = 'offer';
    this.writeItem['name'] = this.offerForm.value.name || '';
    this.writeItem['offerNumber'] = this.offerForm.value.offerNumber || '';
    this.writeItem['customer'] = this.offerForm.value.customer || '';
    this.writeItem['customerID'] = this.offerForm.value.customerID || '';
    this.writeItem['date'] = this.offerForm.value.date || '';
    this.writeItem['active'] = this.offerForm.value.active || false;

    if (this.offerForm.value._id) {
      this.writeItem['_id'] = this.offerForm.value._id;
    }

    if (this.offerForm.value._id) {
      this.writeItem['_rev'] = this.offerForm.value._rev;
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
    this.couchDBService.sendStateUpdate('offer');
  }

  public ngOnDestroy(): void {
    this.alive = false;
  }

  public onEdit() {
    this.editable = true;
  }
}
