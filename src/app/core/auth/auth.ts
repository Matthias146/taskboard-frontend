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
    // const storedToken = localStorage.getItem('jwt');
    // if (storedToken) {
    //   this.token.set(storedToken);
    //   this.loadProfile(); // lädt Profil einmalig beim Start
    // }
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
    try {
      const res = await firstValueFrom(
        this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
          email,
          password,
        })
      );

      if (!res || !res.access_token) {
        console.error('❌ Kein access_token in der Antwort erhalten:', res);
        throw new Error('Kein Token erhalten');
      }
      if (!res?.access_token) throw new Error('Kein Token erhalten');
      this.token.set(res.access_token);
      localStorage.setItem('jwt', res.access_token);

      await this.loadProfile();
    } catch (error: any) {
      console.error('❌ Fehler im login():', error);
      throw error;
    }
  }

  async loadProfile(): Promise<void> {
    try {
      const user = await firstValueFrom(this.http.get<User>(`${environment.apiUrl}/auth/me`));
      this.user.set(user);
    } catch (error) {
      console.error('❌ Fehler in loadProfile():', error);
      console.error('🔍 Token im Signal:', this.token());
      console.error('🔍 Token im LocalStorage:', localStorage.getItem('jwt'));
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
