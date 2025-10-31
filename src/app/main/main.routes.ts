import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { monitorGuard } from './guards/monitor.guard';
import { adminGuard } from './guards/admin.guard';
import HomePageComponent from './pages/home-page/home-page.component';

export const mainRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomePageComponent,
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
        path: 'reserva/me',
        loadComponent: () => import('./pages/mi-reserva/mi-reserva.component'),
        title: 'Mi reserva'
      },
      {
        path: 'monitor',
        loadComponent: () => import('./pages/monitor-page/monitor-page.component'),
        title: 'Panel de Monitor',
        canMatch: [monitorGuard],
      },
      {
        path: 'monitor/r/:id',
        loadComponent: () => import('./pages/monitor-reservation-details/monitor-reservation-details.component'),
        title: 'Detalles de Reserva',
        canMatch: [monitorGuard]
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
];

export default mainRoutes;
