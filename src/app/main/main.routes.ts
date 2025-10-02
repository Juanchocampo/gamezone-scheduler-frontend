import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const mainRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home-page/home-page.component')
      },
      {
        path: 'reservas/:name',
        loadComponent: () => import('./pages/reservation-page/reservation-page.component')
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  }
]

export default mainRoutes