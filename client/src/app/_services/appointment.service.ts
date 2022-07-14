import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  baseUrl = environment.apiUrl + 'appointments';
  constructor(private http: HttpClient) {}

  post(resource) {
    return this.http.post(this.baseUrl, resource);
  }
}
