import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'reservation-page',
  imports: [FullCalendarModule],
  templateUrl: './reservation-page.component.html',
})
export default class ReservationPageComponent {
  reservationService = inject(ReservationService);
  selectedConsole = signal<string | null>(null);
  campus = toSignal(
    inject(ActivatedRoute).paramMap.pipe(
      tap(() =>this.selectedConsole.set(null)),
      map((param) => param.get('campus'))
    )
  );
  calendarComponent = viewChild<FullCalendarComponent>('calendar');

  consolesResource = rxResource({
    params: () => ({ campus: this.campus() }),
    stream: ({ params }) => {
      return this.reservationService.getConsolesByCampusName(params.campus!);
    },
  });

  eventsResource = rxResource({
    params: () => ({ campus: this.campus(), console: this.selectedConsole() }),
    stream: ({ params }) => {
      return this.reservationService
        .getActiveEvents(params.console!, params.campus!)
        .pipe(
          catchError(err => of([]))
        );
    },
  });

  selectConsole(console: string) {
    this.selectedConsole.set(console);
  }

  events = effect(() => {
    const events = this.eventsResource.value() ?? [];

    if (this.calendarComponent) {
      const api = this.calendarComponent()?.getApi();
      api?.removeAllEvents();
      api?.addEventSource(events);
    }
  });

  calendarOptions: CalendarOptions = {
    timeZone: 'UTC',
    initialView: 'timeGridWeek',
    locale: 'es',
    plugins: [timeGridPlugin, interactionPlugin],
    events: this.eventsResource.value(),
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short',
      hour12: true,
    },
    selectAllow: (selectInfo) => {
      const now = new Date();
      const start = selectInfo.start;

      return start.getTime() > now.getTime();
    },
    headerToolbar: {
      left: '',
      center: 'title',
      right: '',
    },
    footerToolbar: false,
    allDaySlot: false,
    slotDuration: '01:00:00',
    selectable: true,
    selectOverlap: false,
    selectMirror: true,
    nowIndicator: true,
    hiddenDays: [0, 6],
    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',
    height: '500px',
    expandRows: true,
    dayHeaderFormat: { weekday: 'long' },
    select: (info) => {
      const start = info.start;
      const end = new Date(start);
      end.setHours(start.getHours() + 1);

      console.log('Reserva seleccionada:', start, end);
    },
  };
}
