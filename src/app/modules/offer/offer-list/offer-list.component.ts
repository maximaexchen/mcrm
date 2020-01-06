import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'SubSink';

import { CouchDBService } from 'src/app//services/couchDB.service';
import { Observable } from 'rxjs';
import { Offer } from '@app/models';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss']
})
export class OfferListComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  isLoading = true;

  offers: Offer[] = [];
  selectedUser: Offer;
  offerCount = 0;
  offers$: Observable<Offer[]>;
  filteredEntries$: Observable<any>;

  constructor(private couchDBService: CouchDBService, private router: Router) {}

  ngOnInit() {
    this.subs.sink = this.couchDBService.setStateUpdate().subscribe(
      message => {
        console.log('message: ' + message);
        if (message.text === 'offer') {
          this.isLoading = false;
          this.getOffers();
        }
      },
      err => {
        console.error('Error');
      }
    );
    this.getOffers();
  }

  private getOffers() {
    console.log('getOffers');
    this.isLoading = false;
    this.offers$ = this.couchDBService.getOffers();
  }

  public onRowSelect(event) {
    this.router.navigate(['../offer/' + event.data._id + '/edit']);
  }

  public onFilter(event: any): void {
    this.offerCount = event.filteredValue.length;
  }

  public showDetail(id: string) {
    this.router.navigate(['../offer/' + id + '/edit']);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
