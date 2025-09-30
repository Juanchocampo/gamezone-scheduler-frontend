import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const authReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${authService.token()}`),
  });

  return next(authReq).pipe(
    catchError((err) => {
      if (req.url.includes('/auth/refresh')) {
        authService.logout();
        return throwError(() => err);
      }
      return authService.refresh().pipe(
        switchMap((res) => {
          const newReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${res.access_token}`,
            },
          });
          return next(newReq);
        }),
        catchError((err) => {
          authService.logout();
          return throwError(() => err);
        })
      );
    })
  );
};
