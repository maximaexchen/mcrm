import { CouchDBService } from './../../../services/couchDB.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from '@models/index';
import { EnvService } from '@app/services/env.service';
import { PermissionManagerService } from './permissionManager.service';
import { Roles } from '../models/roles.enum';

export const TOKEN_NAME = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userS: PermissionManagerService = new PermissionManagerService();
  private currentTokenSubject: BehaviorSubject<string>;
  public currentToken: Observable<string>;
  apiUrl = this.env.uploadUrl;
  permissions: Array<string>;
  jwtHelper = new JwtHelperService();
  private baseUrl = this.env.dbBaseUrl;
  private dbName = this.env.dbName;
  public dbRequest = this.baseUrl + this.dbName;

  constructor(
    private env: EnvService,
    private http: HttpClient,
    private couchDBService: CouchDBService
  ) {
    this.currentTokenSubject = new BehaviorSubject<string>(
      localStorage.getItem('access_token')
    );
    this.currentToken = this.currentTokenSubject.asObservable();
  }

  public login(username: string, password: string): Observable<any> {
    const params = {
      username,
      password
    };

    const loginUSerObs = this.couchDBService.getLoginUser(params);

    return loginUSerObs.pipe(
      switchMap(
        (loginResult): Observable<boolean | any> => {
          const user = loginResult['docs'][0];
          if (user) {
            this.requestToken(username, password).subscribe(res => {
              console.log('res');
              console.log(res);

              const role = user['role'];
              if (role) {
                this.userS.authAs(role as Roles);
                return of(true);
              } else {
                this.userS.authAs('External' as Roles);
              }
            });
          }
          return of(false);
        }
      )
    );
  }

  private requestToken(
    username: string,
    password: string
  ): Observable<boolean> {
    return this.http
      .post<any>(this.env.apiUrl + '/api/auth', {
        username,
        password
      })
      .pipe(
        tap(result => {
          this.setToken(result.token);
        }), // do side effects
        map(data => true), // modify the data and return the value you care for
        catchError(error => of(false)) // return an Observable with the value that should be returned on errors
      );
  }

  public logout() {
    this.removeToken();
    this.currentTokenSubject.next(null);
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

  private getToken(): string {
    return localStorage.getItem(TOKEN_NAME);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);
  }

  private removeToken() {
    localStorage.removeItem(TOKEN_NAME);
  }

  public getTokenExpirationDate(token: string): Date {
    const decoded = this.jwtHelper.decodeToken(token);

    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  private isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.getToken();
    }
    if (!token) {
      return true;
    }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_NAME);
    console.log('isAuthenticated');
    console.log(!this.jwtHelper.isTokenExpired(token));
    return this.jwtHelper.isTokenExpired(token);
  }

  public get currentUserValue(): User {
    return this.currentTokenSubject.value;
  }
}
