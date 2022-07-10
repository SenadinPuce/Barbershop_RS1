import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAppointmentType } from '../models/appointmentType';

@Injectable({
  providedIn: 'root',
})
export class AppointmentTypeService {
  baseUrl = environment.apiUrl + 'appointment-types';
  constructor(private http: HttpClient) {}

  getAppointmentTypes() {
    return this.http.get<IAppointmentType[]>(this.baseUrl);
  }

  post(resource) {
    return this.http.post(this.baseUrl, resource);
  }
}
