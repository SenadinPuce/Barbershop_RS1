import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Barber } from '../models/barber';
import { BarberService } from '../_services/barber.service';

@Injectable({
  providedIn: 'root'
})
export class BarberDetailedResolver implements Resolve<Barber> {
  constructor(private barberService: BarberService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Barber> {
    return this.barberService.getById(Number.parseInt(route.paramMap.get('id')));
  }
}
