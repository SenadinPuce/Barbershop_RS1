import { Component, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
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
  form: UntypedFormGroup = new UntypedFormGroup({
    workingHours: new UntypedFormArray([]),
  });

  constructor(
    private workingHoursService: WorkingHoursService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadWorkingHours();
  }

  loadWorkingHours() {
    this.workingHoursService.get().subscribe((data) => {
      this.initForm(data);
    });
  }

  onSave() {
    const data = this.form.value.workingHours;
    this.workingHoursService.update(data).subscribe(() => {
      this.toastr.success('Successfully updated working hours');
    });
  }

  initForm(data: WorkingHours[]) {
    data.forEach((wh) => {
      const group = new UntypedFormGroup({
        id: new UntypedFormControl(wh.id),
        day: new UntypedFormControl(wh.day),
        isOpen: new UntypedFormControl(wh.isOpen),
        dateFrom: new UntypedFormControl(wh.dateFrom),
        dateTo: new UntypedFormControl(wh.dateTo),
      });

      this.workingHoursArray.push(group);
    });
  }

  get workingHoursArray() {
    return this.form.get('workingHours') as UntypedFormArray;
  }

  get workingHoursArrayGroups() {
    return this.workingHoursArray.controls as UntypedFormGroup[];
  }
}
