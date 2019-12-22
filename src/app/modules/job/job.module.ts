import { SearchModule } from './../search/search.module';
import { NgModule } from '@angular/core';

import { JobRoutingModule } from './job-routing.module';
import { JobComponent } from './job.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobEditComponent } from './job-edit/job-edit.component';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { GeneralModule } from 'src/app/modules/general.module';

@NgModule({
  declarations: [JobComponent, JobListComponent, JobEditComponent],
  imports: [
    GeneralModule,
    JobRoutingModule,
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
export class JobModule {}
