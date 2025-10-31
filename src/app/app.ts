import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
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
}
