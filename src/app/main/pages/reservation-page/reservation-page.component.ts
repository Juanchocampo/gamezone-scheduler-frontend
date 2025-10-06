import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'reservation-page',
  imports: [FullCalendarModule],
  templateUrl: './reservation-page.component.html',
})
export default class ReservationPageComponent {
  reservationService = inject(ReservationService);
  selectedConsole = signal<string | null>(null);
  change = signal<boolean>(false)
  campus = toSignal(
    inject(ActivatedRoute).paramMap.pipe(
      tap(() => this.selectedConsole.set(null)),
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
    params: () => ({ campus: this.campus(), console: this.selectedConsole(), change: this.change() }),
    stream: ({ params }) => {
      return this.reservationService
        .getActiveEvents(params.console!, params.campus!)
        .pipe(catchError((err) => of([])));
    },
  });

  selectConsole(console: string) {
    this.selectedConsole.set(console);
  }
  pad = (n: number) => n.toString().padStart(2, '0');

  formatLocalDate = (date: Date) => {
    return (
      date.getFullYear() +
      '-' +
      this.pad(date.getMonth() + 1) +
      '-' +
      this.pad(date.getDate()) +
      'T' +
      this.pad(date.getHours()) +
      ':' +
      this.pad(date.getMinutes()) +
      ':' +
      this.pad(date.getSeconds())
    );
  };

  events = effect(() => {
    const events = this.eventsResource.value() ?? [];

    if (this.calendarComponent) {
      const api = this.calendarComponent()?.getApi();
      api?.removeAllEvents();
      api?.addEventSource(events);
    }
  });

  calendarOptions: CalendarOptions = {
    timeZone: 'local',
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
      const end = selectInfo.end;

      return end.getTime() > now.getTime();
    },
    headerToolbar: {
      left: '',
      center: 'title',
      right: '',
    },
    editable: false,
    footerToolbar: false,
    allDaySlot: false,
    slotDuration: '01:00:00',
    selectable: true,
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

      Swal.fire({
        title: 'Quieres guardar esta reserva?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.reservationService
            .createReservations(
              this.selectedConsole()!,
              this.campus()!,
              this.formatLocalDate(start)
            )
            .subscribe({
              next: (res) => {
                console.log(res)
                Swal.fire('Reserva guardada exitosamente!', '', 'success');
                this.change.set(!this.change())
              },
              error: (err: HttpErrorResponse) => {
                if (err.status === 409) {
                  Swal.fire({
                    title: 'Conflicto',
                    text: 'Ya el usuario tiene una reserva activa',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar',
                  });
                } else if (err.status === 403) {
                  Swal.fire({
                    title: 'Acceso restringido',
                    text: 'Tu cuenta ha sido suspendida por incumplir las normas de uso. Si crees que es un error, contacta a algún administrador',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                  });
                } else {
                  Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error inesperado',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                  });
                }
              },
            });
          Swal.fire('Reserva guardada exitosamente!', '', 'success');
        } else if (result.isDenied) {
          Swal.fire('Reserva no guardada', '', 'info');
        }
      });
    },
  };
}
