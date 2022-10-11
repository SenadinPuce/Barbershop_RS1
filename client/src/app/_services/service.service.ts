import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Service } from '../models/service';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  baseUrl = environment.apiUrl + 'services';
  constructor(private http: HttpClient) {}

  getServices() {
    return this.http.get<Service[]>(this.baseUrl);
  }

  post(resource) {
    return this.http.post(this.baseUrl, resource);
  }

  delete(id: any) {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  put(id, resource: any) {
    return this.http.put(this.baseUrl + '/' + id, resource);
  }

  get(id: any) {
    return this.http.get<Service>(this.baseUrl + '/' + id);
  }
}
