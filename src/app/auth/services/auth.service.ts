import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthResponse, UserMapped } from '../interfaces/auth.interface';
import { UserRoleMap } from '../mapper/Users.mapper';
import { rxResource } from '@angular/core/rxjs-interop';

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
  private _user = signal<UserMapped | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private http = inject(HttpClient);

  user = computed(() => this._user());
  token = computed(() => this._token());
  isAdmin = computed<boolean>(() => this._user()?.roles.includes('admin') ?? false)
  isMonitor = computed<boolean>(() => this._user()?.roles.includes('monitor')! ?? false)

  statusResource = rxResource({
    stream: () => {
      return this.checkStatus()
    }
  })

  authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) {
      return 'authenticated';
    }
    return 'not-authenticated';
  });

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, { email, password }).pipe(
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
        withCredentials: true,
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
    return this.http.post<AuthResponse>(`${baseUrl}/auth/refresh`, {}).pipe(
      tap((resp) => {
        this.handleAuthSuccess(resp);
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  handleAuthSuccessInterceptor({ access_token, user }: AuthResponse): void {
    this._token.set(access_token);
    this._user.set(UserRoleMap.userRoleToArray(user));
    this._authStatus.set('authenticated');
    localStorage.setItem('token', access_token);
  }

  private handleAuthSuccess({ access_token, user }: AuthResponse): boolean {
    this._token.set(access_token);
    this._user.set(UserRoleMap.userRoleToArray(user));
    this._authStatus.set('authenticated');
    localStorage.setItem('token', access_token);
    return true;
  }

  handleAuthError(err: any): Observable<boolean> {
    this.logout();
    return throwError(() => err);
  }

  logout() {
    this._token.set(null);
    this._user.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');

    this.http.post(`${baseUrl}/auth/logout`, {}).subscribe(res => res);
  }
}
