import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IService } from '../models/service';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getServices() {
    return this.http.get<IService[]>(this.baseUrl + 'services');
  }
}
