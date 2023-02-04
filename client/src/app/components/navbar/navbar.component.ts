import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { BasketItem } from 'src/app/models/basket';
import { AccountService } from 'src/app/_services/account.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    public accountService: AccountService,
    private router: Router,
    public notificationService: NotificationService,
    public basketService: BasketService
  ) {}

  ngOnInit(): void {}

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  getCount(items: BasketItem[]) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
