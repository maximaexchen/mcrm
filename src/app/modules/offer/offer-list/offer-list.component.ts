import { Component, OnInit, OnDestroy } from '@angular/core';
import { Offer } from '@app/models/offer.model';
import { CouchDBService } from '@app/services/couchDB.service';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss']
})
export class OfferListComponent implements OnInit, OnDestroy {
  alive = true;

  offers: Offer[] = [];
  selectedOffers: Offer;
  offerCount = 0;

  constructor(private couchDBService: CouchDBService, private router: Router) {}

  ngOnInit() {
    this.couchDBService
      .setStateUpdate()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        message => {
          if (message.text === 'offer') {
            this.getOffers();
          }
        },
        err => console.log('Error', err),
        () => console.log('completed.')
      );

    this.getOffers();
  }

  private getOffers() {
    this.couchDBService
      .getOffers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        res => {
          this.offers = res;
          this.offerCount = this.offers.length;
        },
        err => {
          console.log('Error on loading offers');
        }
      );
  }

  public onRowSelect(event) {
    console.log(event.data);
    this.router.navigate(['../offer/' + event.data._id + '/edit']);
  }

  public onFilter(event: any): void {
    this.offerCount = event.filteredValue.length;
  }

  public showDetail(id: string) {
    this.router.navigate(['../offer/' + id + '/edit']);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
