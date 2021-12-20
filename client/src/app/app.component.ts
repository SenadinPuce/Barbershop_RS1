import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { User } from './models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Barber Shop';

  constructor(public accountService: AccountService) {}

  ngOnInit(): void {
    this.setCurrentUser();
  }
  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);
  }
  logout() {
    console.log('log out in app.ts');
    this.accountService.logout();
  }
}
