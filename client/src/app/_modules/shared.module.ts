import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColorPickerModule } from 'ngx-color-picker';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TimeagoModule } from 'ngx-timeago';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PagingHeaderComponent } from '../components/paging-header/paging-header.component';
import { PagerComponent } from '../components/pager/pager.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { OrderTotalsComponent } from '../components/order-totals/order-totals.component';



@NgModule({
  declarations: [
    PagingHeaderComponent,
    PagerComponent,
    OrderTotalsComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    NgSelectModule,
    ColorPickerModule,
    FileUploadModule,
    NgxSpinnerModule,
    PaginationModule.forRoot(),
    TimepickerModule.forRoot(),
    CollapseModule.forRoot(),
    TimeagoModule.forRoot(),
    ButtonsModule.forRoot(),
    NgbTooltipModule,
    CarouselModule.forRoot()
  ],
  exports: [
    BsDropdownModule,
    ToastrModule,
    BsDatepickerModule,
    TabsModule,
    NgSelectModule,
    ColorPickerModule,
    FileUploadModule,
    NgxSpinnerModule,
    PaginationModule,
    TimepickerModule,
    CollapseModule,
    TimeagoModule,
    ButtonsModule,
    NgbTooltipModule,
    PagerComponent,
    PagingHeaderComponent,
    CarouselModule,
    OrderTotalsComponent
  ],
})
export class SharedModule {}
