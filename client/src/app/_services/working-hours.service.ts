import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WorkingHours } from '../models/workingHours';

@Injectable({
  providedIn: 'root',
})
export class WorkingHoursService {
  baseUrl = environment.apiUrl + 'working-hours';
  hours: WorkingHours[] = [];

  constructor(private http: HttpClient) {}

  get() {
    if (this.hours.length > 0) return of(this.hours);

    return this.http.get<any[]>(this.baseUrl).pipe(
      map((hours) => {
        this.hours = hours.map((wh) => {
          let hour: WorkingHours = {
            id: wh.id,
            from: new Date(null, null, null, wh.fromHours, wh.fromMinutes),
            to: new Date(null, null, null, wh.toHours, wh.toMinutes),
            day: wh.day,
            isOpen: wh.isOpen,
          };
          return hour;
        });
        return this.hours;
      })
    );
  }

  update(data: WorkingHours[]) {
    var mappedData = data.map((wh) => {
      return {
        id: wh.id,
        isOpen: wh.isOpen,
        fromHours: wh.from.getHours(),
        fromMinutes: wh.from.getMinutes(),
        toHours: wh.to.getHours(),
        toMinutes: wh.to.getMinutes(),
        day: wh.day,
      };
    });
    return this.http
      .put(this.baseUrl, mappedData)
      .pipe(map(() => (this.hours = [])));
  }
}
