import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-details',
  imports: [],
  templateUrl: './reservation-details.component.html',
})
export default class ReservationDetailsComponent {
  router = inject(Router)

  goBack(){
    this.router.navigateByUrl('/monitor')
  }
}
