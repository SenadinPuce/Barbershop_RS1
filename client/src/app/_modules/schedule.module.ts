import { NgModule } from '@angular/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleComponent } from '../components/schedule/schedule.component';

@NgModule({
  imports: [
    FlatpickrModule.forRoot(),
    NgbModalModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: [ScheduleComponent],
  exports: [ScheduleComponent],
})
export class ScheduleModule {}
