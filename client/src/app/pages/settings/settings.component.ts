import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WorkingHours } from 'src/app/models/workingHours';
import { WorkingHoursService } from 'src/app/_services/working-hours.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
