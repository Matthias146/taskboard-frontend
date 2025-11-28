import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { form, Field, required, email, minLength } from '@angular/forms/signals';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [Field, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private http = inject(HttpClient);
  private router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  triedSubmit = signal(false);

  model = signal<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  registerForm = form(this.model as any, (f: any) => {
    required(f.name);

    required(f.email);
    email(f.email);

    required(f.password);
    minLength(f.password, 6);

    required(f.confirmPassword);
  }) as any;

  hasError(field: any, kind: string): boolean {
    const errors = field().errors();
    return Array.isArray(errors) && errors.some((e: any) => e.kind === kind);
  }

  isInvalid(field: any): boolean {
    const errors = field().errors();
    return Array.isArray(errors) && errors.length > 0;
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.triedSubmit.set(true);
    this.errorMessage.set(null);

    const nameInv = this.isInvalid(this.registerForm.name);
    const emailInv = this.isInvalid(this.registerForm.email);
    const pwInv = this.isInvalid(this.registerForm.password);
    const confirmInv = this.isInvalid(this.registerForm.confirmPassword);

    if (nameInv || emailInv || pwInv || confirmInv) {
      return;
    }

    const { name, email, password, confirmPassword } = this.model();

    if (password !== confirmPassword) {
      this.errorMessage.set('Die Passwörter stimmen nicht überein.');
      return;
    }

    this.isSubmitting.set(true);

    try {
      await firstValueFrom(
        this.http.post('http://localhost:3000/auth/register', { name, email, password })
      );

      await this.router.navigate(['/login']);
    } catch (error: any) {
      this.errorMessage.set(error.error?.message ?? 'Registrierung fehlgeschlagen');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
