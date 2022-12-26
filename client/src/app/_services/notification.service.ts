import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private numberOfUnreadMessagesSource = new BehaviorSubject<number>(0);
  numberOfUnreadMessages$ = this.numberOfUnreadMessagesSource.asObservable();

  constructor() { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'notification', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('UnreadMessages', numberOfUnreadMessages => {
      this.numberOfUnreadMessagesSource.next(numberOfUnreadMessages);
      

    this.hubConnection.on('NewMessageReceived', numberOfUnreadMessages => {
      this.numberOfUnreadMessagesSource.next(numberOfUnreadMessages);
    })
    })
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }
}
