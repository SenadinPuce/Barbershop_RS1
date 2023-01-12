import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
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
    this.accountService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.loadAppointmentTypes();
    this.loadAppointmentStatuses();
    this.loadClients();
    this.loadBarbers();
    this.fetchAppointment(this.model.id);
  }

  updateAppointment() {
    this.appointmentService.update(this.model).subscribe((res) => {
      this.edited = true;
      this.modal.hide();
      this.toastr.info('Appointment edited successfully');
    });
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

  fetchAppointment(id) {
    this.appointmentService.getById(id).subscribe((data) => {
      this.mapAppointment(data);
    });
  }

  cancel() {
    this.modal.hide();
  }

  mapAppointment(appointment: Appointment) {
    this.model.appointmentTypeId = appointment.appointmentTypeId;
    this.model.barberId = appointment.barberId;
    this.model.clientId = appointment.clientId;
    this.model.appointmentStatusId = appointment.appointmentStatusId;
    this.model.note = appointment.note;
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
}
