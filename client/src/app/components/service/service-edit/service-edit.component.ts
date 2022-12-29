import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Service } from 'src/app/models/service';
import { ServiceService } from 'src/app/_services/service.service';

@Component({
  selector: 'app-service-edit',
  templateUrl: './service-edit.component.html',
  styleUrls: ['./service-edit.component.css'],
})
export class ServiceEditComponent implements OnInit {
  serviceId: any;
  resource: Service;

  edited: boolean;

  constructor(
    private serviceService: ServiceService,
    private modal: BsModalRef,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadService(this.serviceId);
  }

  onUpdate() {
    const service = { ...this.resource };
    this.updateService(this.serviceId, service);
  }

  updateService(id, resource) {
    this.serviceService.put(id, resource).subscribe((response) => {
      if (response) {
        this.edited = true;
        this.modal.hide();
        this.toastr.info('Service updated successfully');
      }
    });
  }

  cancel() {
    this.modal.hide();
  }

  loadService(id) {
    this.serviceService.get(id).subscribe((response) => {
      this.resource = response;
    });
  }
}
