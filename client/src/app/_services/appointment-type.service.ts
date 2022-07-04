import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IAppointmentType } from '../models/appointmentType';

@Injectable({
  providedIn: 'root'
})
export class AppointmentTypeService {
  baseUrl = 'https://localhost:5001/api/';
  constructor(private http: HttpClient) { }

   getAppointmentTypes() {
    return this.http.get<IAppointmentType[]>(this.baseUrl + 'appointment-types');
  }
}
