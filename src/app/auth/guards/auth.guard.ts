import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanMatchFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = await firstValueFrom(authService.checkStatus());
  if (isAuth) {
    router.navigateByUrl('');
    return false;
  }
  return true;
};
