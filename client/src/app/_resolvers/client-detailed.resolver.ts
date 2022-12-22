import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Client } from '../models/client';
import { ClientService } from '../_services/client.service';

@Injectable({
  providedIn: 'root'
})
export class ClientDetailedResolver implements Resolve<Client> {
  constructor(private clientService: ClientService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Client> {
    return this.clientService.getById(Number.parseInt(route.paramMap.get('id')));
  }
}
