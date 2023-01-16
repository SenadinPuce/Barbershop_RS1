import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Client } from 'src/app/models/client';
import { ClientService } from 'src/app/_services/client.service';

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.css'],
})
export class ClientCreateComponent implements OnInit {
  model: Partial<Client> = {
    emailNotification: true,
    smsNotification: true,
  };

  constructor(
    private clientService: ClientService,
    private location: Location,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  createClient() {
    this.clientService.post(this.model).subscribe(() => {
      this.router.navigateByUrl('/clients');
      this.toastr.success('Client successfully created');
    });
  }

  cancel() {
    this.location.back();
  }
}
