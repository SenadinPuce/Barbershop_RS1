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

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  createAppointmentModal: BsModalRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private appointmentService: AppointmentService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getAppointments();
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
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {}

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
      const clientFullName = appt.client?.firstName + appt.client?.lastName;
      let apptTitle = appt.appointmentType.name;
      if (clientFullName) {
        apptTitle += ' | ' + clientFullName;
      }
      const apptColor = {
        primary: appt.appointmentType.color,
        secondary: colorShade(appt.appointmentType.color, -20),
      };
      return {
        start: new Date(appt.startsAt + 'Z'),
        end: new Date(appt.endsAt + 'Z'),
        title: apptTitle,
        color: apptColor,
        actions: this.actions,
        allDay: false,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: true,
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

  private reload() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }
}
