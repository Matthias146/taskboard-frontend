import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  private theme = signal<'light' | 'dark'>('light');

  constructor() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') this.theme.set('dark');

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
