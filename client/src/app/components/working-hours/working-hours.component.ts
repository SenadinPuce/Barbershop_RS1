import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
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
  form: FormGroup = new FormGroup({
    workingHours: new FormArray([]),
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
      const group = new FormGroup({
        id: new FormControl(wh.id),
        day: new FormControl(wh.day),
        isOpen: new FormControl(wh.isOpen),
        from: new FormControl(wh.from),
        to: new FormControl(wh.to),
      });

      this.workingHoursArray.push(group);
    });
  }

  get workingHoursArray() {
    return this.form.get('workingHours') as FormArray;
  }

  get workingHoursArrayGroups() {
    return this.workingHoursArray.controls as FormGroup[];
  }
}
