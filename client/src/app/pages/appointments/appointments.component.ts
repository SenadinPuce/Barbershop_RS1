import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { delay, shareReplay } from 'rxjs/operators';
import { AppointmentEditComponent } from 'src/app/components/appointment/appointment-edit/appointment-edit.component';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentParams } from 'src/app/models/appointmentParams';
import { Barber } from 'src/app/models/barber';
import { AppointmentService } from 'src/app/_services/appointment.service';
import { BarberService } from 'src/app/_services/barber.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  providers: [BsModalService],
})
export class AppointmentsComponent implements OnInit {
  params: AppointmentParams = {} as AppointmentParams;
  barbers$: Observable<Barber[]>;
  appointments$: Observable<Appointment[]>;

  editAppointmentModal: BsModalRef;

  constructor(
    private barberService: BarberService,
    private appointmentService: AppointmentService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loadBarbers();
  }

  loadAppointments() {
    this.appointments$ = this.appointmentService
      .get(this.params)
      .pipe(shareReplay(), delay(0));
  }

  loadBarbers() {
    this.barbers$ = this.barberService.getBarbers();
  }

  onChangeBarber() {
    this.loadAppointments();
  }

  onGetAppointments(params: AppointmentParams) {
    this.params.dateFrom = params.dateFrom;
    this.params.dateTo = params.dateTo;
    this.loadAppointments();
  }

  onEdit(appointment: Appointment) {
    this.editAppointmentModal = this.modalService.show(
      AppointmentEditComponent,
      {
        animated: false,
        class: 'modal-dialog-centered modal-lg',
        initialState: {
          model: appointment,
        },
      }
    );
    this.editAppointmentModal.onHide.subscribe((e) => {
      this.loadAppointments();
    });
  }
}
