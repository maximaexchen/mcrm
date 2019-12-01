import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobComponent } from './job.component';
import { JobEditComponent } from './job-edit/job-edit.component';
import { JobListComponent } from './job-list/job-list.component';

const routes: Routes = [
  {
    path: '',
    component: JobComponent,
    children: [
      { path: '', component: JobEditComponent },
      { path: 'list', component: JobListComponent },
      { path: 'new', component: JobEditComponent },
      { path: ':id/edit', component: JobEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule {}
