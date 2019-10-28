import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

import { CrudNavComponent } from '../components/crud-nav/crud-nav.component';

@NgModule({
  declarations: [CrudNavComponent],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    TabViewModule,
    SelectButtonModule,
    MultiSelectModule,
    CheckboxModule,
    TooltipModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    TabViewModule,
    SelectButtonModule,
    MultiSelectModule,
    CrudNavComponent,
    CheckboxModule,
    TooltipModule
  ]
})
export class GeneralModule {}
