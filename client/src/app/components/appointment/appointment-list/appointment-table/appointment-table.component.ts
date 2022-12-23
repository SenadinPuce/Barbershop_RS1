import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Appointment } from 'src/app/models/appointment';

@Component({
  selector: 'app-appointment-table',
  templateUrl: './appointment-table.component.html',
  styleUrls: ['./appointment-table.component.css'],
})
export class AppointmentTableComponent implements OnInit {
  @Input() appointments: Appointment[] = [];
  @Input() status: string;
  @Output() editAppt = new EventEmitter<Appointment>();
  @Output() cancelAppt = new EventEmitter<number>();
  @Output() completeAppt = new EventEmitter<number>();

  constructor() {}

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
