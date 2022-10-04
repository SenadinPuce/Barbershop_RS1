import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentType } from 'src/app/models/appointmentType';
import { Barber } from 'src/app/models/barber';
import { Client } from 'src/app/models/client';
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

  appointmentTypes: AppointmentType[];
  barbers: Barber[];
  clients: Client[];

  constructor(
    private appointmentService: AppointmentService,
    private appointmentTypeService: AppointmentTypeService,
    private barberService: BarberService,
    private clientService: ClientService,
    private modal: BsModalRef
  ) {}

  ngOnInit(): void {
    this.loadAppointmentTypes();
    this.loadClients();
    this.loadBarbers();
  }

  insertAppointment() {
    this.appointmentService
      .post(this.model)
      .subscribe((res) => this.modal.hide());
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
    this.clientService.getClients().subscribe((data) => {
      this.clients = data;
    });
  }

  loadAppointmentTypes() {
    this.appointmentTypeService.getAppointmentTypes().subscribe((data) => {
      this.appointmentTypes = data;
    });
  }

  cancel() {
    this.modal.hide();
  }
}
