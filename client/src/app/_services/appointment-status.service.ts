import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppointmentStatus } from '../models/appointmentStatus';

@Injectable({
  providedIn: 'root',
})
export class AppointmentStatusService {
  baseUrl = environment.apiUrl + 'appointment-status';
  apptStatuses: AppointmentStatus[] = [];

  constructor(private http: HttpClient) {}

  get() {
    if (this.apptStatuses.length > 0) return of(this.apptStatuses);

    return this.http.get<AppointmentStatus[]>(this.baseUrl).pipe(
      map((data) => {
        this.apptStatuses = data;
        return data;
      })
    );
  }
}
