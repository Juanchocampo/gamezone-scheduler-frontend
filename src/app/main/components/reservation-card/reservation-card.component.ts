import { Component, inject, input, output } from '@angular/core';
import { Reservations } from '../../interfaces/reservation.interface';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { Router } from '@angular/router';

@Component({
  selector: 'reservation-card',
  imports: [TitleCasePipe, DatePipe, QRCodeComponent],
  templateUrl: './reservation-card.component.html',
})
export class ReservationCardComponent {
  router = inject(Router)
  reservation = input.required<Reservations>()
  isLoading = input.required<boolean>()
  isMonitor = input<boolean>(false)
  isAdmin = input<boolean>(false)
  markAttended = output()
  markAttendedOut = output()
  routeBack = input.required<string>()

  markAsAttended(){
    this.markAttended.emit()
  }
  markAsAttendedOut(){
    this.markAttendedOut.emit()
  }
  goBack(){
    this.router.navigateByUrl(this.routeBack())
  }

}
