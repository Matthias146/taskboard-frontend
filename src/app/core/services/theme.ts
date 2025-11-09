import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  private theme = signal<'light' | 'dark'>('light');

  constructor() {
    // 🌙 Initialer Zustand aus LocalStorage laden
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') this.theme.set('dark');

    // Reagiere auf Änderungen automatisch
    effect(() => {
      const mode = this.theme();
      document.documentElement.setAttribute('data-theme', mode);
      localStorage.setItem('theme', mode);
    });
  }

  toggle() {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  isDark() {
    return this.theme() === 'dark';
  }
}
