import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('auth/refresh') ||
    req.url.includes('auth/logout')
  ) {
    const authReq = req.clone({
      withCredentials: true
    });
    return next(authReq);
  }

  const token = authService.token();

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
    withCredentials: true
  });

  if(
    req.url.includes('/auth')
  ){
    return next(authReq).pipe(
      catchError((err) => {
        return authService.refresh().pipe(
          switchMap((res) => {
            const newReq = authReq.clone({
              headers: authReq.headers.set('Authorization', `Bearer ${res.access_token}`),
            });
            return next(newReq);
          }),
          catchError((err) => {
            authService.logout()
            return throwError(() => err)
          })
        );
      })
    );
  }
  return next(authReq)
};
