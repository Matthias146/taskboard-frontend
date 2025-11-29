import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { Auth } from '../auth/auth';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  host: {
    '(window:resize)': 'onResize($event)',
    '[class.layout--collapsed]': 'collapsed()',
  },
})
export class Layout {
  collapsed = signal(false);

  constructor() {
    this.updateCollapseState(window.innerWidth);
  }

  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    this.updateCollapseState(width);
  }

  private updateCollapseState(width: number) {
    if (width < 1026 && !this.collapsed()) {
      this.collapsed.set(true);
    } else if (width >= 1026 && this.collapsed()) {
      this.collapsed.set(false);
    }
  }

  toggleSidebar() {
    this.collapsed.update((v) => !v);
  }
}
