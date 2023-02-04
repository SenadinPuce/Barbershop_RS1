import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './models/user';
import { Router } from '@angular/router';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Barber Shop';
  products: any[];

  constructor(public accountService: AccountService, private router: Router, private basketService: BasketService) {}

  ngOnInit(): void {
    this.setCurrentUser();
    const basketId = localStorage.getItem('basket_id');
    if (basketId) this.basketService.getBasket(basketId);
  }
  setCurrentUser() {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      this.accountService.setCurrentUser(user);
    } else {
      this.accountService.setCurrentUser(null);
    }
  }
}
