import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BackendService {
  private contactsUrl = 'app/contacts';
  private headers: Headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  /* public getItems(): any {
    return this.http
      .get(this.contactsUrl)
      .toPromise()
      .then(response => response.json().data as any)
      .catch(this.handleError);
  } */

  /* public getItem(id: number): Promise<any> {
    return this.getItems().then(items => items.find(item => item.id === id));
  } */

  public save(item: any): Promise<any> {
    if (item.id) {
      return this.put(item);
    }

    return this.post(item);
  }

  public new(item: any): Promise<any> {
    return this.post(item);
  }

  public delete(contact: any): Promise<any> {
    const url = `${this.contactsUrl}/${contact.id}`;

    return this.http
      .delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  public post(contact: any): Promise<any> {
    return this.http
      .post(this.contactsUrl, contact)
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }

  public put(contact: any): Promise<any> {
    const url = `${this.contactsUrl}/${contact.id}`;

    return this.http
      .put(url, JSON.stringify(contact))
      .toPromise()
      .then(() => contact)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
