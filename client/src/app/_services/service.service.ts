import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Service } from '../models/service';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getServices() {
    return this.http.get<Service[]>(this.baseUrl + 'services');
  }
}
