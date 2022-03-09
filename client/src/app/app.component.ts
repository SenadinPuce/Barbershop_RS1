import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Barber Shop';

  constructor(public accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.setCurrentUser();
  }
  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      this.router.navigateByUrl('/login');
    }
    this.accountService.setCurrentUser(user);
  }
}
