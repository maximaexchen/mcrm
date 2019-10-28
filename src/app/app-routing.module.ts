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
    path: 'search',
    loadChildren: './modules/search/search.module#SearchModule'
  },
  {
    path: 'user',
    loadChildren: './modules/user/user.module#UserModule'
  },
  {
    path: 'role',
    loadChildren: './modules/role/role.module#RoleModule'
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
