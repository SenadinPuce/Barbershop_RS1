import { Component, OnInit, TemplateRef } from '@angular/core';
import { AppointmentType } from 'src/app/models/appointmentType';
import { AppointmentTypeService } from 'src/app/_services/appointment-type.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/common/modal/confirm-modal/confirm-modal.component';
import { AppointmentTypeEditComponent } from './appointment-type-edit/appointment-type-edit.component';

@Component({
  selector: 'app-appointment-type',
  templateUrl: './appointment-type.component.html',
  styleUrls: ['./appointment-type.component.css'],
  providers: [BsModalRef, BsModalService],
})
export class AppointmentTypeComponent implements OnInit {
  appointmentTypes: AppointmentType[];
  deleteModalRef: BsModalRef;
  editModalRef: BsModalRef;

  constructor(
    private service: AppointmentTypeService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.service.getAppointmentTypes().subscribe((response) => {
      this.appointmentTypes = response;
    });
  }

  onDelete(id) {
    this.deleteModalRef = this.modalService.show(ConfirmModalComponent, {
      animated: false,
      class: 'modal-dialog-centered',
      initialState: {
        question: 'Are you sure you want to delete appointment type?',
      },
    });
    this.deleteModalRef.onHide.subscribe(() => {
      if (this.deleteModalRef.content?.message === 'confirmed') {
        this.deleteAppointmentType(id);
      }
    });
  }

  onEdit(id) {
    this.editModalRef = this.modalService.show(AppointmentTypeEditComponent, {
      animated: false,
      class: 'modal-dialog-centered',
      initialState: {
        appointmentTypeId: id,
        edited: false,
      },
    });
    this.editModalRef.onHide.subscribe((e) => {
      if (this.editModalRef.content?.edited) {
        this.ngOnInit();
      }
    });
  }

  deleteAppointmentType(id) {
    this.service.delete(id).subscribe((response) => {
      if (response) {
        this.ngOnInit();
      }
    });
  }
}
