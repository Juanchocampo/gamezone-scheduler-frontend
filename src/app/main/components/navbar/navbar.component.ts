import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'main-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private router = inject(Router);
  authService = inject(AuthService);
  private details = viewChild<ElementRef<HTMLDetailsElement>>('details');

  closeDetails() {
    const details = this.details()?.nativeElement;
    if (details) {
      details.open = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
