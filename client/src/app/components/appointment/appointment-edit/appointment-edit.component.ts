import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Observable, take } from 'rxjs';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentStatus } from 'src/app/models/appointmentStatus';
import { AppointmentType } from 'src/app/models/appointmentType';
import { Barber } from 'src/app/models/barber';
import { BaseParams } from 'src/app/models/baseParams';
import { Client } from 'src/app/models/client';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/_services/account.service';
import { AppointmentStatusService } from 'src/app/_services/appointment-status.service';
import { AppointmentTypeService } from 'src/app/_services/appointment-type.service';
import { AppointmentService } from 'src/app/_services/appointment.service';
import { BarberService } from 'src/app/_services/barber.service';
import { ClientService } from 'src/app/_services/client.service';
@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.css'],
})
export class AppointmentEditComponent implements OnInit {
  model: Partial<Appointment> = {};
  appointmentStatuses: AppointmentStatus[];
  appointmentTypes: AppointmentType[];
  barbers: Barber[];
  clients: Client[] = [];
  params = new BaseParams(20);
  currentUser: User;
  draggedAppt: boolean = false;
  edited: boolean = false;
  isDisabled: boolean = false;
  tooltipInfoText: string;
  constructor(
    private appointmentService: AppointmentService,
    private appointmentTypeService: AppointmentTypeService,
    private appointmentStatusService: AppointmentStatusService,
    private barberService: BarberService,
    private clientService: ClientService,
    private modal: BsModalRef,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAppointmentTypes();
    this.loadAppointmentStatuses();
    this.loadClients();
    this.loadBarbers();
    combineLatest({
      appt: this.fetchAppointment(this.model.id),
      user: this.getCurrentUser(),
    })
      .pipe(take(1))
      .subscribe({
        next: ({ appt, user }) => {
          this.mapAppointment(appt);
          this.currentUser = user;
          this.checkRoleAndAppointmentStatus();
        },
      });
  }

  updateAppointment() {
    this.appointmentService.update(this.model).subscribe((res) => {
      this.edited = true;
      this.modal.hide();
      this.toastr.info('Appointment edited successfully');
    });
  }

  getCurrentUser() {
    return this.accountService.currentUser$;
  }

  setAppointmentDuration() {
    this.model.duration = this.appointmentTypes.find(
      (at) => at.id === this.model.appointmentTypeId
    ).duration;

    this.updateEndTime();
  }

  updateEndTime() {
    var date = new Date(this.model.startsAt);
    date.setMinutes(this.model.startsAt.getMinutes() + this.model.duration);
    this.model.endsAt = date;
  }

  getSelectedTypeColor(): string {
    return this.appointmentTypes?.find(
      (at) => at.id === this.model.appointmentTypeId
    ).color;
  }

  loadBarbers() {
    this.barberService.getBarbers().subscribe((data: Barber[]) => {
      this.barbers = data;
    });
  }

  loadClients() {
    this.clientService.getClients(this.params).subscribe((data) => {
      this.clients = this.clients.concat(data.result);
    });
  }

  loadMoreClients() {
    this.params.page += 1;
    this.loadClients();
  }

  loadAppointmentTypes() {
    this.appointmentTypeService.getAppointmentTypes().subscribe((data) => {
      this.appointmentTypes = data;
    });
  }

  loadAppointmentStatuses() {
    this.appointmentStatusService.get().subscribe((data) => {
      this.appointmentStatuses = data;
    });
  }

  fetchAppointment(id): Observable<Appointment> {
    return this.appointmentService.getById(id);
  }

  cancel() {
    this.modal.hide();
  }

  mapAppointment(appointment: Appointment) {
    this.model.appointmentTypeId = appointment.appointmentTypeId;
    this.model.barberId = appointment.barberId;
    this.model.clientId = appointment.clientId;
    this.model.appointmentStatusId = appointment.appointmentStatusId;
    this.model.appointmentStatus = appointment.appointmentStatus;
    this.model.note = appointment.note;
    this.model.createdByClient = appointment.createdByClient;
    //schedule drag appointment
    if (
      (this.model.startsAt && this.model.startsAt !== appointment.startsAt) ||
      (this.model.endsAt && this.model.endsAt !== appointment.endsAt)
    ) {
      this.draggedAppt = true;
    } else {
      this.model.startsAt = appointment.startsAt;
      this.model.endsAt = appointment.endsAt;
      this.model.duration = appointment.duration;
    }
  }

  checkRoleAndAppointmentStatus() {
    let tooltipInfoText = '';
    if (this.model.createdByClient && this.currentUser.role !== 'Client') {
      this.isDisabled = true;
      tooltipInfoText =
        'You shall not edit it. Use the action buttons in the appointment list to schedule/cancel.';
    } else {
      if (
        this.currentUser.role === 'Client' &&
        this.model.appointmentStatus.name !== 'Pending'
      ) {
        tooltipInfoText = 'You shall not edit it anymore. ';
        this.isDisabled = true;
        if (this.model.appointmentStatus.name === 'Scheduled') {
          tooltipInfoText +=
            'Use Cancel button in the appointment list and create a new appointment with a desired date and time.';
        }
      }
    }
    this.tooltipInfoText = tooltipInfoText;
  }
}
