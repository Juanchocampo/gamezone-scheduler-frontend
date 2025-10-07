import { Component, input } from '@angular/core';
import { Reservations } from '../../interfaces/reservation.interface';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'reservation-list',
  imports: [TitleCasePipe, DatePipe, RouterLink],
  templateUrl: './reservation-list.component.html',
})
export class ReservationListComponent {
  reservations = input.required<Reservations[]>()
  isLoading = input.required<boolean>()
  route = input.required<string>()
}
