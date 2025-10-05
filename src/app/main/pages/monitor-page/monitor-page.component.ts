import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReservationService } from '../../services/reservation.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-monitor-page',
  imports: [DatePipe, TitleCasePipe],
  styles: [
    `
    input::placeholder{
      opacity: .5
    }
    `
  ],
  templateUrl: './monitor-page.component.html',
})
export default class MonitorPageComponent { 
  private reservationService = inject(ReservationService)

  reservationsResource = rxResource({
    stream: () => {
      return this.reservationService.getActiveReservations().pipe(
        catchError(err => {
          console.log(err)
          return of([])
        })
      )
    }
  })

}
