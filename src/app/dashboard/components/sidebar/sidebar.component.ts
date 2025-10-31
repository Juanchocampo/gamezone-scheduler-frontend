import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'dashboard-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private router = inject(Router) 
  currentMode = signal<'corporate' | 'sunset'>('corporate');
  authService = inject(AuthService)

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

  logout(){
    this.authService.logout()
    this.router.navigateByUrl('/auth')
  }
}
