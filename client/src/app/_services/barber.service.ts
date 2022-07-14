import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Barber } from '../models/barber';

@Injectable({
  providedIn: 'root',
})
export class BarberService {
  baseUrl = environment.apiUrl + 'barbers';
  constructor(private http: HttpClient) {}

  getBarbers() {
    return this.http.get<Barber[]>(this.baseUrl).pipe(
      map((barbers) => {
        barbers.forEach((el) => {
          el.fullName = el.firstName + ' ' + el.lastName;
        });
        return barbers;
      })
    );
  }
}
