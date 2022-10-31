import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Client } from 'src/app/models/client';
import { ClientService } from 'src/app/_services/client.service';

@Component({
  selector: 'app-client-create',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css'],
})
export class ClientEditComponent implements OnInit {
  clientId: any;
  client: Client;

  edited: boolean;

  constructor(private service: ClientService, private modal: BsModalRef) {}

  ngOnInit(): void {
    this.loadClient(this.clientId);
  }

  updateClient() {
    this.service.put(this.client).subscribe(() => {
      this.edited = true;
      this.modal.hide();
    });
  }

  cancel() {
    this.modal.hide();
  }

  loadClient(id) {
    this.service.getById(id).subscribe((response) => {
      this.client = response;
    });
  }
}
