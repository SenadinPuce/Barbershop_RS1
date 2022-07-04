import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {  ToastrModule } from 'ngx-toastr';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      positionClass:'toast-bottom-right'
    }),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot()
  ],
  exports: [
    BsDropdownModule,
    ToastrModule,
    BsDatepickerModule,
    TabsModule
  ]
})
export class SharedModule { }
