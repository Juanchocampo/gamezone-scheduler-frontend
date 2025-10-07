import { Component, inject } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode'
import { ReservationService } from '../../services/reservation.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ReservationCardComponent } from "../../components/reservation-card/reservation-card.component";

@Component({
  selector: 'app-mi-reserva',
  imports: [ ReservationCardComponent],
  templateUrl: './mi-reserva.component.html',
})
export default class MiReservaComponent {
  private reservationService = inject(ReservationService)

  reservationResource = rxResource({
    stream: () => {
      return this.reservationService.getMyReservation()
    }
  })
}
