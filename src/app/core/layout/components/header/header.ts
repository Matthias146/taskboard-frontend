import { Component, computed, inject, signal } from '@angular/core';
import { Auth } from '../../../auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private auth = inject(Auth);
  private router = inject(Router);

  isMenuOpen = signal(false);

  readonly user = computed(() => this.auth.user());
  readonly isLoggedIn = computed(() => this.auth.isLoggedIn());

  readonly displayName = computed(() => {
    const u = this.user();
    if (!u) return '';
    return (u as { name?: string; email?: string }).name || u.email || '';
  });

  readonly roleLabel = computed(() => {
    const u = this.user() as { role?: string } | null;
    if (!u?.role) return '';
    if (u.role === 'admin') return 'Admin';
    return 'User';
  });

  readonly initials = computed(() => {
    const name = this.displayName();
    if (!name) return '?';

    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  });

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  async logout(): Promise<void> {
    this.auth.logout();
    await this.router.navigate(['/login']);
    this.isMenuOpen.set(false);
  }
}
