import { UserModule } from './../user/user.module';
import { SearchModule } from './../search/search.module';
import { NgModule } from '@angular/core';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { GeneralModule } from 'src/app/modules/general.module';

@NgModule({
  declarations: [InvoiceComponent, InvoiceListComponent, InvoiceEditComponent],
  imports: [
    GeneralModule,
    InvoiceRoutingModule,
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
export class InvoiceModule {}
