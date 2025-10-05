import { inject } from '@angular/core';
import type { CanMatchFn } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const monitorGuard: CanMatchFn = async(route, segments) => {

  const authService = inject(AuthService)

  await firstValueFrom(authService.checkStatus())

  if (authService.isMonitor()){
    return true
  }

  return false;
};
