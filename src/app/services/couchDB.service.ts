import { Offer } from './../models/offer.model';
import { Invoice } from './../models/invoice.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { EnvService } from './env.service';
import { Job } from '@app/models/job.model';
import { Customer } from '@app/models/customer.model';

@Injectable({ providedIn: 'root' })
export class CouchDBService {
  private baseUrl = this.env.dbBaseUrl;
  private dbName = this.env.dbName;
  public dbRequest = this.baseUrl + this.dbName;

  private updateSubject = new Subject<any>();

  constructor(private env: EnvService, private http: HttpClient) {}

  public writeEntry(obj: any): Observable<any> {
    return this.http.post(this.dbRequest, document);
  }

  public updateEntry(obj: any, id: string): Observable<any> {
    return this.http.put(this.dbRequest + '/' + id, document);
  }

  public deleteEntry(id: string, rev: string): Observable<any> {
    return this.http.delete(this.dbRequest + '/' + id + '?rev=' + rev);
  }

  public fetchEntries(param: string): Observable<any> {
    return this.http.get(this.dbRequest + param).pipe(
      map(responseData => {
        const entriesArray = [];

        for (const key in responseData['rows']) {
          if (responseData['rows'].hasOwnProperty(key)) {
            entriesArray.push({ ...responseData['rows'][key]['doc'] });
          }
        }
        return entriesArray;
      })
    );
  }

  public fetchEntry(param: string): Observable<any> {
    return this.http.get(this.dbRequest + param);
  }

  public bulkUpdate(bulkObject: any): Observable<any> {
    console.log(bulkObject);
    return this.http.post(this.dbRequest + '/_bulk_docs', bulkObject);
  }

  public getCustomers(): Observable<Customer[]> {
    return this.fetchEntries(
      '/_design/mcrm/_view/all-customers?include_docs=true'
    );
  }

  public getJobs(): Observable<Job[]> {
    return this.fetchEntries('/_design/mcrm/_view/all-jobs?include_docs=true');
  }

  public getInvoices(): Observable<Invoice[]> {
    return this.fetchEntries(
      '/_design/mcrm/_view/all-invoices?include_docs=true'
    );
  }

  public getOffers(): Observable<Offer[]> {
    return this.fetchEntries(
      '/_design/mcrm/_view/all-offers?include_docs=true'
    );
  }

  public findDocuments(searchObject?: any): Observable<any> {
    if (searchObject) {
      console.log('findDocuments');
      return this.http.post(this.dbRequest + '/_find', searchObject);
    } else {
      console.log('findDocuments all');
      return this.fetchEntries(
        '/_design/mcrm/_view/all-norms?include_docs=true'
      );
    }
  }

  public search(object: any): Observable<any> {
    return this.http.post(this.dbRequest + '/_find', object);
  }

  public sendStateUpdate(message: string) {
    this.updateSubject.next({ text: message });
  }

  public setStateUpdate(): Observable<any> {
    return this.updateSubject.asObservable();
  }

  public getLoginUser(params: {
    username: string;
    password: string;
  }): Observable<any> {
    const updateQuery = {
      use_index: ['_design/check_user'],
      selector: {
        _id: { $gt: null },
        $and: [
          {
            userName: {
              $eq: params.username
            }
          },
          {
            password: {
              $eq: params.password
            }
          }
        ]
      }
    };

    return this.http.post(this.dbRequest + '/_find', updateQuery);
  }
}
