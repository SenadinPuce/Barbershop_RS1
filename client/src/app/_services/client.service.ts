import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  baseUrl = environment.apiUrl + 'clients';
  constructor(private http: HttpClient) {}

  getClients() {
    return this.http.get<Client[]>(this.baseUrl).pipe(
      map((clients) => {
        clients.forEach((el) => {
          el.fullName = el.firstName + ' ' + el.lastName;
        });
        return clients;
      })
    );
  }
}
