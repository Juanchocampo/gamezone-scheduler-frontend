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
  private _token = signal<string | null>(localStorage.getItem('token'));
  private http = inject(HttpClient);

  // Computed properties simplificadas
  user = computed(() => this._user());
  token = computed(() => this._token());
  authStatus = computed(() => this._authStatus());

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, { email, password })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((err) => this.handleAuthError(err))
      );
  }

  checkStatus(): Observable<boolean> {
    const token = this.token();
    if (!token) {
      this._authStatus.set('not-authenticated');
      return of(false);
    }

    return this.http
      .get<AuthResponse>(`${baseUrl}/auth/check-status`, {
        withCredentials: true
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((err) => {
          this._authStatus.set('not-authenticated');
          return of(false);
        })
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
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((err) => this.handleAuthError(err))
      );
  }

  refresh(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/refresh`,{}).pipe(
      tap((resp) => {
        this.handleAuthSuccess(resp);
      }),
      catchError((err) => {
        // No hacer logout aquí, dejar que el interceptor maneje
        return throwError(() => err);
      })
    );
  }

  handleAuthSuccessInterceptor({access_token, user}: AuthResponse): void {
    this._token.set(access_token)
    this._user.set(user)
    this._authStatus.set('authenticated')
    localStorage.setItem('token', access_token)
  }

  private handleAuthSuccess({ access_token, user }: AuthResponse): boolean {
    this._token.set(access_token);
    this._user.set(user);
    this._authStatus.set('authenticated');
    localStorage.setItem('token', access_token);
    return true;
  }

  handleAuthError(err: any): Observable<never> {
    console.log(err)
    this.logout();
    return throwError(() => err);
  }

  logout() {
    this._token.set(null);
    this._user.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');

    // Logout en backend (no crítico)
    this.http.post(`${baseUrl}/auth/logout`, {}, {
      withCredentials: true
    }).subscribe({
      next: () => console.log('Logged out on server'),
      error: () => console.error('Error logging out on server')
    });
  }
}