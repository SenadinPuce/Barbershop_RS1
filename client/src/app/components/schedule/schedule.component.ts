import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  Injectable,
  ViewEncapsulation,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import {
  isSameDay,
  isSameMonth,
  endOfWeek,
  addDays,
  addMinutes,
} from 'date-fns';
import { fromEvent, Observable, Subject } from 'rxjs';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent,
  DateFormatterParams,
  DAYS_OF_WEEK,
} from 'angular-calendar';
import { Appointment } from 'src/app/models/appointment';
import { WeekViewHourSegment } from 'calendar-utils';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppointmentCreateComponent } from 'src/app/components/appointment/appointment-create/appointment-create.component';
import { AppointmentEditComponent } from 'src/app/components/appointment/appointment-edit/appointment-edit.component';
import { AppointmentParams } from 'src/app/models/appointmentParams';
import { WorkingHoursService } from 'src/app/_services/working-hours.service';
import { CustomHoursService } from 'src/app/_services/custom-hours.service';
import { CustomHours } from 'src/app/models/customHours';

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
  weekStartsOn = DAYS_OF_WEEK.MONDAY;
  excludeDays: number[] = [];

  refresh = new Subject<void>();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;

  createAppointmentModal: BsModalRef;
  params = new AppointmentParams();

  dayStartHour: number;
  dayEndHour: number;

  customHours: CustomHours[];

  @Output() getAppointments = new EventEmitter();
  @Output() openEditModal = new EventEmitter();
  @Input()
  get appointments() {
    return this._appointments;
  }
  set appointments(data: Appointment[]) {
    if (!data) return;
    this.mapData(data);
    this._appointments = data;
  }

  private _appointments: Appointment[];

  constructor(
    private cdr: ChangeDetectorRef,
    private workingHoursService: WorkingHoursService,
    private customHoursService: CustomHoursService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loadWorkingHours();
    this.loadCustomHours();
  }

  loadWorkingHours() {
    this.workingHoursService.get().subscribe((data) => {
      const excludingDays = data.filter((wh) => wh.isOpen !== true);
      excludingDays.forEach((ed) => {
        this.excludeDays.push(DAYS_OF_WEEK[ed.day.toUpperCase()]);
      });

      let dayStartHour = 23;
      let dayEndHour = 0;

      const includingDays = data.filter((wh) => wh.isOpen === true);
      includingDays.forEach((wh) => {
        if (wh.from.getHours() < dayStartHour) {
          dayStartHour = wh.from.getHours();
        }
        if (wh.to.getHours() > dayEndHour) {
          dayEndHour = wh.to.getHours();
        }
      });
      this.dayStartHour = dayStartHour;
      this.dayEndHour = dayEndHour;

      this.refresh.next();
    });
  }

  loadCustomHours() {
    this.customHoursService.get().subscribe((data) => {
      this.customHours = data;

      this.refresh.next();
    });
  }

  onEditAppointment(appointment) {
    this.openEditModal.emit(appointment);
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
      appointment.duration =
        (appointment.endsAt.getTime() - appointment.startsAt.getTime()) / 60000;
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

  mapData(appointments: Appointment[]) {
    this.events = appointments.map((appt) => {
      const apptTitle = appt.client?.fullName || 'Client XY';
      const apptColor = {
        primary: appt.appointmentType.color,
        secondary: colorShade(appt.appointmentType.color, 20),
      };
      return {
        start: appt.startsAt,
        end: appt.endsAt,
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
      this.getAppointments.emit(this.params);
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
      this.getAppointments.emit(this.params);
    });
  }

  setParamDates(event: any) {
    if (
      this.params.dateFrom?.getTime() === event.period.start.getTime() ||
      this.params.dateTo?.getTime() === event.period.end.getTime()
    ) {
      return;
    }
    this.params.dateFrom = new Date(event.period.start);
    this.params.dateTo = new Date(event.period.end);
    this.getAppointments.emit(this.params);
  }

  private reload() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  checkDisabledSlots(event: CalendarWeekViewBeforeRenderEvent) {
    event.hourColumns.forEach((hourCol) => {
      hourCol.hours.forEach((hour) => {
        hour.segments.forEach((segment) => {
          if (!this.segmentIsValid(segment.date)) {
            segment.cssClass = 'cal-disabled';
          }
        });
      });
    });
  }

  beforeView(event: any) {
    this.setParamDates(event);
    this.checkDisabledSlots(event);

    this.cdr.detectChanges();
  }

  get closedHours() {
    return this.customHours?.filter((ch) => ch.isOpen === false);
  }

  segmentIsValid(date: Date) {
    if (
      this.closedHours?.some((ch) => {
        return ch.dateFrom < date && ch.dateTo > date;
      })
    ) {
      return false;
    }
    return true;
  }
}
