import { Component, OnInit, TemplateRef } from '@angular/core';
import { Service } from 'src/app/models/service';
import { ServiceService } from 'src/app/_services/service.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/common/modal/confirm-modal/confirm-modal.component';
import { ServiceEditComponent } from './service-edit/service-edit.component';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
  providers: [BsModalRef, BsModalService],
})
export class ServiceComponent implements OnInit {
  services: Service[];
  deleteModalRef: BsModalRef;
  editModalRef: BsModalRef;

  constructor(
    private service: ServiceService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.service.getServices().subscribe((response) => {
      this.services = response;
    });
  }

  onDelete(id) {
    this.deleteModalRef = this.modalService.show(ConfirmModalComponent, {
      animated: false,
      class: 'modal-dialog-centered',
      initialState: {
        question: 'Are you sure you want to delete the service?',
      },
    });
    this.deleteModalRef.onHide.subscribe(() => {
      if (this.deleteModalRef.content?.message === 'confirmed') {
        this.deleteService(id);
      }
    });
  }

  onEdit(id) {
    this.editModalRef = this.modalService.show(ServiceEditComponent, {
      animated: false,
      class: 'modal-dialog-centered',
      initialState: {
        serviceId: id,
        edited: false,
      },
    });
    this.editModalRef.onHide.subscribe((e) => {
      if (this.editModalRef.content?.edited) {
        this.ngOnInit();
      }
    });
  }

  deleteService(id) {
    this.service.delete(id).subscribe((response) => {
      if (response) {
        this.ngOnInit();
      }
    });
  }
}
