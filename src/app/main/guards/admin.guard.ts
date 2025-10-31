import { inject } from '@angular/core';
import type { CanMatchFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

export const adminGuard: CanMatchFn = async (route, segments) => {
  
  const authService = inject(AuthService)

  await firstValueFrom(authService.checkStatus())

  if (authService.isAdmin()){
    return true
  }

  return false;

};
