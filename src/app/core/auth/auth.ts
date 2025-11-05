import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);

  private token = signal<string | null>(localStorage.getItem('jwt'));
  user = signal<User | null>(null);

  isLoggedIn = computed(() => !!this.token());

  constructor() {
    effect(() => {
      const token = this.token();
      if (token) {
        this.loadProfile();
      } else {
        this.user.set(null);
      }
    });
  }

  async login(email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
    );

    this.token.set(res.access_token);
    localStorage.setItem('jwt', res.access_token);

    await this.loadProfile();
  }

  async register(email: string, password: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/auth/register`, { email, password })
    );
  }

  async loadProfile(): Promise<void> {
    try {
      const user = await firstValueFrom(this.http.get<User>(`${environment.apiUrl}/auth/me`));
      this.user.set(user);
    } catch {
      this.logout();
    }
  }

  logout(): void {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem('jwt');
  }

  getToken(): string | null {
    return this.token();
  }
}
