import { Component, effect, inject, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ReservationService } from '../../services/reservation.service';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { ReservationListComponent } from '../../components/reservation-list/reservation-list.component';
import { Reservations } from '../../interfaces/reservation.interface';

const ReservationStatus: Record<string, number> = {
  Pendiente: 1,
  Atendido: 2,
  'En uso': 3,
  Expirado: 4,
  Cancelado: 5,
};

@Component({
  selector: 'app-monitor-page',
  imports: [ReservationListComponent],
  styles: [
    `
      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type='number'] {
        -moz-appearance: textfield;
      }

      input::placeholder {
        opacity: 0.5;
      }
    `,
  ],
  templateUrl: './monitor-page.component.html',
})
export default class MonitorPageComponent {
  private reservationService = inject(ReservationService);
  document = signal<string | null>(null);
  status = signal<string | null>(null);
  limit = signal<number>(5);
  offset = signal<number>(0);
  isLoading = signal<boolean>(false)
  reservations = signal<Reservations[] | null>(null);

  private debouncedDocument$ = toSignal(
    toObservable(this.document).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((v) => v !== null)
    )
  );

  reservationsResource = rxResource({
    params: () => ({
      status: this.status(),
      document: this.debouncedDocument$(),
      offset: this.offset(),
    }),
    stream: ({ params }) => {

      return this.reservationService
        .getActiveReservations(params.status ?? '', params.document ?? '', params.offset)
        .pipe(
          tap((res) => {
            this.reservations.update(prev => [...prev!, ...res]);
          }),
        );
    },
  });

  changeStatus = effect(() => {
    const currentStatus = this.status();
    const document = this.document();

    this.reservations.set([])
    this.offset.set(0);
  });

  loadMore() {
    this.offset.update((n) => n + this.limit());
  }
}
