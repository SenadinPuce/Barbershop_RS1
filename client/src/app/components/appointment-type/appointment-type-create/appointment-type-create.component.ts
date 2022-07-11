import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAppointmentType } from 'src/app/models/appointmentType';
import { IService } from 'src/app/models/service';
import { AppointmentTypeService } from 'src/app/_services/appointment-type.service';
import { ServiceService } from 'src/app/_services/service.service';

@Component({
  selector: 'app-appointment-type-create',
  templateUrl: './appointment-type-create.component.html',
  styleUrls: ['./appointment-type-create.component.css'],
})
export class AppointmentTypeCreateComponent implements OnInit {
  model: IAppointmentType = {
    id: undefined,
    name: '',
    duration: 0,
    color: '#ffffff',
    services: [],
  };
  selectedServices: [];
  services: IService[];

  constructor(
    private servicesService: ServiceService,
    private appointmentTypeService: AppointmentTypeService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  insertAppointmentType() {
    const appointmentType = { ...this.model };

    this.selectedServices.forEach((serviceId) => {
      appointmentType.services.push(
        this.services.find((s) => s.id === serviceId)
      );
    });

    this.appointmentTypeService.post(appointmentType).subscribe(
      (response) => {
        if (response) {
          this.router.navigateByUrl('/appointments');
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

  cancel() {
    this.location.back();
  }
}
