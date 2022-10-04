import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  Injectable,
  ViewEncapsulation,
} from '@angular/core';
import {
  isSameDay,
  isSameMonth,
  endOfWeek,
  addDays,
  addMinutes,
} from 'date-fns';
import { fromEvent, Subject } from 'rxjs';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  DateFormatterParams,
} from 'angular-calendar';
import { AppointmentService } from 'src/app/_services/appointment.service';
import { Appointment } from 'src/app/models/appointment';
import { WeekViewHourSegment } from 'calendar-utils';
import { finalize, takeUntil } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppointmentCreateComponent } from 'src/app/components/appointment/appointment-create/appointment-create.component';
import { AppointmentEditComponent } from 'src/app/components/appointment/appointment-edit/appointment-edit.component';

function colorShade(color, amount) {
  return (
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, (color) =>
        (
          '0' +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}

function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}
@Injectable()
class CustomDateFormatter extends CalendarDateFormatter {
  public weekViewHour({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'HH:mm', locale);
  }
}

@Component({
  selector: 'app-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }

      .disable-hover {
        pointer-events: none;
      }
    `,
  ],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
    BsModalService,
  ],
  templateUrl: './schedule.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ScheduleComponent implements OnInit {
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;

  viewDate: Date = new Date();
  dragToCreateActive = false;
  weekStartsOn: 0 = 0;

  refresh = new Subject<void>();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  createAppointmentModal: BsModalRef;
  editAppointmentModal: BsModalRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private appointmentService: AppointmentService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getAppointments();
  }

  onEditAppointment(appointment) {
    this.editAppointmentModal = this.modalService.show(
      AppointmentEditComponent,
      {
        animated: false,
        class: 'modal-dialog-centered modal-lg',
        initialState: {
          model: appointment,
        },
      }
    );
    this.editAppointmentModal.onHide.subscribe((e) => {
      this.ngOnInit();
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    const changedEvent = this.events.find(
      (e) => e.appointmentId === event.appointmentId
    );
    this.handleEvent('Resized or Dragged', changedEvent);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    const appointment: Partial<Appointment> = {
      id: event.appointmentId,
    };
    if (action === 'Resized or Dragged') {
      appointment.startsAt = event.start;
      appointment.endsAt = event.end;
    }
    this.onEditAppointment(appointment);
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  getAppointments() {
    this.appointmentService.get().subscribe((data) => {
      this.mapData(data);
    });
  }

  mapData(appointments: Appointment[]) {
    this.events = appointments.map((appt) => {
      let clientFullName = '';
      if (appt.client) {
        clientFullName = this.getClientFullName(appt.client);
      }
      let apptTitle = appt.appointmentType.name;
      if (clientFullName.length > 0) {
        apptTitle += ' | ' + clientFullName;
      }
      const apptColor = {
        primary: appt.appointmentType.color,
        secondary: colorShade(appt.appointmentType.color, 0),
      };
      return {
        start: new Date(appt.startsAt + 'Z'),
        end: new Date(appt.endsAt + 'Z'),
        title: apptTitle,
        color: apptColor,
        allDay: false,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: true,
        appointmentId: appt.id,
      };
    });
    this.refresh.next();
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'New Appointment',
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
    };
    this.events = [...this.events, dragToSelectEvent];
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.reload();
          this.onDragCreate(dragToSelectEvent);
        }),
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.reload();
      });
  }

  onDragCreate(event) {
    const appointment = {
      startsAt: event.start,
      endsAt: event.end,
    };
    this.createAppointmentModal = this.modalService.show(
      AppointmentCreateComponent,
      {
        animated: false,
        class: 'modal-dialog-centered modal-lg',
        initialState: {
          model: appointment,
        },
      }
    );
    this.createAppointmentModal.onHide.subscribe((e) => {
      this.ngOnInit();
    });
  }

  openCreateModal() {
    this.createAppointmentModal = this.modalService.show(
      AppointmentCreateComponent,
      {
        animated: false,
        class: 'modal-dialog-centered modal-lg',
      }
    );
    this.createAppointmentModal.onHide.subscribe((e) => {
      this.ngOnInit();
    });
  }

  getClientFullName(client) {
    if (client.firstName !== undefined && client.lastName !== undefined) {
      return client.firstName + ' ' + client.lastName;
    }
  }

  private reload() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }
}
