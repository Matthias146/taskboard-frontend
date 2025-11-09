import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from '../auth/auth';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(Auth);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  return true;

  return true;
};
