import { Job } from './../../models/job.model';
import { Offer } from './../../models/offer.model';
import { Customer } from './../../models/customer.model';
import { SearchService } from './../../services/search.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import * as _ from 'underscore';
import { SubSink } from 'SubSink';
import { Invoice } from '@app/models';

@Component({
  selector: 'app-document-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchForm', { static: false }) searchForm: NgForm;
  subsink = new SubSink();
  foundDocuments: Document[];
  newUserArray: any[];
  display = false;
  modalTitle = '';
  modalContent = '';
  activeNorms = true;

  customer: Customer[];
  customerId = null;
  invoices: Invoice[];
  invoiceId = null;
  offers: Offer[];
  offerId: string;
  jobs: Job[];
  jobId: string;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    /* console.log('DocumentSearchComponent');

    this.subsink.sink = this.route.params.subscribe(results => {
      this.subsink.sink = this.documentService.getGroups().subscribe(
        res => {
          this.groups = res;
        },
        error => this.logger.error(error.message)
      );

      this.subsink.sink = this.documentService.getPublishers().subscribe(
        res => {
          this.publishers = res;
        },
        error => this.logger.error(error.message)
      );

      this.subsink.sink = this.documentService.getTags().subscribe(
        tags => {
          this.tags = _.sortBy(tags, 'tagType');
        },
        error => this.logger.error(error.message)
      );

      this.documentService.getUsers().then(users => {
        this.owners = users;
        this.users = users;
      });
    }); */
  }

  private resetSearchFields() {
    /* this.publisherId = 'undefined';
    this.ownerId = 'undefined';
    this.groupId = 'undefined';
    this.userId = 'undefined';
    this.tagIds = []; */
  }

  public onSubmit(): void {
    this.resetSearchFields();

    const searchObject = {
      use_index: ['_design/search_norm'],
      selector: {
        _id: { $gt: null },
        type: { $eq: 'norm' }
      }
    };

    /* if (this.searchForm.value.tags.length > 0) {
      this.tagIds = _.pluck(this.searchForm.value.tags, '_id');
    }

    if (this.searchForm.value.ownerId !== undefined) {
      this.ownerId = this.searchForm.value.ownerId;
    } */

    // Abfrage ist leer
    // Abfrage ist leer mit active-flag
    // Abfrage mit hearausgeber
    // Abfrage mit Owner
    console.log('this.activeNorms: ' + this.searchForm.value.activeNorms);
    if (
      this.searchForm.value.activeNorms !== null &&
      this.searchForm.value.activeNorms !== undefined &&
      this.searchForm.value.activeNorms === true
    ) {
      this.activeNorms = this.searchForm.value.activeNorms;

      Object.assign(searchObject['selector'], {
        active: { $eq: this.activeNorms }
      });
    }

    /* if (!!this.ownerId) {
      Object.assign(searchObject['selector'], {
        $or: []
      });
    } */

    /* if (this.tagIds.length > 0) {
      Object.assign(searchObject['selector'], {
        tags: {}
      });
      Object.assign(searchObject['selector']['tags'], {
        $and: []
      });
      this.tagIds.forEach(val => {
        Object.assign(
          searchObject['selector']['tags']['$and'].push({
            $elemMatch: {
              id: {
                $eq: val
              }
            }
          })
        );
      });
    }

    if (!!this.ownerId) {
      Object.assign(
        searchObject['selector']['$or'].push({
          owner: {
            _id: { $eq: this.ownerId }
          }
        })
      );
    }

    console.log(JSON.stringify(searchObject));
    console.log('-----');

    // same as below
    // if (!this.publisherId  && !this.ownerId) {
    if (this.activeNorms === null) {
      console.log('No search parameters');
      this.searchService.search(undefined);
    } else {
      console.log('Search parameters');
      this.searchService.search(searchObject);
    } */
  }

  public onDeSelectAll(items: any) {
    this.searchForm.value.tags = [];
  }

  ngOnDestroy(): void {
    this.subsink.unsubscribe();
  }
}
