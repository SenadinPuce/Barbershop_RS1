import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from 'src/app/models/client';
import { ClientService } from 'src/app/_services/client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent implements OnInit {
  clients: Observable<Client[]>;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.clients = this.clientService.getClients();
  }

  onDelete(arg0: any) {
    throw new Error('Method not implemented.');
  }

  onEdit(arg0: any) {
    throw new Error('Method not implemented.');
  }
}
