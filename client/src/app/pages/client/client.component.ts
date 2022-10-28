import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { Client } from 'src/app/models/client';
import { Pagination } from 'src/app/models/pagination';
import { BaseParams } from 'src/app/models/baseParams';
import { ClientService } from 'src/app/_services/client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent implements OnInit {
  clients: Client[];
  pagination: Pagination;
  parameters: BaseParams = new BaseParams(10);
  timeout: any;
  sorters = [
    { value: 'name|asc', display: 'Name (A-Z)' },
    { value: 'name|desc', display: 'Name (Z-A)' },
    { value: 'created|asc', display: 'Date Created (older)' },
    { value: 'created|desc', display: 'Date Created (recent)' },
  ];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.parameters.sortBy = this.sorters[3].value;
    this.loadClients();
  }

  onDelete(arg0: any) {
    throw new Error('Method not implemented.');
  }

  onEdit(arg0: any) {
    throw new Error('Method not implemented.');
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
}
