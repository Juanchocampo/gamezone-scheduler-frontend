import { Component, inject } from '@angular/core';
import { ReservationCardComponent } from '../../components/reservation-card/reservation-card.component';
import { ReservationService } from '../../services/reservation.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'admin-reservation-details',
  imports: [ReservationCardComponent],
  templateUrl: './admin-reservation-details.component.html',
})
export default class AdminReservationDetailsComponent {
  private reservationService = inject(ReservationService);
  private id = toSignal(inject(ActivatedRoute).paramMap.pipe(map((res) => res.get('id'))));

  reservationResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => {
      return this.reservationService.getReservationsById(params.id!);
    },
  });
}
