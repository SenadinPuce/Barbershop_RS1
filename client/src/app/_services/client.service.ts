import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  baseUrl = environment.apiUrl + 'clients';
  clients: Client[] = [];
  constructor(private http: HttpClient) {}

  getClients() {
    if (this.clients.length > 0) return of(this.clients);

    return this.http.get<Client[]>(this.baseUrl).pipe(
      map((clients) => {
        clients.forEach((el) => {
          el.fullName = el.firstName + ' ' + el.lastName;
        });
        this.clients = clients;
        return clients;
      })
    );
  }
}
