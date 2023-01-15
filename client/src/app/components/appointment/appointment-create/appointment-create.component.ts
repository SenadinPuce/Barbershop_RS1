import { Component, OnInit } from '@angular/core';
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
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css'],
})
export class AppointmentCreateComponent implements OnInit {
  model: Partial<Appointment> = {};
  appointmentStatuses: AppointmentStatus[];
  appointmentTypes: AppointmentType[];
  barbers: Barber[];
  clients: Client[] = [];
  params = new BaseParams(20);
  currentUser: User;
  datesEnabled: Date[] = [];

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
    this.initFields();
    this.setEnabledDates();
  }

  insertAppointment() {
    this.appointmentService.post(this.model).subscribe((res) => {
      this.modal.hide();
      this.toastr.success('Appointment created successfully');
      if (this.currentUser.role === 'Client') {
        setTimeout(() => {
          this.toastr.info(
            'The appointment is in pending status, you may still edit it. Feedback will be notified here and sent via email.'
          );
        }, 1500);
      }
    });
  }

  setAppointmentDuration() {
    this.model.duration = this.appointmentTypes.find(
      (at) => at.id === this.model.appointmentTypeId
    ).duration;

    this.updateEndTime();
  }

  updateEndTime() {
    if (!this.model.duration) {
      return;
    }
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

  initFields() {
    let startingStatus = 'Scheduled';
    if (this.currentUser.role === 'Client') {
      startingStatus = 'Pending';
      this.model.clientId = this.currentUser.clientId;
    } else if (this.currentUser.role === 'Barber') {
      this.model.barberId = this.currentUser.barberId;
    }
    this.model.appointmentStatusId = this.appointmentStatuses.find(
      (x) => x.name === startingStatus
    ).id;
  }

  setEnabledDates() {
    let date = new Date();
    let enabledDates = [];
    for (let i = 0; i < 30; i++) {
      enabledDates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    this.datesEnabled = enabledDates;
  }

  cancel() {
    this.modal.hide();
  }
}
