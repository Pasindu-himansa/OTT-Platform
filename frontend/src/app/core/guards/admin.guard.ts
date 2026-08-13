import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const adminGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const user = tokenService.getUser();
  console.log('Admin guard - user:', user);

  if (user && user.role === 'admin') return true;

  router.navigate(['/home']);
  return false;
};
