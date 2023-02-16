import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  constructor(private orderService: OrdersService) { }
  ngOnInit(): void {
    this.getOrders();
  }
  getOrders() {
    this.orderService.getOrdersForUser().subscribe({
      next: orders => 
      {
        this.orders = orders;
        console.log(this.orders);
      }
    })
  }
}