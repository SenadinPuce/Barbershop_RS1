import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
  @ViewChild('appointmentTabs', { static: true })
  appointmentTabs: TabsetComponent;

  // activeTab: TabDirective;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    });
  }

  selectTab(tabId) {
    this.appointmentTabs.tabs[tabId].active = true;
  }
}
