import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { SubSink } from 'SubSink';
import uuidv4 from '@bundled-es-modules/uuid/v4.js';

import { CouchDBService } from '@services/couchDB.service';
import { NotificationsService } from '@services/notifications.service';
import { Offer } from '@app/models/offer.model';
import { Job } from '@app/models/job.model';
import { Invoice } from '@app/models/invoice.model';

@Component({
  selector: 'app-offer-edit',
  templateUrl: './offer-edit.component.html',
  styleUrls: ['./offer-edit.component.scss']
})
export class OfferEditComponent implements OnInit, OnDestroy {
  @ViewChild('offerForm', { static: false }) offerForm: NgForm;

  private subs = new SubSink();
  editable = false;

  formTitle: string;
  isNew = true; // 1 = new - 2 = update

  offer: Offer;

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
        this.editOffer(results['id']);
      } else {
        console.log('New mode');
        this.newOffer();
      }
    });
  }

  private editOffer(id: string) {
    this.isNew = false;
    this.formTitle = 'Offer bearbeiten';

    this.subs.sink = this.couchDBService.fetchEntry('/' + id).subscribe(
      offer => {
        console.log(offer);
        this.offer = offer;
      },
      error => {
        console.error(error);
      }
    );
  }

  private newOffer() {
    this.formTitle = 'Neuen Kunden anlegen';
    this.isNew = true;
    this.editable = true;

    this.offer = {
      _id: uuidv4(),
      type: 'offer'
    };
  }

  public onSubmit(): void {
    if (this.isNew) {
      console.log('Create a user');
      this.saveOffer();
    } else {
      console.log('Update a user');
      this.updateOffer();
    }
  }

  private updateOffer(): void {
    this.subs.sink = this.couchDBService
      .updateEntry(this.offer, this.offer._id)
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

  private saveOffer(): void {
    console.log(this.offer);
    this.subs.sink = this.couchDBService.writeEntry(this.offer).subscribe(
      result => {
        this.sendStateUpdate();
      },
      error => {
        console.error(error);
        this.showConfirm('error', error.message);
      }
    );
  }

  public deleteOffer(): void {
    console.log('DDDD');
    this.confirmationService.confirm({
      /* message: 'Sie wollen den Datensatz ' + this.offer.name + '?', */
      message: 'Sie wollen den Datensatz?',
      accept: () => {
        console.log('FFFFFF');
        this.subs.sink = this.couchDBService
          .deleteEntry(this.offer._id, this.offer._rev)
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

  public onEdit() {
    this.editable = true;
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
