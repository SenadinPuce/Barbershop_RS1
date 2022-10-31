import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Appointment } from '../models/appointment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  baseUrl = environment.apiUrl + 'appointments';
  appointments: Appointment[] = [];

  constructor(private http: HttpClient) {}

  post(resource) {
    return this.http.post(this.baseUrl, resource).pipe(
      map(() => {
        this.appointments = [];
        return true;
      })
    );
  }

  get() {
    if (this.appointments.length > 0) {
      return of(this.appointments);
    }
    return this.http.get<Appointment[]>(this.baseUrl).pipe(
      map((data) => {
        this.appointments = data;
        return data;
      })
    );
  }

  getById(id: number) {
    const appt = this.appointments.find((x) => x.id === id);
    if (appt) return of(appt);

    return this.http.get<Appointment>(this.baseUrl + '/' + id);
  }

  update(resource) {
    return this.http.put(this.baseUrl + '/' + resource.id, resource).pipe(
      map(() => {
        this.appointments = [];
        return true;
      })
    );
  }
}
