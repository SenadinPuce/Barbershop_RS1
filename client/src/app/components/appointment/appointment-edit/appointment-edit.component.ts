import { ClassGetter } from '@angular/compiler/src/output/output_ast';
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
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.css'],
})
export class AppointmentEditComponent implements OnInit {
  model: Partial<Appointment> = {
    // startsAt: null,
    // duration: 0,
    // id: 0,
    // endsAt: new Date(new Date().setHours(0, 0, 0, 0)),
    // appointmentTypeId: undefined,
    // barberId: undefined,
    // clientId: undefined,
    // appointmentType: undefined,
    // client: undefined,
    // barber: undefined,
  };

  appointmentTypes: AppointmentType[];
  barbers: Barber[];
  clients: Client[];

  // selectedApptType: any;
  // selectedBarber: any;
  // selectedClient: any;

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
    this.fetchAppointment(this.model.id);
  }

  updateAppointment() {
    // this.model.appointmentTypeId = this.selectedApptType;
    // this.model.barberId = this.selectedBarber;
    // if (this.selectedClient) {
    //   this.model.clientId = this.selectedClient;
    // }
    this.appointmentService
      .update(this.model)
      .subscribe((res) => this.modal.hide());
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
    this.clientService.getClients().subscribe((data) => {
      this.clients = data;
    });
  }

  loadAppointmentTypes() {
    this.appointmentTypeService.getAppointmentTypes().subscribe((data) => {
      this.appointmentTypes = data;
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
    console.log(this.model);
    this.model.appointmentTypeId = appointment.appointmentTypeId;
    this.model.barberId = appointment.barberId;
    this.model.clientId = appointment.clientId;
    this.model.duration = appointment.duration;
    this.model.appointmentStatusId = appointment.appointmentStatusId;
    if (this.model.startsAt === undefined && this.model.endsAt === undefined) {
      this.model.startsAt = new Date(appointment.startsAt + 'Z');
      this.model.endsAt = new Date(appointment.endsAt + 'Z');
    }
  }
}
