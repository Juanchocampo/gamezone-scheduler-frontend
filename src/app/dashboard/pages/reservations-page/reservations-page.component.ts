import { Component, inject, OnInit, signal } from '@angular/core';
import { StatsService } from '../../services/stats.service';
import dashboardReservations from '../../components/dashboard-reservation-list/dashboard-reservation-list';

@Component({
  selector: 'app-reservations-page',
  imports: [dashboardReservations],
  templateUrl: './reservations-page.component.html',
})
export default class ReservationsPageComponent implements OnInit {
  allReservations = signal<number>(0)
  AllUsers = signal<number>(0)
  activeResetvations = signal<number>(0)
  
  private statsService = inject(StatsService)

  ngOnInit(): void {
    this.statsService.getNumberOfReservations().subscribe(res => {
      this.allReservations.set(res)
    })
    this.statsService.getNumberOfUsers().subscribe(res => {
      this.AllUsers.set(res)
    })
    this.statsService.getActiveReservations().subscribe(res => {
      this.activeResetvations.set(res)
    })
  }
  
}
