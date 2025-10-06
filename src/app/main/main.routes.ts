import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { monitorGuard } from './guards/monitor.guard';

export const mainRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home-page/home-page.component'),
        title: 'Home'
      },
      {
        path: 'reservas',
        pathMatch: 'full',
        redirectTo: 'reservas/barranquilla',
      },
      {
        path: 'reservas/:campus',
        loadComponent: () => import('./pages/reservation-page/reservation-page.component'),
        title: 'Reservas'
      },
      {
        path: 'reservas/d/:id',
        loadComponent: () => import('./pages/reservation-details/reservation-details.component'),
        title: 'Detalles de Reserva'
      },
      {
        path: 'monitor',
        loadComponent: () => import('./pages/monitor-page/monitor-page.component'),
        title: 'Panel de Monitor',
        canMatch: [monitorGuard],
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
];

export default mainRoutes;
