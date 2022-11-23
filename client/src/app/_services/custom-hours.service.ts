import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomHours } from '../models/customHours';

@Injectable({
  providedIn: 'root',
})
export class CustomHoursService {
  baseUrl = environment.apiUrl + 'custom-hours';
  hours: CustomHours[] = [];

  constructor(private http: HttpClient) {}

  get() {
    if (this.hours.length > 0) return of(this.hours);

    return this.http.get<CustomHours[]>(this.baseUrl).pipe(
      map((custom) => {
        const mappedData = custom.map((customEntry) => {
          return {
            ...customEntry,
            dateFrom: new Date(customEntry.dateFrom + 'Z'),
            dateTo: new Date(customEntry.dateTo + 'Z'),
          };
        });
        this.hours = mappedData;
        return this.hours;
      })
    );
  }

  update(data: CustomHours[]) {
    return this.http.put(this.baseUrl, data).pipe(map(() => (this.hours = [])));
  }
}
