import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BasketService } from '../basket/basket.service';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  
constructor(private fb: FormBuilder, private accountService: AccountService, 
  private basketService: BasketService) { }

ngOnInit(): void {
  this.getAddressFormValues();
  this.getDeliverMethodValue();
}

checkoutForm = this.fb.group({
  addressForm: this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    zipCode: ['', Validators.required],
    country: ['', Validators.required],
  }),
  deliveryForm: this.fb.group({
    deliveryMethod: ['', Validators.required]
  }),
  paymentForm: this.fb.group({
    nameOnCard: ['', Validators.required]
  })
})

getAddressFormValues() {
  this.accountService.getUserAddress().subscribe({
    next: address => {
      address && this.checkoutForm.get('addressForm')?.patchValue(address)
    }
  })
}

  getDeliverMethodValue() {
    const basket = this.basketService.getCurrentBasketValue();
    if(basket && basket.deliveryMethodId) {
      this.checkoutForm.get('deliveryForm')?.get('deliveryMethod')
        ?.patchValue(basket.deliveryMethodId.toString());
    }
  }

}