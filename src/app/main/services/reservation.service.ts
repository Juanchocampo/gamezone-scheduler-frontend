import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Console } from '../interfaces/console.interface';
import { map, Observable, tap, } from 'rxjs';
import { ConsoleMapper } from '../mappers/consoles.mapper';
import { EventInput } from '@fullcalendar/core/index.js';
import { Reservations } from '../interfaces/reservation.interface';

const baseUrl = environment.API_URL

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient)

  getConsolesByCampusName(campus: string): Observable<string[]>{
    return this.http.get<Console[]>(`${baseUrl}/reservations/campus/${campus}`).pipe(
      map(res => ConsoleMapper.ArrayConsoleToNameArray(res)),
    )
  }

  getActiveEvents(consoleName: string, campusName: string): Observable<EventInput[]>{
    return this.http.get<EventInput[]>(`${baseUrl}/reservations/events/${consoleName}/${campusName}`)
  }

  getActiveReservations(): Observable<Reservations[]>{
    return this.http.get<Reservations[]>(`${baseUrl}/reservations/actives`)
  }
}
