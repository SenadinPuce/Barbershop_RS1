import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IService } from 'src/app/models/service';
import { AppointmentTypeService } from 'src/app/_services/appointment-type.service';
import { ServiceService } from 'src/app/_services/service.service';

@Component({
  selector: 'app-appointment-type-edit',
  templateUrl: './appointment-type-edit.component.html',
  styleUrls: ['./appointment-type-edit.component.css'],
})
export class AppointmentTypeEditComponent implements OnInit {
  appointmentTypeId: any;
  resource: any;
  selectedServices: [];
  services: IService[];

  edited: boolean;

  constructor(
    private servicesService: ServiceService,
    private appointmentTypeService: AppointmentTypeService,
    private modal: BsModalRef
  ) {}

  ngOnInit(): void {
    this.loadServices();
    this.loadAppointmentType(this.appointmentTypeId);
  }

  onUpdate() {
    const appointmentType = { ...this.resource };
    appointmentType.services = [];
    this.selectedServices.forEach((serviceId) => {
      appointmentType.services.push(
        this.services.find((s) => s.id === serviceId)
      );
    });

    this.updateAppointmentType(this.appointmentTypeId, appointmentType);
  }

  updateAppointmentType(id, resource) {
    this.appointmentTypeService.put(id, resource).subscribe(
      (response) => {
        if (response) {
          this.edited = true;
          this.modal.hide();
        }
      },
      (err) => console.log(err)
    );
  }

  loadServices() {
    this.servicesService.getServices().subscribe((response) => {
      this.services = response;
    });
  }

  loadAppointmentType(id) {
    this.appointmentTypeService.get(id).subscribe((response) => {
      this.resource = response;
      if (this.resource.services.length > 0) {
        this.selectedServices = this.resource.services.map((s) => s.id);
      }
    });
  }
}
