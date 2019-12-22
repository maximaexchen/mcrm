import { SearchModule } from './../search/search.module';
import { NgModule } from '@angular/core';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerStartComponent } from './customer-start/customer-start.component';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { GeneralModule } from 'src/app/modules/general.module';

@NgModule({
  declarations: [
    CustomerComponent,
    CustomerListComponent,
    CustomerEditComponent,
    CustomerStartComponent
  ],
  imports: [
    GeneralModule,
    CustomerRoutingModule,
    ProgressSpinnerModule,
    CalendarModule,
    ToastModule,
    FileUploadModule,
    AngularMultiSelectModule,
    FieldsetModule,
    DialogModule,
    SearchModule
  ],
  exports: []
})
export class CustomerModule {}
