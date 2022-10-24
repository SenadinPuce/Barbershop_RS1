import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Barber } from 'src/app/models/barber';
import { BarberService } from 'src/app/_services/barber.service';

@Component({
  selector: 'app-barber-create',
  templateUrl: './barber-create.component.html',
  styleUrls: ['./barber-create.component.css'],
})
export class BarberCreateComponent implements OnInit {
  barber: Partial<Barber> = {
    firstName: '',
    lastName: '',
    dateOfBirth: new Date(),
    phoneNumber: '',
    email: '',
  };

  constructor(
    private barberService: BarberService,
    private router: Router,
    private location: Location,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  onCreate() {
    this.barberService.post(this.barber).subscribe(() => {
      this.toastr.success('Barber created successfully.');
      this.router.navigateByUrl('/barbers');
    });
  }

  cancel() {
    this.location.back();
  }
}
