import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';

import { MenuItem } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

import { AuthenticationService } from '@app/modules/auth/services/authentication.service';
import { CouchDBService } from 'src/app/services/couchDB.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isCollapsed = false;
  public title = 'CRM';
  public mainmenuItems: MenuItem[] = [];
  public editMenuItems: MenuItem[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initMenu();
  }

  /**
   * initialisiert das Haupt-Menü
   */
  private initMenu() {
    this.mainmenuItems.push({
      icon: 'fas fa-users',
      label: 'Kunden',
      routerLink: 'customer'
    });
    this.mainmenuItems.push({
      icon: 'fas fa-file-alt',
      label: 'Angebote',
      routerLink: 'offer'
    });
    this.mainmenuItems.push({
      icon: 'far fa-file-alt',
      label: 'Rechnungen',
      routerLink: 'invoice'
    });
    this.mainmenuItems.push({
      icon: 'fas fa-clipboard-list',
      label: 'Jobs',
      routerLink: 'job'
    });
    this.mainmenuItems.push({
      icon: 'fas fa-cog',
      label: '',
      items: [
        {
          icon: 'fas fa-user',
          label: 'Benutzer',
          routerLink: 'user'
        },
        {
          icon: 'fas fa-link',
          label: 'Rollen',
          routerLink: 'role'
        }
      ]
    });
  }

  public logout(event: Event) {
    this.authenticationService.logout();
  }
}
