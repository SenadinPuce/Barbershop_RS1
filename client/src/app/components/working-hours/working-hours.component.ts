import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WorkingHours } from 'src/app/models/workingHours';
import { WorkingHoursService } from 'src/app/_services/working-hours.service';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.css'],
})
export class WorkingHoursComponent implements OnInit {
  isCollapsed = false;
  workingHours: WorkingHours[] = [];

  constructor(
    private workingHoursService: WorkingHoursService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadWorkingHours();
  }

  loadWorkingHours() {
    this.workingHoursService.get().subscribe((data) => {
      this.workingHours = data;
    });
  }

  onSave() {
    this.workingHoursService.update(this.workingHours).subscribe(() => {
      this.toastr.success('Successfully updated working hours');
    });
  }
}
