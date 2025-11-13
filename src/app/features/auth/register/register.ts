import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  async onSubmit() {
    if (this.form.invalid) return;

    const { name, email, password, confirmPassword } = this.form.value;
    if (password !== confirmPassword) {
      this.errorMessage.set('Die Passwörter stimmen nicht überein.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      await firstValueFrom(
        this.http.post('http://localhost:3000/auth/register', { name, email, password })
      );

      this.router.navigate(['/login']);
    } catch (error: any) {
      this.errorMessage.set(error.error?.message ?? 'Registrierung fehlgeschlagen');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
