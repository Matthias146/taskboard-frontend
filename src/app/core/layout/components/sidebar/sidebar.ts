import { Component, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  collapsed = input<boolean>(false);
  toggle = output<void>();

  navItems = [
    { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
    { icon: '✅', label: 'Tasks', path: '/tasks' },
    { icon: '👥', label: 'Kontakte', path: '/contacts' },
    { icon: '⚙️', label: 'Einstellungen', path: '/settings' },
  ];
}
