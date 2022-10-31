import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppointmentType } from '../models/appointmentType';

@Injectable({
  providedIn: 'root',
})
export class AppointmentTypeService {
  baseUrl = environment.apiUrl + 'appointment-types';
  appointmentTypes: AppointmentType[] = [];

  constructor(private http: HttpClient) {}

  getAppointmentTypes() {
    if (this.appointmentTypes.length > 0) {
      return of(this.appointmentTypes);
    }
    return this.http.get<AppointmentType[]>(this.baseUrl).pipe(
      map((data) => {
        this.appointmentTypes = data;
        return data;
      })
    );
  }

  post(resource) {
    return this.http.post(this.baseUrl, resource).pipe(
      map(() => {
        this.appointmentTypes = [];
        return true;
      })
    );
  }

  delete(id: any) {
    return this.http.delete(this.baseUrl + '/' + id).pipe(
      map(() => {
        this.appointmentTypes = [];
        return true;
      })
    );
  }

  put(id, resource: any) {
    return this.http.put(this.baseUrl + '/' + id, resource).pipe(
      map(() => {
        this.appointmentTypes = [];
        return true;
      })
    );
  }

  get(id: any) {
    const type = this.appointmentTypes.find((x) => x.id === id);
    if (type) return of(type);

    return this.http.get(this.baseUrl + '/' + id);
  }
}
