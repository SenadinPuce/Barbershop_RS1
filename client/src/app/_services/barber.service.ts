import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Barber } from '../models/barber';

@Injectable({
  providedIn: 'root',
})
export class BarberService {
  baseUrl = environment.apiUrl + 'barbers';
  barbers: Barber[] = [];
  constructor(private http: HttpClient) {}

  getBarbers() {
    if (this.barbers.length > 0) return of(this.barbers);

    return this.http.get<Barber[]>(this.baseUrl).pipe(
      map((barbers) => {
        barbers.forEach((el) => {
          el.fullName = el.firstName + ' ' + el.lastName;
        });
        this.barbers = barbers;
        return barbers;
      })
    );
  }

  getById(id: number) {
    const member = this.barbers.find((x) => x.id === id);
    if (member !== undefined) return of(member);

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

  put(resource: Barber) {
    return this.http
      .put<Barber>(this.baseUrl + '/' + resource.id, resource)
      .pipe(
        map(() => {
          this.barbers = [];
        })
      );
  }

  delete(id: any) {
    return this.http.delete(this.baseUrl + '/' + id);
  }
}
