import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { monitorGuard } from './guards/monitor.guard';
import { adminGuard } from './guards/admin.guard';

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
        path: 'admin',
        loadComponent: () => import('./pages/admin-page/admin-page.component'),
        title: 'Panel de administrador',
        canMatch: [adminGuard] 
      },
      {
        path: 'admin/r/:id',
        loadComponent: () => import('./pages/admin-reservation-details/admin-reservation-details.component'),
        title: 'Detalles de Reserva',
        canMatch: [adminGuard]
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
];

export default mainRoutes;
