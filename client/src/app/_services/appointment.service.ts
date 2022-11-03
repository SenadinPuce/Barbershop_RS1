import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Appointment } from '../models/appointment';
import { AppointmentParams } from '../models/appointmentParams';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  baseUrl = environment.apiUrl + 'appointments';
  apptCache = new Map();

  constructor(private http: HttpClient) {}

  post(resource) {
    return this.http.post(this.baseUrl, resource).pipe(
      map(() => {
        this.apptCache.clear();
        return true;
      })
    );
  }

  get(params: AppointmentParams) {
    const response = this.apptCache.get(Object.values(params).join('-'));
    if (response !== undefined) return of(response);

    let queryParams = new HttpParams();
    queryParams = queryParams.append('dateFrom', params.dateFrom.toISOString());
    queryParams = queryParams.append('dateTo', params.dateTo.toISOString());
    return this.http
      .get<Appointment[]>(this.baseUrl, { params: queryParams })
      .pipe(
        map((data) => {
          this.apptCache.set(Object.values(params).join('-'), data);
          return data;
        })
      );
  }

  getById(id: number) {
    const appt = [...this.apptCache.values()]
      .reduce((arr, el) => arr.concat(el), [])
      .find((x) => x.id === id);
    if (appt) return of(appt);

    return this.http.get<Appointment>(this.baseUrl + '/' + id);
  }

  update(resource) {
    return this.http.put(this.baseUrl + '/' + resource.id, resource).pipe(
      map(() => {
        this.apptCache.clear();
        return true;
      })
    );
  }
}
