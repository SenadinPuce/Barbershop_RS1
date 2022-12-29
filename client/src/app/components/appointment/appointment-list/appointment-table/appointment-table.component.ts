import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Appointment } from 'src/app/models/appointment';

@Component({
  selector: 'app-appointment-table',
  templateUrl: './appointment-table.component.html',
  styleUrls: ['./appointment-table.component.css'],
})
export class AppointmentTableComponent implements OnInit, OnChanges {
  @Input() appointments: Appointment[] = [];
  @Input() status: string;
  @Output() editAppt = new EventEmitter<Appointment>();
  @Output() cancelAppt = new EventEmitter<number>();
  @Output() completeAppt = new EventEmitter<number>();
  isEmpty = true;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.appointments?.currentValue &&
      changes.appointments?.currentValue !== changes.appointment?.previousValue
    ) {
      this.isEmpty =
        changes.appointments.currentValue.filter(
          (appt) => appt.appointmentStatus.name === this.status
        ).length === 0;
    }
  }

  ngOnInit(): void {}

  onEdit(appt: Appointment) {
    this.editAppt.emit(appt);
  }

  onCancel(id: number) {
    this.cancelAppt.emit(id);
  }

  onComplete(id: number) {
    this.completeAppt.emit(id);
  }
}
