import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { Client } from 'src/app/models/client';
import { Pagination } from 'src/app/models/pagination';
import { BaseParams } from 'src/app/models/baseParams';
import { ClientService } from 'src/app/_services/client.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/common/modal/confirm-modal/confirm-modal.component';
import { ClientEditComponent } from '../../components/client/client-edit/client-edit.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  providers: [BsModalRef, BsModalService],
})
export class ClientComponent implements OnInit {
  clients: Client[];
  pagination: Pagination;
  parameters: BaseParams = new BaseParams(5);
  timeout: any;
  sorters = [
    { value: 'name|asc', display: 'Name (A-Z)' },
    { value: 'name|desc', display: 'Name (Z-A)' },
    { value: 'created|asc', display: 'Date Created (older)' },
    { value: 'created|desc', display: 'Date Created (recent)' },
  ];

  deleteModalRef: BsModalRef;
  editModalRef: BsModalRef;

  constructor(
    private clientService: ClientService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.parameters.sortBy = this.sorters[3].value;
    this.loadClients();
  }

  onDelete(id) {
    this.deleteModalRef = this.modalService.show(ConfirmModalComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        question: 'Are you sure you want to delete the client?',
      },
    });
    this.deleteModalRef.onHide.subscribe(() => {
      if (this.deleteModalRef.content?.message === 'confirmed') {
        this.deleteClient(id);
      }
    });
  }

  onEdit(id) {
    this.editModalRef = this.modalService.show(ClientEditComponent, {
      class: 'modal-dialog-centered modal-lg',
      initialState: {
        clientId: id,
        edited: false,
      },
    });
    this.editModalRef.onHide.subscribe((e) => {
      if (this.editModalRef.content?.edited) {
        this.ngOnInit();
        this.toastr.info('Client successfuly edited.');
      }
    });
  }

  loadClients() {
    this.clientService.getClients(this.parameters).subscribe((response) => {
      this.clients = response.result;
      this.pagination = response.pagination;
    });
  }

  pageChanged(event: PageChangedEvent) {
    this.parameters.page = event.page;
    this.loadClients();
  }

  searchClients(event: any) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => this.loadClients(), 500);
  }

  deleteClient(id) {
    this.clientService.delete(id).subscribe(() => {
      this.ngOnInit();
      this.toastr.warning('Client successfuly deleted.');
    });
  }
}
