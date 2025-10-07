import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'main-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private router = inject(Router);
  authService = inject(AuthService);
  private details = viewChild<ElementRef<HTMLDetailsElement>>('details');

  currentMode = signal<'corporate' | 'sunset'>('corporate');

  constructor() {
    // Al iniciar, leer localStorage
    const saved = localStorage.getItem('theme') as 'corporate' | 'sunset' | null;
    if (saved) {
      this.currentMode.set(saved);
      this.applyTheme(saved);
    } else {
      this.applyTheme(this.currentMode());
    }
  }

  toggleMode() {
    const newMode = this.currentMode() === 'corporate' ? 'sunset' : 'corporate';
    this.currentMode.set(newMode);
    localStorage.setItem('theme', newMode);
    this.applyTheme(newMode);
  }

  private applyTheme(theme: 'corporate' | 'sunset') {
    document.documentElement.setAttribute('data-theme', theme);
  }

  authResource = rxResource({
    stream: () => {
      return this.authService.checkStatus()
    }
  })

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

