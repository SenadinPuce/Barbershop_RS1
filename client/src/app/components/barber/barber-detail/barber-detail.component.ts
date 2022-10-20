import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Barber } from 'src/app/models/barber';
import { BarberService } from 'src/app/_services/barber.service';

@Component({
  selector: 'app-barber-detail',
  templateUrl: './barber-detail.component.html',
  styleUrls: ['./barber-detail.component.css'],
})
export class BarberDetailComponent implements OnInit {
  barber: Barber;

  constructor(
    private barberService: BarberService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadBarber();
  }

  loadBarber() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.barberService.getById(id).subscribe((data) => {
      this.barber = data;
    });
  }
}
