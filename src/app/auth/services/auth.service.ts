import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthResponse, User } from '../interfaces/auth.interface';

const baseUrl = environment.API_URL;
type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
interface RegisterData {
  email: string;
  fullName: string;
  username: string;
  document: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);
  private http = inject(HttpClient);
  user = computed(this._user);
  token = computed(this._token);
  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => {
          this.handleAuthSuccess(resp);
          return true;
        }),
        catchError((err) => this.handleAuthError(err))
      );
  }

  checkStatus(): Observable<boolean> {
    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`).pipe(
      map((resp) => {
        this.handleAuthSuccess(resp);
        return true;
      }),
      catchError((err) => this.handleAuthError(err))
    );
  }

  register(registerForm: RegisterData): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/register`, {
        email: registerForm.email,
        name: registerForm.fullName,
        username: registerForm.username,
        document: registerForm.document.toString(),
        password: registerForm.password,
      })
      .pipe(
        map((resp) => {
          this.handleAuthSuccess(resp);
          return true;
        }),
        catchError((err) => this.handleAuthError(err))
      );
  }

  refresh(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${baseUrl}/auth/refresh`).pipe(
      tap((resp) => {
        this.handleAuthSuccess(resp);
      }),
      catchError((err) => this.handleAuthError(err))
    );
  }

  private handleAuthSuccess({ access_token, user }: AuthResponse) {
    this._token.set(access_token);
    this._user.set(user);
    this._authStatus.set('authenticated');
  }

  private handleAuthError(err: any): Observable<never> {
    this.logout();
    return throwError(() => err); // propaga el error
  }

  logout() {  
    this._token.set(null);
    this._user.set(null);
    this._authStatus.set('not-authenticated');
  }
}
