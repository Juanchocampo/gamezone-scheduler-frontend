import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ReservationService } from '../../../main/services/reservation.service';
import { ActivatedRoute } from '@angular/router';
import { ReservationCardComponent } from "../../../shared/reservation-card/reservation-card.component";

@Component({
  selector: 'dashboard-reservation-details',
  imports: [ReservationCardComponent],
  templateUrl: './dashboard-reservation-details.component.html',
})
export default class DashboardReservationDetailsComponent {
  private reservationService = inject(ReservationService);
  private id = toSignal(inject(ActivatedRoute).paramMap.pipe(map((res) => res.get('id'))));

  reservationResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => {
      return this.reservationService.getReservationsById(params.id!);
    },
  });
}
