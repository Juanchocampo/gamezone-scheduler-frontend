import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

const baseUrl = environment.API_URL

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private http = inject(HttpClient)
  
  getNumberOfReservations(): Observable<number>{
    return this.http.get<number>(`${baseUrl}/stats/reservations`)
  }

  getNumberOfUsers(): Observable<number>{
    return this.http.get<number>(`${baseUrl}/stats/users`)
  }

  getActiveReservations(): Observable<number>{
    return this.http.get<number>(`${baseUrl}/stats/actives`)
  }

}
