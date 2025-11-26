import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../auth';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const token = auth.getToken();

  const isPublicEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  let authReq = req;

  if (token && !isPublicEndpoint) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(authReq);
  }

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isPublicEndpoint) {
        console.warn('⚠️ Session abgelaufen – Logout wird erzwungen.');

        auth.logout();

        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};
