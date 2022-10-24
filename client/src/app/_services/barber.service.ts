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

  getById(id: number) {
    return this.http.get<Barber>(this.baseUrl + '/' + id).pipe(
      map((barber) => {
        barber.fullName = barber.firstName + ' ' + barber.lastName;
        return barber;
      })
    );
  }

  getByUsername(username: string) {
    return this.http.get<Barber>(this.baseUrl + '/username/' + username).pipe(
      map((barber) => {
        barber.fullName = barber.firstName + ' ' + barber.lastName;
        return barber;
      })
    );
  }

  post(resource) {
    return this.http.post(this.baseUrl, resource);
  }

  put(resource) {
    return this.http.put<Barber>(this.baseUrl + '/' + resource.id, resource);
  }

  delete(id: any) {
    return this.http.delete(this.baseUrl + '/' + id);
  }
}
