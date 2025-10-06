import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Console } from '../interfaces/console.interface';
import { catchError, debounceTime, map, Observable, of, tap, throwError, } from 'rxjs';
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

  getActiveReservations(status: string, document: string, offset: number): Observable<Reservations[]>{
    return this.http.get<Reservations[]>(`${baseUrl}/reservations/actives`, {
      params: {
        status_name: status,
        document: document,
        offset: offset,
        limit: 5
      }
    }).pipe(
        catchError(err => {
          return of([])
        })
      )
  }

  createReservations(consoleName: string, campusName: string, startsAt: string){
    return this.http.post(`${baseUrl}/reservations`, {
      console_name: consoleName,
      campus_name: campusName,
      starts_at: startsAt
    })
  }
}
