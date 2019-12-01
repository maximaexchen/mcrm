import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfferComponent } from './offer.component';
import { OfferEditComponent } from './offer-edit/offer-edit.component';
import { OfferListComponent } from './offer-list/offer-list.component';

const routes: Routes = [
  {
    path: '',
    component: OfferComponent,
    children: [
      { path: '', component: OfferEditComponent },
      { path: 'list', component: OfferListComponent },
      { path: 'new', component: OfferEditComponent },
      { path: ':id/edit', component: OfferEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferRoutingModule {}
