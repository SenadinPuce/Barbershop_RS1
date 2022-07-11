import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css'],
})
export class ConfirmModalComponent implements OnInit {
  message = '';
  question = '';

  constructor(private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  confirm(): void {
    this.message = 'confirmed';
    this.modalRef?.hide();
  }

  decline(): void {
    this.message = 'canceled';
    this.modalRef?.hide();
  }
}
