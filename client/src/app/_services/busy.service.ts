import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  busyRequestCount = 0;
  constructor(private spinnerSerice: NgxSpinnerService) {}

  busy() {
    this.busyRequestCount++;
    this.spinnerSerice.show(undefined, {
      type: 'timer',
      bdColor: 'rgba(255,255,255,0)',
      color: '#333333',
      size: 'medium',
    });
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.spinnerSerice.hide();
      this.busyRequestCount = 0;
    }
  }
}
