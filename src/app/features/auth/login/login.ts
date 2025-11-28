import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../core/auth/auth';
import { Router, RouterLink } from '@angular/router';
import { form, Field, required, email, minLength } from '@angular/forms/signals';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Field, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  triedSubmit = signal(false);

  model = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.model as any, (f: any) => {
    required(f.email);
    email(f.email);

    required(f.password);
    minLength(f.password, 6);
  }) as any;

  hasError(fieldSignal: any, kind: string): boolean {
    const errors = fieldSignal().errors();
    return Array.isArray(errors) && errors.some((e: any) => e.kind === kind);
  }

  isInvalid(fieldSignal: any): boolean {
    const errors = fieldSignal().errors();
    return Array.isArray(errors) && errors.length > 0;
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.triedSubmit.set(true);

    const emailErrors = this.loginForm.email().errors();
    const passwordErrors = this.loginForm.password().errors();

    const isEmailInvalid = Array.isArray(emailErrors) && emailErrors.length > 0;
    const isPasswordInvalid = Array.isArray(passwordErrors) && passwordErrors.length > 0;

    if (isEmailInvalid || isPasswordInvalid) {
      console.warn('Formular ungültig');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.model();

    try {
      await this.auth.login(email, password);
      await this.router.navigateByUrl('/dashboard');
    } catch (err: any) {
      const msg =
        err?.error?.message ??
        err?.message ??
        '❌ Login fehlgeschlagen. Bitte überprüfe deine Daten.';
      this.error.set(msg);
    } finally {
      this.loading.set(false);
    }
  }
}
