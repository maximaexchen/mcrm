import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceComponent } from './invoice.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceComponent,
    children: [
      { path: '', component: InvoiceEditComponent },
      { path: 'list', component: InvoiceListComponent },
      { path: 'new', component: InvoiceEditComponent },
      { path: ':id/edit', component: InvoiceEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule {}
