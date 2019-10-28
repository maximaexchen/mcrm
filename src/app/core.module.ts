import { NgModule } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EnvServiceProvider } from './/services/env.service.provider';

@NgModule({
  providers: [
    MessageService,
    MessageService,
    EnvServiceProvider,
    ConfirmationService
  ]
})
export class CoreModule {}
