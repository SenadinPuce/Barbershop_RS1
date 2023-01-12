import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { delay, shareReplay } from 'rxjs/operators';
import { AppointmentEditComponent } from 'src/app/components/appointment/appointment-edit/appointment-edit.component';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentParams } from 'src/app/models/appointmentParams';
import { AppointmentStatus } from 'src/app/models/appointmentStatus';
import { AppointmentType } from 'src/app/models/appointmentType';
import { Barber } from 'src/app/models/barber';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/_services/account.service';
import { AppointmentStatusService } from 'src/app/_services/appointment-status.service';
import { AppointmentTypeService } from 'src/app/_services/appointment-type.service';
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
  appointmentStatuses: AppointmentStatus[];
  appointmentTypes$: Observable<AppointmentType[]>;
  takenSlots$: Observable<any>;

  editAppointmentModal: BsModalRef;
  currentUser: User;

  constructor(
    private barberService: BarberService,
    private appointmentService: AppointmentService,
    private appointmentStatusService: AppointmentStatusService,
    private appointmentTypeService: AppointmentTypeService,
    private modalService: BsModalService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadBarbers();
    this.loadAppointmentStatuses();
    this.loadAppointmentTypes();

    this.accountService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.initFields();
  }

  loadAppointments() {
    if (this.currentUser.role === 'Client') {
      this.params.clientId = this.currentUser.clientId;
      this.takenSlots$ = this.appointmentService
        .getTakenSlots(this.params)
        .pipe(delay(0));
    }
    this.appointments$ = this.appointmentService
      .get(this.params)
      .pipe(shareReplay(), delay(0));
  }

  loadAppointmentStatuses() {
    this.appointmentStatusService.get().subscribe((data) => {
      this.appointmentStatuses = data;
    });
  }

  loadAppointmentTypes() {
    this.appointmentTypes$ = this.appointmentTypeService.getAppointmentTypes();
  }

  loadBarbers() {
    this.barbers$ = this.barberService.getBarbers();
  }

  onChangeBarber() {
    this.loadAppointments();
  }

  onChangeStatus() {
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
        class: 'modal-dialog-centered modal-lg',
        initialState: {
          model: appointment,
        },
      }
    );
    this.editAppointmentModal.onHidden.subscribe(() => {
      if (
        this.editAppointmentModal.content.edited ||
        this.editAppointmentModal.content.draggedAppt
      ) {
        this.loadAppointments();
      }
    });
  }

  initFields() {
    if (this.currentUser.role === 'Barber') {
      this.params.barberIds = [];
      this.params.barberIds.push(this.currentUser.barberId);
    }
  }
}
