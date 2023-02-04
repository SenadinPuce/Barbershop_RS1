import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { SharedModule } from '../_modules/shared.module';
import { ShopRoutingModule } from './shop-routing.module';




@NgModule({
  declarations: [
    ShopComponent,
    ProductDetailsComponent,
    ProductItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ShopRoutingModule
  ],
  exports: [
  ]
})
export class ShopModule { }
