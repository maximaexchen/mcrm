import { GeneralModule } from './modules/general.module';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { HeaderComponent } from './components/header/header.component';
import { NotificationsComponent } from './shared/notifications.component';
import { MenubarModule } from 'primeng/components/menubar/menubar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        GeneralModule,
        MenubarModule,
        ButtonModule,
        DialogModule,
        ToastModule,
        ConfirmDialogModule
      ],
      declarations: [AppComponent, HeaderComponent, NotificationsComponent],
      providers: [MessageService, ConfirmationService]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'm-crm'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('CRM');
  });
});
