import { Component, input } from '@angular/core';
import { Reservations } from '../../interfaces/reservation.interface';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'reservation-list',
  imports: [TitleCasePipe, DatePipe],
  templateUrl: './reservation-list.component.html',
})
export class ReservationListComponent {
  reservations = input.required<Reservations[]>()
  isLoading = input.required<boolean>()
}
