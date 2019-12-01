import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { CouchDBService } from 'src/app//services/couchDB.service';
import { UserListComponent } from './user-list.component';
import { TableModule } from 'primeng/table';
import { GeneralModule } from '../../general.module';
import { UserRoutingModule } from '../user-routing.module';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { UserComponent } from '../user.component';
import { UserEditComponent } from '../user-edit/user-edit.component';

describe('CouchDBService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TableModule],
      providers: [CouchDBService]
    });
  });
});

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        GeneralModule,
        TableModule,
        UserRoutingModule,
        RouterTestingModule
      ],
      declarations: [UserListComponent, UserComponent, UserEditComponent]
    }).compileComponents();

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [UserComponent]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
