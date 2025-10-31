import { Routes } from '@angular/router';
import { adminGuard } from '../main/guards/admin.guard';

export const dashboardRoutes: Routes = [

  {
    path: '',
    loadComponent: () => import('./layout/dashboard-layout/dashboard-layout.component'),
    canMatch: [adminGuard],
    title: 'Dashboard',
    children: [
      {
        path: 'reservations',
        loadComponent: () => import('./pages/reservations-page/reservations-page.component')
      },
      {
        path: 'reservations/:id',
        loadComponent: () => import('./pages/dashboard-reservation-details/dashboard-reservation-details.component')
      },
      {
        path: '**',
        redirectTo: 'reservations'
      }
    ]
  }

]

export default dashboardRoutes