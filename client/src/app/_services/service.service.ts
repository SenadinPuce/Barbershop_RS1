import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Service } from '../models/service';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  baseUrl = environment.apiUrl + 'services';
  services: Service[] = [];

  constructor(private http: HttpClient) {}

  getServices() {
    if (this.services.length > 0) return of(this.services);

    return this.http.get<Service[]>(this.baseUrl).pipe(
      map((services) => {
        this.services = services;
        return services;
      })
    );
  }

  get(id: any) {
    const member = this.services.find((x) => x.id === id);
    if (member !== undefined) return of(member);

    return this.http.get<Service>(this.baseUrl + '/' + id);
  }

  post(resource) {
    return this.http.post(this.baseUrl, resource).pipe(
      map((response) => {
        this.services = [];
        return response;
      })
    );
  }

  delete(id: any) {
    return this.http.delete(this.baseUrl + '/' + id).pipe(
      map(() => {
        this.services = [];
        return true;
      })
    );
  }

  put(id, resource: any) {
    return this.http.put(this.baseUrl + '/' + id, resource).pipe(
      map((response) => {
        this.services = [];
        return response;
      })
    );
  }
}
