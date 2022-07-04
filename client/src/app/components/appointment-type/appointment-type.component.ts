import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IAppointmentType } from 'src/app/models/appointmentType';
import { AppointmentTypeService } from 'src/app/_services/appointment-type.service';

@Component({
  selector: 'app-appointment-type',
  templateUrl: './appointment-type.component.html',
  styleUrls: ['./appointment-type.component.css'],
})
export class AppointmentTypeComponent implements OnInit {
  appointmentTypes: IAppointmentType[];

  constructor(private service: AppointmentTypeService) {}

  ngOnInit() {
    this.service.getAppointmentTypes().subscribe(response => {
      this.appointmentTypes = response;
    });
    console.log(this.appointmentTypes);
  }
}
