import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login-page/login-page.component'),
        canMatch: [
          authGuard
        ]
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register-page/register-page.component')
      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
]

export default routes