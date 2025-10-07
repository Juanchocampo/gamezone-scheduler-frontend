import { Component, effect, inject, signal } from '@angular/core';
import { ReservationListComponent } from '../../components/reservation-list/reservation-list.component';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';
import { Router } from '@angular/router';
import { Reservations } from '../../interfaces/reservation.interface';

const ReservationStatus: Record<string, number> = {
  Pendiente: 1,
  Atendido: 2,
  'En uso': 3,
  Expirado: 4,
  Cancelado: 5,
};

@Component({
  selector: 'app-admin-page',
  imports: [ReservationListComponent],
  templateUrl: './admin-page.component.html',
})
export default class AdminPageComponent {
  private reservationService = inject(ReservationService);
  private router = inject(Router);
  status = signal<string | null>(null);
  limit = signal<number>(5);
  offset = signal<number>(0);
  document = signal<string | null>(null);
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
        .getAllReservations(params.status ?? '', params.document ?? '', params.offset)
        .pipe(
          tap((res) => {
            this.reservations.update((prev) => [...prev!, ...res]);
          })
        );
    },
  });

  changeStatus = effect(() => {
    const currentStatus = this.status();
    const document = this.document();

    this.reservations.set([]);
    this.offset.set(0);
  });

  loadMore() {
    this.offset.update((n) => n + this.limit());
  }

}
