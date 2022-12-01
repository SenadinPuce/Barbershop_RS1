import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomHoursService } from 'src/app/_services/custom-hours.service';
import { CustomHours } from 'src/app/models/customHours';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-custom-hours',
  templateUrl: './custom-hours.component.html',
  styleUrls: ['./custom-hours.component.css'],
})
export class CustomHoursComponent implements OnInit {
  isCollapsed = false;
  form: FormGroup = new FormGroup({
    customHours: new FormArray([]),
  });

  constructor(
    private customHoursService: CustomHoursService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCustomHours();
  }

  loadCustomHours() {
    this.customHoursService.get().subscribe((data) => {
      this.initForm(data);
    });
  }

  onSave() {
    const customHours = this.form.value.customHours;
    this.customHoursService.update(customHours).subscribe(() => {
      this.toastr.success('Successfully updated custom hours');
    });
  }

  remove(index: number) {
    this.customHoursArray.removeAt(index);
    this.form.markAsDirty();
  }

  add() {
    const dateFrom = new FormControl(null, [
      Validators.required,
      this.checkDateFrom(),
    ]);
    const dateTo = new FormControl(null, [
      Validators.required,
      this.checkDateTo(),
    ]);
    const description = new FormControl('');
    const isOpen = new FormControl(false);

    const formGroup = new FormGroup({ dateFrom, dateTo, description, isOpen });
    this.customHoursArray.push(formGroup);
  }

  initForm(data: CustomHours[]) {
    data.forEach((el) => {
      const dateFrom = new FormControl(new Date(el.dateFrom), [
        Validators.required,
        this.checkDateFrom(),
      ]);
      const dateTo = new FormControl(new Date(el.dateTo), [
        Validators.required,
        this.checkDateTo(),
      ]);
      const description = new FormControl(el.description);
      const isOpen = new FormControl(el.isOpen);
      const formGroup = new FormGroup({
        dateFrom,
        dateTo,
        description,
        isOpen,
      });

      this.customHoursArray.push(formGroup);
    });
  }

  get customHoursArray() {
    return this.form.get('customHours') as FormArray;
  }

  get customHoursGroups() {
    return this.customHoursArray.controls as FormGroup[];
  }

  checkDateFrom(): ValidatorFn {
    return (control: AbstractControl) => {
      if (
        control.value === null ||
        control.parent?.controls['dateTo'].value === null
      )
        return null;
      if (control.value > control.parent?.controls['dateTo'].value) {
        return { wrongDate: true };
      }
      return null;
    };
  }

  checkDateTo(): ValidatorFn {
    return (control: AbstractControl) => {
      if (
        control.value === null ||
        control.parent?.controls['dateFrom'].value === null
      )
        return null;
      if (control.value < control.parent?.controls['dateFrom'].value) {
        return { wrongDate: true };
      }
      return null;
    };
  }
}
