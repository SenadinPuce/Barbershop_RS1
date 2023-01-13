import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Appointment } from '../models/appointment';
import { AppointmentParams } from '../models/appointmentParams';
import { CalendarSlot } from '../models/calendarSlot';
import { getFullName } from '../_utilities/getFullName';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  baseUrl = environment.apiUrl + 'appointments';
  apptCache = new Map();
  slotsCache = new Map();
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

    if (params.clientId) {
      queryParams = queryParams.append('clientId', params.clientId.toString());
    }

    if (params.barberIds?.length > 0)
      queryParams = queryParams.append(
        'barberIds',
        params.barberIds.toString()
      );

    if (params.statusIds?.length > 0)
      queryParams = queryParams.append(
        'statusIds',
        params.statusIds.toString()
      );

    return this.http
      .get<Appointment[]>(this.baseUrl, { params: queryParams })
      .pipe(
        map((data) => {
          data.forEach((appt) => {
            if (appt.client) appt.client.fullName = getFullName(appt.client);
            appt.barber.fullName = getFullName(appt.barber);

            appt.startsAt = new Date(appt.startsAt);
            appt.endsAt = new Date(appt.endsAt);
          });
          this.apptCache.set(Object.values(params).join('-'), data);
          return data;
        })
      );
  }

  getTakenSlots(params: AppointmentParams) {
    const response = this.slotsCache.get(Object.values(params).join('-'));
    if (response !== undefined) return of(response);

    let queryParams = new HttpParams();
    queryParams = queryParams.append('dateFrom', params.dateFrom.toISOString());
    queryParams = queryParams.append('dateTo', params.dateTo.toISOString());

    if (params.clientId) {
      queryParams = queryParams.append('clientId', params.clientId.toString());
    }

    if (params.barberIds?.length > 0)
      queryParams = queryParams.append(
        'barberIds',
        params.barberIds.toString()
      );

    return this.http
      .get<CalendarSlot[]>(this.baseUrl + '/taken-slots', {
        params: queryParams,
      })
      .pipe(
        map((data) => {
          data.forEach((slot) => {
            slot.dateFrom = new Date(slot.dateFrom + 'Z');
            slot.dateTo = new Date(slot.dateTo + 'Z');
          });
          this.slotsCache.set(Object.values(params).join('-'), data);
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

  complete(id) {
    return this.http.put(this.baseUrl + '/' + id + '/complete', {}).pipe(
      map(() => {
        this.apptCache.clear();
        return true;
      })
    );
  }

  cancel(id: number, canceledByClient: boolean) {
    let params = new HttpParams();
    params = params.append('canceledByClient', canceledByClient);

    return this.http
      .put(this.baseUrl + '/' + id + '/cancel', {}, { params })
      .pipe(
        map(() => {
          this.apptCache.clear();
          return true;
        })
      );
  }

  schedule(id) {
    return this.http
      .put(this.baseUrl + '/' + id + '/schedule', {}, { responseType: 'text' })
      .pipe(
        map(() => {
          this.apptCache.clear();
          return true;
        })
      );
  }
}
