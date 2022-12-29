import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Service } from 'src/app/models/service';
import { ServiceService } from 'src/app/_services/service.service';

@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.css'],
})
export class ServiceCreateComponent implements OnInit {
  model: Service = {
    id: undefined,
    name: '',
    duration: null,
    defaultPrice: null,
    description: '',
  };

  constructor(
    private serviceService: ServiceService,
    private location: Location,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  insertService() {
    const service = { ...this.model };
    this.serviceService.post(service).subscribe((response) => {
      if (response) {
        this.router.navigateByUrl('/appointments?tab=2');
        this.toastr.success('Service created successfully');
      }
    });
  }

  cancel() {
    this.location.back();
  }
}
