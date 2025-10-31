import { Component, inject, signal } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReservationCardComponent } from "../../../shared/reservation-card/reservation-card.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-reserva',
  imports: [ ReservationCardComponent],
  templateUrl: './mi-reserva.component.html',
})
export default class MiReservaComponent {
  private reservationService = inject(ReservationService)
  private router = inject(Router)

  reservationResource = rxResource({
    stream: ({params}) => {
      return this.reservationService.getMyReservation()
    }
  })

  markAsCancelled(){
    this.reservationService.cancelReservation(this.reservationResource.value()?.id!).subscribe()
    this.router.navigateByUrl('/home')
  }
}
