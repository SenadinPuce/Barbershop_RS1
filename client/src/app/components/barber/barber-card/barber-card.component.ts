import { Component, Input, OnInit } from '@angular/core';
import { Barber } from 'src/app/models/barber';

@Component({
  selector: 'app-barber-card',
  templateUrl: './barber-card.component.html',
  styleUrls: ['./barber-card.component.css'],
})
export class BarberCardComponent implements OnInit {
  @Input() barber: Barber;

  constructor() {}

  ngOnInit(): void {}
}
