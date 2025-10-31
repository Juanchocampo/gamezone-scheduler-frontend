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

  authResource = rxResource({
    stream: () => {
      return this.authService.checkStatus()
    }
  })

  currentMode = signal<'corporate' | 'sunset'>('corporate');

  constructor() {
    const saved = localStorage.getItem('theme') as 'corporate' | 'sunset' | null;
    if (saved) {
      this.currentMode.set(saved);
      this.applyTheme(saved);
    } else {
      this.applyTheme(this.currentMode());
    }
  }
  
  private applyTheme(theme: 'corporate' | 'sunset') {
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  toggleMode() {
    const newMode = this.currentMode() === 'corporate' ? 'sunset' : 'corporate';
    this.currentMode.set(newMode);
    localStorage.setItem('theme', newMode);
    this.applyTheme(newMode);
  }


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

