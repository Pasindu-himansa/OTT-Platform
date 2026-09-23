import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Check if token exists in localStorage
  const token = tokenService.getAccessToken();
  if (token) return true;

  router.navigate(['/auth/login']);
  return false;
};
