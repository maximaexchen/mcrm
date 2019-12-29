import { Component, OnInit, Injector } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';

import { CouchDBService } from './services/couchDB.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CRM';

  private dataStore: any;
  public user: any;

  userName = 'root';
  passWord = 'root';

  constructor() {}
}
