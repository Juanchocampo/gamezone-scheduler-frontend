import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { map } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { ReservationCardComponent } from "../../components/reservation-card/reservation-card.component";

@Component({
  selector: 'app-reservation-details',
  imports: [ ReservationCardComponent],
  templateUrl: './monitor-reservation-details.component.html',
})
export default class ReservationDetailsComponent {
  private router = inject(Router);
  private reservationService = inject(ReservationService);
  private id = toSignal(inject(ActivatedRoute).paramMap.pipe(map((res) => res.get('id'))));
  private hasChanges = signal<boolean>(false);

  reservationResource = rxResource({
    params: () => ({ id: this.id(), changes: this.hasChanges() }),
    stream: ({ params }) => {
      return this.reservationService.getActiveReservationsById(params.id!);
    },
  });

  markAsAttended() {
    this.reservationService.markAsAttended(this.id()!).subscribe({
      next: (success) => {
        if (success) {
          Swal.fire('¡Hecho!', 'La entrada de la reserva ha sido marcada', 'success');
          this.hasChanges.set(!this.hasChanges())
        } else {
          Swal.fire('Error', 'No se pudo marcar la entrada de la reserva', 'error');
        }
      },
    });
  }

  markAsAttendedOut(){
    this.reservationService.markAsAttendedOut(this.id()!).subscribe({
      next: (success) => {
        if (success) {
          Swal.fire('¡Hecho!', 'La salida de la reserva ha sido marcada', 'success');
          this.router.navigateByUrl('/monitor')
        } else {
          Swal.fire('Error', 'No se pudo marcar la salida de la reserva', 'error');
        }
      },
    });
  }

  goBack() {
    this.router.navigateByUrl('/monitor');
  }
}
