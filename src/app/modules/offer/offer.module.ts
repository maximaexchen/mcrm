import { UserModule } from './../user/user.module';
import { SearchModule } from './../search/search.module';
import { NgModule } from '@angular/core';

import { OfferRoutingModule } from './offer-routing.module';
import { OfferComponent } from './offer.component';
import { OfferListComponent } from './offer-list/offer-list.component';
import { OfferEditComponent } from './offer-edit/offer-edit.component';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { GeneralModule } from 'src/app/modules/general.module';

@NgModule({
  declarations: [OfferComponent, OfferListComponent, OfferEditComponent],
  imports: [
    GeneralModule,
    OfferRoutingModule,
    ProgressSpinnerModule,
    CalendarModule,
    ToastModule,
    FileUploadModule,
    AngularMultiSelectModule,
    FieldsetModule,
    DialogModule,
    UserModule,
    SearchModule
  ],
  exports: []
})
export class OfferModule {}
