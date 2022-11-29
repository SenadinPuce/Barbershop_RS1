import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, shareReplay } from 'rxjs/operators';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentParams } from 'src/app/models/appointmentParams';
import { Barber } from 'src/app/models/barber';
import { AppointmentService } from 'src/app/_services/appointment.service';
import { BarberService } from 'src/app/_services/barber.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
  params: AppointmentParams = {} as AppointmentParams;
  barbers$: Observable<Barber[]>;
  appointments$: Observable<Appointment[]>;

  constructor(
    private barberService: BarberService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadBarbers();
  }

  loadAppointments(params: AppointmentParams) {
    this.params.dateFrom = params.dateFrom;
    this.params.dateTo = params.dateTo;

    this.appointments$ = this.appointmentService
      .get(this.params)
      .pipe(shareReplay(), delay(0));
  }

  loadBarbers() {
    this.barbers$ = this.barberService.getBarbers();
  }

  onChangeBarber() {
    this.loadAppointments(this.params);
  }

  onGetAppointments(params: AppointmentParams) {
    this.loadAppointments(params);
  }
}
