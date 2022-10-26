import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Barber } from 'src/app/models/barber';
import { BarberService } from 'src/app/_services/barber.service';

@Component({
  selector: 'app-barber-list',
  templateUrl: './barber-list.component.html',
  styleUrls: ['./barber-list.component.css'],
})
export class BarberListComponent implements OnInit {
  barbers$: Observable<Barber[]>;

  constructor(private barberService: BarberService) {}

  ngOnInit(): void {
    this.barbers$ = this.barberService.getBarbers();
  }
}
