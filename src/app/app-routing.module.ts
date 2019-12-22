import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'customer',
    pathMatch: 'full'
  },
  {
    path: 'customer',
    loadChildren: './modules/customer/customer.module#CustomerModule'
  },
  {
    path: 'job',
    loadChildren: './modules/job/job.module#JobModule'
  },
  {
    path: 'offer',
    loadChildren: './modules/offer/offer.module#OfferModule'
  },
  {
    path: 'invoice',
    loadChildren: './modules/invoice/invoice.module#InvoiceModule'
  },
  {
    path: 'search',
    loadChildren: './modules/search/search.module#SearchModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        preloadingStrategy: PreloadAllModules
      }
      /*, { enableTracing: true }, { onSameUrlNavigation: 'reload' }  */
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
