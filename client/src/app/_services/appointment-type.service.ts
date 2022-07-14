import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppointmentType } from '../models/appointmentType';

@Injectable({
  providedIn: 'root',
})
export class AppointmentTypeService {
  baseUrl = environment.apiUrl + 'appointment-types';
  constructor(private http: HttpClient) {}

  getAppointmentTypes() {
    return this.http.get<AppointmentType[]>(this.baseUrl);
  }

  post(resource) {
    return this.http.post(this.baseUrl, resource);
  }

  delete(id: any) {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  put(id, resource: any) {
    return this.http.put(this.baseUrl + '/' + id, resource);
  }

  get(id: any) {
    return this.http.get(this.baseUrl + '/' + id);
  }
}
